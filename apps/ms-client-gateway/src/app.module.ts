import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServeStaticModule } from '@nestjs/serve-static'; // 👈 NUEVO IMPORT
import { join } from 'path'; // 👈 NUEVO IMPORT
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MS_USERS, MS_PRODUCTS, MS_QRCODES, MS_ORDERS} from './config/service'; 

import { GatewayProductosController } from './modulos/ms-productos/productos.controller';
import { GatewayCategoriasController } from './modulos/ms-productos/categorias.controller';
import { GatewayAlergenosController } from './modulos/ms-productos/alergenos.controller';

import { GestionUsuariosController } from './modulos/ms-usuarios/usuarios.controller';
import { GestionRolesController } from './modulos/ms-usuarios/roles.controller';
import { GestionPermisosController } from './modulos/ms-usuarios/permisos.controller';

import { MS_TABLES } from './config/service';
import { GatewayTablesController } from './modulos/ms-tables/tables.controller';
import { envs } from './config';
import { GatewayQrController } from './modulos/ms-qr-codes/qr-code.controller';
import { GatewayOrdersController } from './modulos/ms-orders/orders.controller';
import { KitchenGateway } from './websocket/kitchen.gateway';

@Module({
  imports: [
    // 👇 NUEVO: Hacemos que la carpeta "uploads" sea pública en internet
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', 
    }),

    ClientsModule.register([
      {
        name: MS_USERS,
        transport: Transport.NATS,
        options: { servers: envs.natsServers },
      },
      {
        name: MS_PRODUCTS, 
        transport: Transport.NATS,
        options: { servers: envs.natsServers },
      },
      {
        name: MS_TABLES,
        transport: Transport.NATS,
        options: { servers: envs.natsServers },
      },
      {
        name: MS_QRCODES,
        transport: Transport.NATS,
        options: { servers: envs.natsServers },
      },
      {
        name: MS_ORDERS,
        transport: Transport.NATS,
        options: { servers: envs.natsServers },
      }
    ]),
  ],
  controllers: [
    AppController,
    GatewayProductosController,
    GatewayCategoriasController,
    GatewayAlergenosController,
    GestionUsuariosController,
    GestionRolesController,
    GestionPermisosController,
    GatewayTablesController,
    GatewayQrController,
    GatewayOrdersController
  ],
  providers: [
    AppService,
    KitchenGateway,
  ],
})
export class AppModule {}