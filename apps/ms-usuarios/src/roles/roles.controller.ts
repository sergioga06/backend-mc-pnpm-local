import { Controller } from '@nestjs/common';
// Herramientas para recibir mensajes de otros microservicios (el Gateway)
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RolesService } from './roles.service';
// Importamos los "formularios" (DTOs) para validar los datos que llegan
import { CreateRoleDto } from '@app/common/dto/ms-usuarios/ms-roles/create-role.dto';
import { UpdateRoleDto } from '@app/common/dto/ms-usuarios/ms-roles/update-role.dto';

@Controller()
export class RolesController {
  
  // 1. CONSTRUCTOR
  // "Contratamos" al especialista en roles (el Servicio) para que haga el trabajo duro.
  constructor(private readonly rolesService: RolesService) {}

  // 2. CREAR ROL
  // Escucha el mensaje "createRole". (Ej: "Crea el rol de 'Gerente'").
  @MessagePattern({ cmd: 'createRole' }) //  Has estandarizado el nombre del comando.
  create(@Payload() createRoleDto: CreateRoleDto) {
    // Le pasa los datos al servicio.
    return this.rolesService.create(createRoleDto);
  }

  // 3. LISTAR TODOS
  // Pide la lista de todos los roles que existen (Admin, User, SuperUser, etc.).
  @MessagePattern({ cmd: 'findAllRoles' }) // 
  findAll() {
    return this.rolesService.findAll();
  }

  // 4. BUSCAR UNO
  // Busca la ficha de un rol específico por su ID.
  @MessagePattern({ cmd: 'findOneRole' }) // 
  findOne(@Payload() id: string) {
    return this.rolesService.findOne(id);
  }

  // 5. ACTUALIZAR
  // Fíjate que aquí también asumes que el ID viene DENTRO del formulario (DTO).
  @MessagePattern({ cmd: 'updateRole' }) // 
  update(@Payload() updateRoleDto: UpdateRoleDto) {
    // Sacamos el ID del propio DTO (updateRoleDto.id) y se lo pasamos al servicio.
    return this.rolesService.update(updateRoleDto.id, updateRoleDto);
  }

  // 6. BORRAR
  // Manda eliminar un rol.
  @MessagePattern({ cmd: 'removeRole' }) // 
  remove(@Payload() id: string) {
    return this.rolesService.remove(id);
  }
}