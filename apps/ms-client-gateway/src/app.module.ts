import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// 1. Importar las constantes de nombres
import { MS_USERS, MS_PRODUCTS, MS_QRCODES, MS_ORDERS} from './config/service'; 

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
import { GatewayQrController } from './modulos/ms-qr-codes/qr-code.controller';
import { GatewayOrdersController } from './modulos/ms-orders/orders.controller';
@Module({
  imports: [
    // 👇 AQUÍ ESTÁ LA CLAVE: Registramos los clientes TCP
    ClientsModule.register([
      {
        name: MS_USERS,
        transport: Transport.NATS,
        options: {
          servers: envs.natsServers
        },
      },
      {
        name: MS_PRODUCTS, 
        transport: Transport.NATS, // <-- CAMBIAR DE TCP A NATS
        options: {
          servers: envs.natsServers // <-- USAR NATS EN LUGAR DE HOST/PORT
        },
      },
      {
        name: MS_TABLES,
        transport: Transport.NATS,
        options: {
          servers: envs.natsServers
        },
      },
      {
        name: MS_QRCODES, // (O la constante que uses)
        transport: Transport.NATS, // 👈 Forzar NATS
        options: {
          servers: envs.natsServers
        },
      },
      {
        name: MS_ORDERS,
        transport: Transport.NATS,
        options: {
          servers: envs.natsServers
        },
      }
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
    GatewayTablesController,

    // Controladores de QR Codes
    GatewayQrController,

    // Controladores de Orders
    GatewayOrdersController
  ],
  providers: [AppService],
})
export class AppModule {}
