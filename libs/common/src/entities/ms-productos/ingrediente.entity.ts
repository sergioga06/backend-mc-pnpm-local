import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Product } from './productos.entity';

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  name: string; 

  // 👇 AÑADIDO: La descripción que estamos mandando desde el frontend
  @Column('text', { nullable: true })
  description: string;

  @Column('float', { default: 0 })
  extraPrice: number; 

  // 👇 AÑADIDO: Vital para que el servicio pueda hacer el borrado lógico y buscar activos
  @Column('bool', { default: true })
  isActive: boolean;

  @ManyToMany(() => Product, (product) => product.ingredients)
  products: Product[];
}