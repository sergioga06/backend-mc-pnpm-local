// src/modulos/permisos/entities/permiso.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Role } from './role.entity';

@Entity('permisos')
export class Permiso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  action: string; // create, read, update, delete

  @Column()
  resource: string; // users, roles, orders, etc

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Role, (role) => role.permisos)
  roles: Role[];

  @CreateDateColumn()
  createdAt: Date;
}