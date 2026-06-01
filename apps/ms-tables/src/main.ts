import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

// 1. Forzamos a leer el entorno del microservicio de mesas
dotenv.config({ path: 'apps/ms-tables/.env' });

async function bootstrap() {
  const logger = new Logger('MsTables-Main');

  // 2. Extraemos los servidores NATS del .env
  const natsServers = process.env.NATS_SERVERS 
    ? process.env.NATS_SERVERS.split(',') 
    : ['nats://127.0.0.1:4222'];

  // 3. Cambiamos la configuración a NATS
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.NATS, // 👈 El puente principal
    options: {
      servers: natsServers,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen();
  // 4. El chivato visual
  logger.log('🚀 Microservicio de Mesas conectado al bus NATS');
}
bootstrap();