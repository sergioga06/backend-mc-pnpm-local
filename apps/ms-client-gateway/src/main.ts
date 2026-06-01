import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Gateway-Main');

  // 👇 ESTA ES LA PIEZA QUE FALTA 👇
  app.enableCors({
    // Permitimos específicamente tu frontend local
    origin: 'http://95.111.225.241:32033', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Configuración de validaciones (opcional pero recomendado)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(envs.port);
  logger.log(`🚀 Gateway escuchando peticiones en el puerto ${envs.port}`);
}
bootstrap();