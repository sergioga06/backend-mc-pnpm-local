import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Product } from './productos.entity';

@Entity('allergens')
export class Allergen {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  name: string; // Ej: "Gluten", "Lactosa"

  @Column('text', { nullable: true })
  icon: string; 

  @ManyToMany(() => Product, (product) => product.allergens)
  products: Product[];
}