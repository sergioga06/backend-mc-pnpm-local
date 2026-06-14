import { Controller, Post, Body, Get, Inject, Param, Patch, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';
import { Roles, UserRole } from '@app/common';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { RolesGuard } from '@app/common/guards/roles.guard';
import { MS_USERS } from '../../config/service';
import { CreateRoleDto } from '@app/common/dto/ms-usuarios/ms-roles/create-role.dto';
import { UpdateRoleDto } from '@app/common/dto/ms-usuarios/ms-roles/update-role.dto';

@Controller('gestion/roles')
@UseGuards(JwtAuthGuard, RolesGuard) // 🛡️ Seguridad activada
@Roles(UserRole.ADMIN)
export class GestionRolesController {
  constructor(@Inject(MS_USERS) private readonly usersClient: ClientProxy) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.usersClient.send({ cmd: 'createRole' }, createRoleDto)
      .pipe(catchError(err => throwError(() => new HttpException(err.message || 'Fallo interno en ms-usuarios', err.statusCode || err.status || HttpStatus.INTERNAL_SERVER_ERROR))));
  }

  @Get()
  findAll() {
    return this.usersClient.send({ cmd: 'findAllRoles' }, {})
      .pipe(catchError(err => throwError(() => new HttpException(err.message || 'Fallo al buscar roles', err.statusCode || err.status || HttpStatus.INTERNAL_SERVER_ERROR))));
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersClient.send({ cmd: 'findOneRole' }, id)
      .pipe(catchError(err => throwError(() => new HttpException(err.message, err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR))));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.usersClient.send({ cmd: 'updateRole' }, { id, ...updateRoleDto })
      .pipe(catchError(err => throwError(() => new HttpException(err.message, err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR))));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersClient.send({ cmd: 'removeRole' }, id)
      .pipe(catchError(err => throwError(() => new HttpException(err.message, err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR))));
  }
}