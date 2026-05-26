import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Order, OrderItem, CreateOrderDto, OrderStatus } from '@app/common';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger('OrdersService');

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { items, tableId, userId } = createOrderDto;
    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    // 1. Validar productos y obtener precios reales desde ms-productos
    for (const item of items) {
      // Enviamos el comando al ms-productos
      const product = await firstValueFrom(
        this.productClient.send({ cmd: 'find_one_product' }, item.productId)
      );

      if (product) {
        const orderItem = this.orderItemRepository.create({
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: item.quantity,
        });
        
        totalAmount += product.price * item.quantity;
        orderItems.push(orderItem);
      }
    }

    // 2. Crear la cabecera del pedido
    const order = this.orderRepository.create({
      tableId,
      userId,
      totalAmount,
      items: orderItems,
      status: OrderStatus.PENDING,
    });

    return await this.orderRepository.save(order);
  }

  async findAll() {
    return await this.orderRepository.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    return await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.orderRepository.findOneBy({ id });
    if (order) {
      order.status = status;
      return await this.orderRepository.save(order);
    }
  }
}