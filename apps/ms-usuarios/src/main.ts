import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { envs } from '../config/envs';

async function bootstrap() {
 const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.NATS, 
    options: {
      servers: envs.natsServers
    }
  });
  await app.listen();
  console.log('Microservicio Administración escuchando en puerto 3001 via TCP');
}
bootstrap();
