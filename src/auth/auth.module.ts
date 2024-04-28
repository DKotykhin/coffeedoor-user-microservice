import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { PasswordHashService } from '../password-hash/password-hash.service';
import { MailSenderService } from '../mail-sender/mail-sender.service';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailConfirm } from './entities/email-confirm.entity';
import { ResetPassword } from './entities/reset-password.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, EmailConfirm, ResetPassword])],
  controllers: [AuthController],
  providers: [AuthService, UserService, PasswordHashService, MailSenderService],
})
export class AuthModule {}
