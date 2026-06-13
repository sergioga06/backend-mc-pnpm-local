import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Category } from './categoria.entity';
import { Allergen } from './alergeno.entity';
import { Ingredient } from './ingrediente.entity';

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

  @Column('bool', { default: true }) 
  isActive: boolean;

  // --- Relaciones ---

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @Column({ nullable: true })
  categoryId: string;

  @ManyToMany(() => Allergen, (allergen) => allergen.products)
  @JoinTable()
  allergens: Allergen[];

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.products)
  @JoinTable()
  ingredients: Ingredient[];

  // 👇 EL NUEVO ADN: Guardará los extras específicos de este plato y su precio
  @Column({ type: 'jsonb', nullable: true, default: [] })
  extras: { name: string, price: number }[];
}