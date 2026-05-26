import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  productId: string; // Referencia a ms-productos

  @Column('text')
  productName: string; // Snapshot del nombre

  @Column('float')
  price: number; // Snapshot del precio en el momento del pedido

  @Column('int')
  quantity: number;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
}