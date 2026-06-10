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

    // 1. Validar productos y obtener precios
    for (const item of items) {
      const product = await firstValueFrom(
        this.productClient.send({ cmd: 'find_one_product' }, item.productId)
      );

      if (product) {
        let unitPrice = product.price; // Empezamos con el precio base (ej. 9.50)

        // 👇 LA MAGIA MATEMÁTICA: Calcular coste de ingredientes extra
        if (item.customizations && item.customizations.added && item.customizations.added.length > 0) {
          try {
            // Viajamos por NATS a ms-productos para preguntar cuánto cuestan estos extras
            const extras = await firstValueFrom(
              this.productClient.send({ cmd: 'get_ingredients_prices' }, item.customizations.added)
            );
            
            // Sumamos el coste extra de cada ingrediente (ej. +1.50 del Bacon)
            const extrasCost = extras.reduce((sum, extra) => sum + (extra.extraPrice || 0), 0);
            unitPrice += extrasCost; 
          } catch (error) {
            this.logger.error(`Error calculando el precio de los extras: ${error.message}`);
          }
        }

        // 2. Crear la línea de la factura
        const orderItem = this.orderItemRepository.create({
          productId: product.id,
          productName: product.name,
          price: unitPrice, // 👈 Guardamos el precio final (Base + Extras)
          quantity: item.quantity,
          customizations: item.customizations, // 👈 Guardamos el JSON de { added: [...], removed: [...] }
        });
        
        // El total del ticket multiplica el precio final por la cantidad de hamburguesas
        totalAmount += unitPrice * item.quantity;
        orderItems.push(orderItem);
      }
    }

    // 3. Crear la cabecera del pedido
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