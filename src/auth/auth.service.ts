import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import * as crypto from 'crypto';

import { UserService } from '../user/user.service';
import { PasswordHashService } from '../password-hash/password-hash.service';
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
  ) {}

  private cryptoToken(): string {
    const buffer = crypto.randomBytes(16);
    if (!buffer) throw new RpcException('Token error');
    const token = buffer.toString('hex');
    return token;
  }

  async signUp(signUpDto: SignUpRequest): Promise<User> {
    const { email, password, userName } = signUpDto;
    const candidate = await this.userService.getUserByEmail(email);
    if (candidate) {
      throw new RpcException('User with this email already exists');
    }
    const passwordHash = await this.passwordHashService.create(password);
    const user = await this.userService.create({
      email,
      passwordHash,
      userName,
    });

    const token = this.cryptoToken();
    await this.emailConfirmRepository.save({
      user,
      token,
      expiredAt: new Date(
        new Date().getTime() + 1000 * 60 * 60 * 24,
      ).toISOString(),
    });

    return user;
  }

  async signIn(email: string, password: string): Promise<User> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new RpcException('Incorrect login or password');
    }
    await this.passwordHashService.compare(password, user.passwordHash);

    return user;
  }

  async confirmEmail(token: string): Promise<StatusResponse> {
    const emailConfirm = await this.emailConfirmRepository.findOne({
      where: { token },
      relations: ['user'],
    });
    if (!emailConfirm) {
      throw new RpcException('Invalid token');
    }
    if (new Date() > new Date(emailConfirm.expiredAt)) {
      throw new RpcException('Token expired');
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
      throw new RpcException('Error while confirming email');
    }

    return {
      status: true,
      message: 'Email successfully confirmed',
    };
  }

  async resetPassword(email: string): Promise<StatusResponse> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new RpcException('User not found');
    }
    const token = this.cryptoToken();
    await this.resetPasswordRepository.save({
      user,
      token,
      expiredAt: new Date(
        new Date().getTime() + 1000 * 60 * 60 * 24,
      ).toISOString(),
    });
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
      throw new RpcException('Invalid token');
    }
    if (new Date() > new Date(resetPassword.expiredAt)) {
      throw new RpcException('Token expired');
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
      throw new RpcException('Error while setting new password');
    }

    return {
      status: true,
      message: 'Password successfully changed',
    };
  }
}
