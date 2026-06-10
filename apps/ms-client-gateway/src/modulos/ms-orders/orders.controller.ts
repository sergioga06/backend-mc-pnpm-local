import { Controller, Post, Body, Get, Patch, Param, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from '@app/common';
import { MS_ORDERS } from '../../config/service'; 
import { KitchenGateway } from '../../websocket/kitchen.gateway';
import { firstValueFrom } from 'rxjs';

@Controller('gestion/pedidos')
export class GatewayOrdersController {
  constructor(
    @Inject(MS_ORDERS) private readonly ordersClient: ClientProxy,
    private readonly kitchenGateway: KitchenGateway,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const newOrder = await firstValueFrom(
      this.ordersClient.send({ cmd: 'create_order' }, createOrderDto)
    );
    this.kitchenGateway.notifyNewOrder(newOrder);
    return newOrder;
  }

  @Get()
  findAll() {
    return this.ordersClient.send({ cmd: 'find_all_orders' }, {});
  }

  // --- LO NUEVO: CAMBIAR ESTADO ---
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string // Ej: 'IN_PROGRESS', 'DELIVERED', 'PAID'
  ) {
    // 1. Enviamos por NATS a ms-orders que actualice la base de datos
    const updatedOrder = await firstValueFrom(
      this.ordersClient.send({ cmd: 'change_order_status' }, { id, status })
    );

    // 2. ⚡ TIEMPO REAL: Disparamos el WebSocket solo a la sala de este pedido
    if (updatedOrder) {
      this.kitchenGateway.notifyOrderStatusChange(updatedOrder);
    }

    // 3. Devolvemos el 200 OK a la tablet de cocina
    return updatedOrder;
  }
}