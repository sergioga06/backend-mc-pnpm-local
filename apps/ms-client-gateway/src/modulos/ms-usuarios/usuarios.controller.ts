import { Controller, Post, Body, Inject, Get, Patch, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';
import { CreateUserDto, UpdateUserDto, Roles, UserRole } from '@app/common';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { RolesGuard } from '@app/common/guards/roles.guard';
import { MS_USERS } from '../../config/service';

@Controller('gestion/usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class GestionUsuariosController {
  constructor(@Inject(MS_USERS) private readonly usersClient: ClientProxy) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersClient.send({ cmd: 'create_user' }, createUserDto)
      .pipe(catchError(err => throwError(() => new HttpException(err.message, err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR))));
  }
  
  @Get()
  findAll() {
    return this.usersClient.send({ cmd: 'find_all_users' }, {})
      .pipe(catchError(err => throwError(() => new HttpException(err.message, err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR))));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersClient.send({ cmd: 'find_one_user' }, id)
      .pipe(catchError(err => throwError(() => new HttpException(err.message, err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR))));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersClient.send({ cmd: 'update_user' }, { id, updateUserDto })
      .pipe(catchError(err => throwError(() => new HttpException(err.message, err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR))));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersClient.send({ cmd: 'remove_user' }, id)
      .pipe(catchError(err => throwError(() => new HttpException(err.message, err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR))));
  }
}