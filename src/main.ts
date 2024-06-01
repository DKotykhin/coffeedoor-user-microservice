import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app.module';
import { USER_PACKAGE_NAME } from './user/user.pb';
import { AUTH_PACKAGE_NAME } from './auth/auth.pb';
import { HEALTH_CHECK_PACKAGE_NAME } from './health-check/health-check.pb';

const logger = new Logger('main.ts');

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);
  const PORT = configService.get<string>('TRANSPORT_PORT');
  const HOST = configService.get<string>('TRANSPORT_HOST');
  const URL = `${HOST}:${PORT}`;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
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
    },
  );
  await app.listen();
  logger.log('User microservice is running on ' + URL);
}
bootstrap();
