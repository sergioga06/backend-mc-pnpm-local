import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderItem } from '@app/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE', // Nombre interno para el servicio de productos
        transport: Transport.TCP,
        options: {
          host: process.env.MS_PRODUCTS_HOST || 'localhost',
          port: 3002, // Puerto del ms-productos
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}