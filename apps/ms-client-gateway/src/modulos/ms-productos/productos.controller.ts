import { Controller, Post, Body, Get, Inject, Param, Patch, Delete, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProductDto, UpdateProductDto } from '@app/common';
import { MS_PRODUCTS } from '../../config/service';

@Controller('gestion/productos')
export class GatewayProductosController {
  constructor(@Inject(MS_PRODUCTS) private readonly productsClient: ClientProxy) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsClient.send({ cmd: 'create_product' }, createProductDto);
  }

  @Get()
  findAll(@Query('includeInactive') includeInactive: string) {
    return this.productsClient.send({ cmd: 'find_all_products' }, includeInactive === 'true');
  }

  @Get('buscar') // ?q=texto
  search(@Query('q') query: string) {
    return this.productsClient.send({ cmd: 'search_products' }, query);
  }

  @Get('disponibles')
  findAvailable() {
    return this.productsClient.send({ cmd: 'find_available_products' }, {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'find_one_product' }, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsClient.send({ cmd: 'update_product' }, { id, updateProductDto });
  }

  @Patch(':id/toggle')
  toggle(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'toggle_product_availability' }, id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'remove_product' }, id);
  }
}