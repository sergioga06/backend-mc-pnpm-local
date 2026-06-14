import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { envs } from '../config/envs'; // 👈 Importamos las variables de entorno

@Module({
  imports: [
    // La máquina de hacer Tokens (¡Ahora conectada al .env!)
    JwtModule.register({
      secret: envs.jwtSecret, // 👈 Secreto unificado
      signOptions: { expiresIn: '8h' }, 
    }),
    // Conexión con el validador (ms-usuarios)
    ClientsModule.register([
      {
        name: 'MS_USUARIOS',
        transport: Transport.NATS,
        options: { servers: envs.natsServers }, // 👈 Aprovechamos para usar el NATS del .env
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}