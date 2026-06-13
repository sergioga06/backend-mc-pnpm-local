import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    // La máquina de hacer Tokens
    JwtModule.register({
      secret: 'SECRETO_SUPER_SEGURO_TITO_2026', // En producción, esto irá en el .env
      signOptions: { expiresIn: '8h' }, // El token caduca en 8 horas
    }),
    // Conexión con el validador (ms-usuarios)
    ClientsModule.register([
      {
        name: 'MS_USUARIOS',
        transport: Transport.NATS,
        options: { servers: ['nats://localhost:4222'] },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}