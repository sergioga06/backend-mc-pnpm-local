import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Importante para leer .env
import { RolesModule } from './roles/roles.module';
import { PermisosModule } from './permisos/permisos.module';
import { UsersModule } from './usuarios/usuarios.module'; // Faltaba importar este
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    // Configuración global de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/ms-usuarios/.env', 
    }),
    PrismaModule, // Conexión a BD disponible para todos
    UsersModule,
    RolesModule,
    PermisosModule
  ],
  controllers: [], // No necesitas AppController
  providers: [],   // No necesitas AppService
})
export class AppModule {}