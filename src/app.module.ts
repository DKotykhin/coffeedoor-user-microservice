import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validate } from './utils/env.validator';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { EmailConfirmModule } from './email-confirm/email-confirm.module';
import { PasswordResetModule } from './password-reset/password-reset.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.stage.dev'],
      validate,
    }),
    DatabaseModule,
    UserModule,
    EmailConfirmModule,
    PasswordResetModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
