import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum TableStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
}

@Entity('tables')
export class Table {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int', { unique: true })
  number: number;

  @Column('int', { default: 2 })
  capacity: number;

  @Column({
    type: 'enum',
    enum: TableStatus,
    default: TableStatus.AVAILABLE,
  })
  status: TableStatus;

  @Column('text', { default: 'Salón' })
  location: string;

  @Column('bool', { default: true })
  isActive: boolean;
}