import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app.module';
import { USER_PACKAGE_NAME } from './user/user.pb';
import { AUTH_PACKAGE_NAME } from './auth/auth.pb';
import { HEALTH_CHECK_PACKAGE_NAME } from './health-check/health-check.pb';

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
        AUTH_PACKAGE_NAME,
        USER_PACKAGE_NAME,
        HEALTH_CHECK_PACKAGE_NAME,
      ],
      protoPath: [
        join(__dirname, '../proto/auth.proto'),
        join(__dirname, '../proto/user.proto'),
        join(__dirname, '../proto/health-check.proto'),
      ],
      url: URL,
    },
  });
  await app.startAllMicroservices();

  logger.log('Notification microservice is running on ' + URL);
}
bootstrap();
