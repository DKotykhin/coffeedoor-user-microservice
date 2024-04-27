import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PasswordResetService } from './password-reset.service';
import { PasswordResetController } from './password-reset.controller';
import { ResetPassword } from './entities/reset-password.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResetPassword])],
  controllers: [PasswordResetController],
  providers: [PasswordResetService],
})
export class PasswordResetModule {}
