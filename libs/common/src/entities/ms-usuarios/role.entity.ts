// src/modulos/roles/entities/role.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './usuario.entity';
import { Permiso } from './permiso.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @ManyToMany(() => Permiso, (permiso) => permiso.roles, { eager: true })
  @JoinTable({
    name: 'role_permisos',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'permiso_id' },
  })
  permisos: Permiso[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}