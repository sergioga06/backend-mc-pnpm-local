import { Controller, Post, Body, Get, Inject, Param, Patch, Delete, Query, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCategoryDto, UpdateCategoryDto, Roles, UserRole } from '@app/common';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { RolesGuard } from '@app/common/guards/roles.guard';
import { MS_PRODUCTS } from '../../config/service';

@Controller('gestion/categorias')
export class GatewayCategoriasController {
  constructor(@Inject(MS_PRODUCTS) private readonly productsClient: ClientProxy) {}

  @Get('menu') 
  getMenu() {
    return this.productsClient.send({ cmd: 'get_menu' }, {});
  }

  @Get()
  findAll(@Query('includeInactive') includeInactive: string) {
    return this.productsClient.send({ cmd: 'find_all_categories' }, includeInactive === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'find_one_category' }, id);
  }

  // 🔴 MÉTODOS PROTEGIDOS
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.productsClient.send({ cmd: 'create_category' }, createCategoryDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.productsClient.send({ cmd: 'update_category' }, { id, updateCategoryDto });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'remove_category' }, id);
  }
}