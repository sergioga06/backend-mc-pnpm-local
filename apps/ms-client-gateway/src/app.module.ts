import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// 1. Importar las constantes de nombres
import { MS_USERS, MS_PRODUCTS } from './config/service'; 

// 2. Importar los controladores de PRODUCTOS
import { GatewayProductosController } from './modulos/ms-productos/productos.controller';
import { GatewayCategoriasController } from './modulos/ms-productos/categorias.controller';
import { GatewayAlergenosController } from './modulos/ms-productos/alergenos.controller';

// 3. Importar los controladores de USUARIOS (Asegúrate de que la ruta sea correcta según tu estructura)
import { GestionUsuariosController } from './modulos/ms-usuarios/usuarios.controller';
import { GestionRolesController } from './modulos/ms-usuarios/roles.controller';
import { GestionPermisosController } from './modulos/ms-usuarios/permisos.controller';

import { MS_TABLES } from './config/service';
import { GatewayTablesController } from './modulos/ms-tables/tables.controller';
import { envs } from './config';
@Module({
  imports: [
    // 👇 AQUÍ ESTÁ LA CLAVE: Registramos los clientes TCP
    ClientsModule.register([
      {
        name: MS_USERS, // 'MS_USERS'
        transport: Transport.NATS,
        options: {
          servers: envs.natsServers
        },
      },
      {
        name: MS_PRODUCTS, // 'MS_PRODUCTS' <-- Esto es lo que faltaba
        transport: Transport.TCP,
        options: {
          host: process.env.MS_PRODUCTS_HOST || 'localhost',
          port: parseInt(process.env.MS_PRODUCTS_PORT || '3002'),
        },
      
      },
      {
        name: MS_TABLES,
        transport: Transport.TCP,
        options: {
          host: process.env.MS_TABLES_HOST || 'localhost',
          port: parseInt(process.env.MS_TABLES_PORT || '3003'),
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    // Controladores de Productos
    GatewayProductosController,
    GatewayCategoriasController,
    GatewayAlergenosController,
    
    // Controladores de Usuarios
    GestionUsuariosController,
    GestionRolesController,
    GestionPermisosController,

    // Controladores de Tables
    GatewayTablesController
  ],
  providers: [AppService],
})
export class AppModule {}
