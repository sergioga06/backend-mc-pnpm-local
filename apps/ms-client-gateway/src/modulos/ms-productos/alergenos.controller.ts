import { Controller, Post, Body, Get, Inject, Param, Delete, Patch } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateAlergenoDto, UpdateAlergenoDto } from '@app/common';
import { MS_PRODUCTS } from '../../config/service'; // O usa el string 'MS_PRODUCTS'

@Controller('gestion/alergenos')
export class GatewayAlergenosController {
  constructor(@Inject(MS_PRODUCTS) private readonly productsClient: ClientProxy) {}

  @Post()
  create(@Body() createAlergenoDto: CreateAlergenoDto) {
    return this.productsClient.send({ cmd: 'create_allergen' }, createAlergenoDto);
  }

  @Get()
  findAll() {
    return this.productsClient.send({ cmd: 'find_all_allergens' }, {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'find_one_allergen' }, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlergenoDto: UpdateAlergenoDto) {
    // Aseguramos que el ID viaja en el DTO
    return this.productsClient.send({ cmd: 'update_allergen' }, { ...updateAlergenoDto, id });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'remove_allergen' }, id);
  }
}