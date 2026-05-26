import { Controller } from '@nestjs/common';
// Importamos las herramientas para escuchar mensajes entre microservicios
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PermisosService } from './permisos.service';
// Importamos los formularios de datos (DTOs) para saber qué información nos llega
import { CreatePermisoDto } from '@app/common/dto/ms-usuarios/ms-permisos/create-permiso.dto';
import { UpdatePermisoDto } from '@app/common/dto/ms-usuarios/ms-permisos/update.permiso.dto';

@Controller()
export class PermisosController {
  
  // 1. CONSTRUCTOR
  // "Contratamos" al especialista (el Servicio) para que haga el trabajo real cuando le avisemos.
  constructor(private readonly permisosService: PermisosService) {}

  // 2. CREAR PERMISO
  // Escucha el mensaje "createPermiso". 
  // Ej: "Quiero crear un permiso para que solo los jefes puedan borrar usuarios".
  @MessagePattern({ cmd: 'createPermiso' }) 
  create(@Payload() createPermisoDto: CreatePermisoDto) {
    // Le pasa los datos al servicio.
    return this.permisosService.create(createPermisoDto);
  }

  // 3. LISTAR TODOS
  // Pide la lista completa de permisos que existen en el sistema.
  @MessagePattern({ cmd: 'findAllPermisos' }) 
  findAll() {
    return this.permisosService.findAll();
  }

  // 4. BUSCAR UNO
  // Busca un permiso específico por su ID único.
  @MessagePattern({ cmd: 'findOnePermiso' }) 
  findOne(@Payload() id: string) {
    return this.permisosService.findOne(id);
  }

  // 5. ACTUALIZAR
  // Al igual que vimos en Alérgenos, aquí el ID viene DENTRO del paquete de datos (DTO).
  @MessagePattern({ cmd: 'updatePermiso' }) 
  update(@Payload() updatePermisoDto: UpdatePermisoDto) {
    // Extraemos el ID del DTO y se lo pasamos al servicio junto con el resto de datos.
    return this.permisosService.update(updatePermisoDto.id, updatePermisoDto);
  }

  // 6. BORRAR
  // Manda eliminar un permiso.
  @MessagePattern({ cmd: 'removePermiso' }) 
  remove(@Payload() id: string) {
    return this.permisosService.remove(id);
  }
}