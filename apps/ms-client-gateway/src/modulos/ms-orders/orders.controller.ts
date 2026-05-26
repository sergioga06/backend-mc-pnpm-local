import { Controller, Post, Body, Get, Inject, Param, Delete, Patch } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from '@app/common';
import { MS_ORDERS } from '../../config/service'; // O usa el string 'MS_ORDERS'

@Controller('pedidos')
export class GatewayOrdersController {
  constructor(@Inject(MS_ORDERS) private readonly ordersClient: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send({ cmd: 'create_order' }, createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersClient.send({ cmd: 'find_all_orders' }, {});
  }
}