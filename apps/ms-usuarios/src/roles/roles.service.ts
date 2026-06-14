import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from '@app/common/dto/ms-usuarios/ms-roles/create-role.dto';
import { UpdateRoleDto } from '@app/common/dto/ms-usuarios/ms-roles/update-role.dto';

@Injectable()
export class RolesService {
  
  constructor(private readonly prisma: PrismaService) {}

  // 1. CREAR ROL (Sin permisos)
  async create(createRoleDto: CreateRoleDto) {
    const { name } = createRoleDto;
    
    // Generación del slug amigable
    const slug = name.toLowerCase().replace(/ /g, '_');

    return this.prisma.role.create({
      data: {
        name,
        slug
      }
    });
  }

  // 2. BUSCAR TODOS
  async findAll() {
    return this.prisma.role.findMany();
  }

  // 3. BUSCAR UNO
  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id }
    });
    
    if (!role) throw new NotFoundException(`Rol ${id} no encontrado`);
    return role;
  }

  // 4. ACTUALIZAR (Sin permisos)
  async update(id: string, updateRoleDto: UpdateRoleDto) {
    // Si el nombre cambia, también deberíamos regenerar el slug
    let updateData: any = { ...updateRoleDto };
    
    if (updateRoleDto.name) {
      updateData.slug = updateRoleDto.name.toLowerCase().replace(/ /g, '_');
    }

    return this.prisma.role.update({
      where: { id },
      data: updateData
    });
  }

  // 5. BORRAR
  async remove(id: string) {
    return this.prisma.role.delete({
      where: { id }
    });
  }
}