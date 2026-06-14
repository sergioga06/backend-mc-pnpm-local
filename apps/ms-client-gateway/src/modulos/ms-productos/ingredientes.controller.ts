import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { MS_PRODUCTS } from '../../config/service';
import { CreateIngredientDto } from '@app/common/dto/ms-productos/ingredientes/create-ingrediente.dto';
import { UpdateIngredientDto } from '@app/common/dto/ms-productos/ingredientes/update-ingrediente.dto';
import { Roles, UserRole } from '@app/common';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { RolesGuard } from '@app/common/guards/roles.guard';
import { catchError, throwError } from 'rxjs';

@Controller('gestion/ingredientes')
export class GatewayIngredientesController {
  constructor(@Inject(MS_PRODUCTS) private readonly productsClient: ClientProxy) {}

  @Get()
  findAll() {
    return this.productsClient.send({ cmd: 'find_all_ingredients' }, {})
      .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'find_one_ingredient' }, { id })
      .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  // 🔴 MÉTODOS PROTEGIDOS
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.productsClient.send({ cmd: 'create_ingredient' }, createIngredientDto)
      .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateIngredientDto: UpdateIngredientDto) {
    return this.productsClient.send({ cmd: 'update_ingredient' }, { id, updateIngredientDto })
      .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'remove_ingredient' }, { id })
      .pipe(catchError(error => throwError(() => new RpcException(error))));
  }
}