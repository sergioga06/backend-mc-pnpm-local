import { Controller, Post, Body, Get, Inject, Param, Patch, Delete, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCategoryDto, UpdateCategoryDto } from '@app/common';
import { MS_PRODUCTS } from '../../config/service';

@Controller('gestion/categorias')
export class GatewayCategoriasController {
  constructor(@Inject(MS_PRODUCTS) private readonly productsClient: ClientProxy) {}

  @Get('menu') // Endpoint especial para la carta pública
  getMenu() {
    return this.productsClient.send({ cmd: 'get_menu' }, {});
  }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.productsClient.send({ cmd: 'create_category' }, createCategoryDto);
  }

  @Get()
  findAll(@Query('includeInactive') includeInactive: string) {
    return this.productsClient.send({ cmd: 'find_all_categories' }, includeInactive === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'find_one_category' }, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.productsClient.send({ cmd: 'update_category' }, { id, updateCategoryDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'remove_category' }, id);
  }
}