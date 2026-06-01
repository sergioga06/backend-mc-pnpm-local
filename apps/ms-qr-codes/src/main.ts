import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('MsQrCodes-Main');

  // Conectamos directamente a la red NATS de tu ordenador
  const natsServers = process.env.NATS_SERVERS 
    ? process.env.NATS_SERVERS.split(',') 
    : ['nats://127.0.0.1:4222'];

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.NATS,
    options: {
      servers: natsServers,
    },
  });

  await app.listen();
  logger.log('🚀 Microservicio de Códigos QR conectado al bus NATS');
}
bootstrap();