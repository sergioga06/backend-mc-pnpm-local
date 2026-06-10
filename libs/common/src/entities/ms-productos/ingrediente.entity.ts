import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Product } from './productos.entity';

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  name: string; // ej: "Queso Extra", "Cebolla", "Bacon"

  @Column('float', { default: 0 })
  extraPrice: number; // ¿Cuánto cuesta añadirlo como extra? (0 si quitarlo no resta precio)

  @ManyToMany(() => Product, (product) => product.ingredients)
  products: Product[];
}