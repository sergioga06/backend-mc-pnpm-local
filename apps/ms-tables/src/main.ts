import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('MsTables');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: process.env.MS_TABLES_PORT ? parseInt(process.env.MS_TABLES_PORT) : 3003,
    },
  });
  await app.listen();
  logger.log(`Microservice Tables is listening on port ${process.env.MS_TABLES_PORT || 3003}`);
}
bootstrap();
