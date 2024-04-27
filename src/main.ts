import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app.module';
import { USER_PACKAGE_NAME } from './user/user.pb';
import { EMAIL_CONFIRM_PACKAGE_NAME } from './email-confirm/emailConfirm.pb';
import { PASSWORD_RESET_PACKAGE_NAME } from './password-reset/passwordReset.pb';

const logger = new Logger('main.ts');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const configService = app.get(ConfigService);
  const PORT = configService.get<string>('TRANSPORT_PORT');
  const HOST = configService.get<string>('TRANSPORT_HOST');
  const URL = `${HOST}:${PORT}`;
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: [
        EMAIL_CONFIRM_PACKAGE_NAME,
        PASSWORD_RESET_PACKAGE_NAME,
        USER_PACKAGE_NAME,
      ],
      protoPath: [
        join(__dirname, '../proto/emailConfirm.proto'),
        join(__dirname, '../proto/passwordReset.proto'),
        join(__dirname, '../proto/user.proto'),
      ],
      url: URL,
    },
  });
  await app.startAllMicroservices();

  logger.log('Notification microservice is running on ' + URL);
}
bootstrap();
