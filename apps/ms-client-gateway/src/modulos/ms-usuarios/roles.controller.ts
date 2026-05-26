import { Controller, Post, Body, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateRoleDto } from '@app/common/dto/ms-usuarios/ms-roles/create-role.dto';
import { MS_USERS } from '../../config/service';

@Controller('gestion/roles')
export class GestionRolesController {
  constructor(@Inject(MS_USERS) private readonly usersClient: ClientProxy) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.usersClient.send({ cmd: 'createRole' }, createRoleDto);
  }

  @Get()
  findAll() {
    return this.usersClient.send({ cmd: 'findAllRoles' }, {});
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersClient.send({ cmd: 'findOneRole' }, id);
  }
}