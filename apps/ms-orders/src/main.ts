import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('MsOrders-Main');

  // 👇 Esto es lo que lo conecta a NATS 👇
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.NATS,
    options: {
      servers: process.env.NATS_SERVERS ? process.env.NATS_SERVERS.split(',') : ['nats://127.0.0.1:4222'],
    },
  });

  await app.listen();
  logger.log('🚀 Microservicio de Pedidos conectado al bus NATS');
}
bootstrap();