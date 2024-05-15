import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

import { ErrorImplementation } from '../utils/error-implementation';
import { UserService } from '../user/user.service';
import { PasswordHashService } from '../password-hash/password-hash.service';
import { MailSenderService } from '../mail-sender/mail-sender.service';

import { EmailConfirm } from './entities/email-confirm.entity';
import { ResetPassword } from './entities/reset-password.entity';
import { SignUpRequest, StatusResponse, User } from './auth.pb';

@Injectable()
export class AuthService {
  protected readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(EmailConfirm)
    private readonly emailConfirmRepository: Repository<EmailConfirm>,
    @InjectRepository(ResetPassword)
    private readonly resetPasswordRepository: Repository<ResetPassword>,
    private configService: ConfigService,
    private readonly userService: UserService,
    private readonly passwordHashService: PasswordHashService,
    private readonly mailSenderService: MailSenderService,
  ) {}

  private cryptoToken(): string {
    const buffer = crypto.randomBytes(16);
    if (!buffer) throw ErrorImplementation.badRequest('Token error');
    const token = buffer.toString('hex');
    return token;
  }

  private emailConfirmation({ to, token }: { to: string; token: string }) {
    return this.mailSenderService.sendMail({
      to,
      subject: 'Email confirmation',
      html: `
              <h2>Please, follow the link to confirm your email</h2>
              <h4>If you don't try to login or register, ignore this mail</h4>
              <hr/>
              <br/>
              <a href='${this.configService.get('FRONTEND_URL')}/confirm-email/${token}'>Link for email confirmation</a>
            `,
    });
  }

  async signUp(signUpDto: SignUpRequest): Promise<User> {
    const { email, password, userName } = signUpDto;
    const candidate = await this.userService.getUserByEmailWithRelations(email);
    if (candidate && candidate.isVerified) {
      throw ErrorImplementation.badRequest(
        'User with this email already exists',
      );
    }
    if (candidate && !candidate.isVerified) {
      throw ErrorImplementation.badRequest('Email not confirmed');
    }
    const token = this.cryptoToken();
    this.emailConfirmation({ to: email, token });

    const passwordHash = await this.passwordHashService.create(password);
    const user = await this.userService.create({
      email,
      passwordHash,
      userName,
    });
    try {
      await this.emailConfirmRepository.save({
        user,
        token,
        expiredAt: new Date(Date.now() + 1000 * 60 * 60),
      });
    } catch (error) {
      this.logger.error(error.message);
      throw ErrorImplementation.forbidden('Error while creating email confirm');
    }

    return user;
  }

  async signIn(email: string, password: string): Promise<User> {
    const user = await this.userService.getUserByEmailWithRelations(email);
    if (!user) {
      throw ErrorImplementation.badRequest('Incorrect login or password');
    }
    await this.passwordHashService.compare(password, user.passwordHash);

    if (!user.isVerified) {
      if (user.emailConfirm?.expiredAt < new Date()) {
        const token = this.cryptoToken();
        this.emailConfirmation({ to: email, token });
      }
      throw ErrorImplementation.badRequest('Email not confirmed');
    }

    return user;
  }

  async confirmEmail(token: string): Promise<StatusResponse> {
    const emailConfirm = await this.emailConfirmRepository.findOne({
      where: { token },
      relations: ['user'],
    });
    if (!emailConfirm) {
      throw ErrorImplementation.badRequest('Invalid token');
    }
    if (new Date() > new Date(emailConfirm.expiredAt)) {
      throw ErrorImplementation.badRequest('Token expired');
    }
    try {
      await this.userService.update({
        id: emailConfirm.user.id,
        isVerified: true,
      });
      await this.emailConfirmRepository.update(emailConfirm.id, {
        verifiedAt: new Date(),
        token: null,
        expiredAt: null,
      });
    } catch (error) {
      this.logger.error(error.message);
      throw ErrorImplementation.forbidden('Error while confirming email');
    }

    return {
      status: true,
      message: 'Email successfully confirmed',
    };
  }

  async resendEmail(email: string): Promise<StatusResponse> {
    const user = await this.userService.getUserByEmailWithRelations(email);
    if (!user) {
      throw ErrorImplementation.notFound('User not found');
    }
    if (user.isVerified) {
      throw ErrorImplementation.badRequest('Email already confirmed');
    }
    if (user.emailConfirm?.expiredAt < new Date()) {
      const token = this.cryptoToken();
      this.emailConfirmation({ to: email, token });
      await this.emailConfirmRepository.update(user.emailConfirm.id, {
        token,
        expiredAt: new Date(Date.now() + 1000 * 60 * 60),
      });
    } else {
      this.emailConfirmation({ to: email, token: user.emailConfirm.token });
    }
    return {
      status: true,
      message: 'Email confirmation link sent to your email',
    };
  }

  async resetPassword(email: string): Promise<StatusResponse> {
    const user = await this.userService.getUserByEmailWithRelations(email);
    if (!user) {
      throw ErrorImplementation.notFound('User not found');
    }
    if (!user.resetPassword?.id || user.resetPassword?.expiredAt < new Date()) {
      const token = this.cryptoToken();
      this.mailSenderService.sendMail({
        to: user.email,
        subject: 'Reset password',
        html: `
                <h2>Please, follow the link to set new password</h2>
                <h4>If you don't restore your password ignore this mail</h4>
                <hr/>
                <br/>
                <a href='${this.configService.get('FRONTEND_URL')}/reset-password/${token}'>Link for email confirmation</a>
              `,
      });
      try {
        await this.resetPasswordRepository
          .createQueryBuilder()
          .insert()
          .values({
            token,
            expiredAt: new Date(Date.now() + 1000 * 60 * 60),
            user,
          })
          .orUpdate(['token', 'expiredAt'], ['userId'])
          .execute();
      } catch (error) {
        this.logger.error(error.message);
        throw ErrorImplementation.forbidden('Error while resetting password');
      }
    } else {
      this.mailSenderService.sendMail({
        to: user.email,
        subject: 'Reset password',
        html: `
                <h2>Please, follow the link to set new password</h2>
                <h4>!Repeated letter!</h4>
                <h4>If you don't restore your password ignore this mail</h4>
                <hr/>
                <br/>
                <a href='${this.configService.get('FRONTEND_URL')}/reset-password/${user.resetPassword.token}'>Link for email confirmation</a>
              `,
      });
    }
    return {
      status: true,
      message: 'Password reset link sent to your email',
    };
  }

  async setNewPassword(
    token: string,
    password: string,
  ): Promise<StatusResponse> {
    const resetPassword = await this.resetPasswordRepository.findOne({
      where: { token },
      relations: ['user'],
    });
    if (!resetPassword) {
      throw ErrorImplementation.badRequest('Invalid token');
    }
    if (new Date() > new Date(resetPassword.expiredAt)) {
      throw ErrorImplementation.badRequest('Token expired');
    }
    try {
      const passwordHash = await this.passwordHashService.create(password);
      await this.userService.update({
        id: resetPassword.user.id,
        passwordHash,
      });
      await this.resetPasswordRepository.update(resetPassword.id, {
        isUsed: new Date(),
        token: null,
        expiredAt: null,
      });
    } catch (error) {
      this.logger.error(error.message);
      throw ErrorImplementation.forbidden('Error while setting new password');
    }

    return {
      status: true,
      message: 'Password successfully changed',
    };
  }
}
