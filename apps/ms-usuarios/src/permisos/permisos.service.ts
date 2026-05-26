import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePermisoDto } from '@app/common/dto/ms-usuarios/ms-permisos/create-permiso.dto';
import { UpdatePermisoDto } from '@app/common/dto/ms-usuarios/ms-permisos/update.permiso.dto';

@Injectable()
export class PermisosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPermisoDto: CreatePermisoDto) {
    const { name, action, resource } = createPermisoDto;
    
    // Generamos el slug: "users:read"
    const slug = `${resource}:${action}`.toLowerCase();

    // ✅ En Prisma 7, si 'action' y 'resource' son obligatorios en el schema,
    // DEBES pasarlos aquí dentro de 'data'.
    return this.prisma.permiso.create({
      data: {
        name,
        slug,
        action,   // 👈 Añadido para cumplir con el tipado estricto
        resource, // 👈 Añadido para cumplir con el tipado estricto
      },
    });
  }

  async findAll() {
    return this.prisma.permiso.findMany();
  }

  async findOne(id: string) {
    const permiso = await this.prisma.permiso.findUnique({ where: { id } });
    if (!permiso) throw new NotFoundException('Permiso no encontrado');
    return permiso;
  }

  async update(id: string, updatePermisoDto: UpdatePermisoDto) {
    const { action, resource, ...restOfData } = updatePermisoDto;
    const updateData: any = { ...restOfData };

    // Si actualizamos action o resource, regeneramos el slug
    if (action && resource) {
      updateData.slug = `${resource}:${action}`.toLowerCase();
      updateData.action = action;
      updateData.resource = resource;
    }

    return this.prisma.permiso.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    return this.prisma.permiso.delete({ where: { id } });
  }
}