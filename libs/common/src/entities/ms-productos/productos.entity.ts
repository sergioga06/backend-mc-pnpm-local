import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Category } from './categoria.entity';
import { Allergen } from './alergeno.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('float', { default: 0 })
  price: number;

  @Column('text', { nullable: true })
  image: string;

  @Column('bool', { default: true }) // Este lo dejamos, es útil (se pone true solo)
  isActive: boolean;

  // --- Relaciones ---

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @Column({ nullable: true })
  categoryId: string;

  @ManyToMany(() => Allergen, (allergen) => allergen.products)
  @JoinTable()
  allergens: Allergen[];
}