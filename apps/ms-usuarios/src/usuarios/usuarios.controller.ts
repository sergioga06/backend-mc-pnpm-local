import { Controller } from '@nestjs/common';
// Importamos las herramientas para escuchar mensajes del Gateway
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './usuarios.service';
// Importamos los formularios de datos (DTOs)
import { CreateUserDto } from '@app/common/dto/ms-usuarios/create-usuario.dto';
import { UpdateUserDto } from '@app/common/dto/ms-usuarios/update-usuario.dto';

@Controller()
export class UsersController {
  
  // 1. CONSTRUCTOR
  // "Contratamos" al especialista en usuarios (el Servicio) para que esté listo.
  constructor(private readonly usersService: UsersService) {}

  // 2. CREAR USUARIO
  // Escucha el comando 'create_user'.
  @MessagePattern({ cmd: 'create_user' })
  create(@Payload() createUserDto: CreateUserDto) {
    // Le pasa la hoja con los datos (nombre, email, password...) al servicio.
    return this.usersService.create(createUserDto);
  }

  // 3. LISTAR TODOS
  // Pide la lista de todos los empleados/usuarios registrados.
  @MessagePattern({ cmd: 'find_all_users' })
  findAll() {
    return this.usersService.findAll();
  }

  // 4. BUSCAR UNO (POR ID)
  // Aquí está el cambio importante que comentabas.
  // Antes, los IDs solían ser números (1, 2, 3...).
  // Ahora usamos UUIDs (cadenas de texto largas y únicas como "550e8400-e29b...").
  @MessagePattern({ cmd: 'find_one_user' })
  findOne(@Payload() id: string) { //  Recibimos un string porque es un UUID
    return this.usersService.findOne(id);
  }

  // 5. ACTUALIZAR
  // Recibe un paquete con el ID (string) y los datos nuevos.
  @MessagePattern({ cmd: 'update_user' })
  update(@Payload() data: { id: string; updateUserDto: UpdateUserDto }) { //  id es string
    return this.usersService.update(data.id, data.updateUserDto);
  }

  // 6. BORRAR (SOFT DELETE)
  // Manda eliminar (o desactivar) al usuario con ese ID.
  @MessagePattern({ cmd: 'remove_user' })
  remove(@Payload() id: string) { //  id es string
    return this.usersService.remove(id);
  }
}