import { Controller, Post, Body, Inject, Get } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from '@app/common';
import { MS_USERS } from '../../config/service'; // Asegúrate de que este export exista o usa el string 'MS_USERS'

@Controller('gestion/usuarios')
export class GestionUsuariosController {
  constructor(@Inject(MS_USERS) private readonly usersClient: ClientProxy) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // Envía el comando 'create_user' que tu microservicio ya está escuchando
    return this.usersClient.send({ cmd: 'create_user' }, createUserDto);
  }
  
  @Get()
    findAll() {
      return this.usersClient.send({ cmd: 'find_all_users' }, {});
    }
}


