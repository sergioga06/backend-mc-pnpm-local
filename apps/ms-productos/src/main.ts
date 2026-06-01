import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

// 1. Forzamos a leer el entorno del microservicio de productos
dotenv.config({ path: 'apps/ms-productos/.env' });

async function bootstrap() {
  const logger = new Logger('MsProductos-Main');

  // 2. Extraemos los servidores NATS del .env
  const natsServers = process.env.NATS_SERVERS 
    ? process.env.NATS_SERVERS.split(',') 
    : ['nats://localhost:4222'];

  // 3. Cambiamos la configuración de TCP a NATS
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS, // 👈 EL CAMBIO CRÍTICO
      options: {
        servers: natsServers,
      },
    },
  );

  // Mantenemos las validaciones de los DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen();
  logger.log('🚀 Microservicio de Productos conectado al bus NATS');
}
bootstrap();