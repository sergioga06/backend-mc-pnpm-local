import { Controller, Post, Body, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePermisoDto } from '@app/common/dto/ms-usuarios/ms-permisos/create-permiso.dto'; // Asegúrate de que esto exporte tu DTO
import { MS_USERS } from '../../config/service';

@Controller('gestion/permisos')
export class GestionPermisosController {
  constructor(@Inject(MS_USERS) private readonly usersClient: ClientProxy) {}

  @Post()
  create(@Body() createPermisoDto: CreatePermisoDto) {
    // Envía al microservicio: cmd: 'createPermiso' (según tu código anterior)
    return this.usersClient.send({ cmd: 'createPermiso' }, createPermisoDto);
  }

  @Get()
  findAll() {
    return this.usersClient.send({ cmd: 'findAllPermisos' }, {});
  }
}