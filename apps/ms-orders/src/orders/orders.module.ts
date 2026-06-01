import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderItem } from '@app/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    ClientsModule.registerAsync([
      {
        name: 'PRODUCT_SERVICE',
        useFactory: () => ({
          transport: Transport.NATS, // 👈 Ahora hablamos el mismo idioma
          options: {
            servers: process.env.NATS_SERVERS 
              ? process.env.NATS_SERVERS.split(',') 
              : ['nats://127.0.0.1:4222'],
          },
        }),
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}