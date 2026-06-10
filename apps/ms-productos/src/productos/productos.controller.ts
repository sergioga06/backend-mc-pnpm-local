import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductosService } from './productos.service';
import { CreateProductDto } from '@app/common';
import { UpdateProductDto } from '@app/common';

@Controller()
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @MessagePattern({ cmd: 'create_product' })
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productosService.create(createProductDto);
  }

  @MessagePattern({ cmd: 'find_all_products' })
  findAll(@Payload() includeInactive: boolean) {
    return this.productosService.findAll(includeInactive);
  }

  @MessagePattern({ cmd: 'find_one_product' })
  findOne(@Payload() id: string) {
    return this.productosService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_product' })
  update(@Payload() data: { id: string; updateProductDto: UpdateProductDto }) {
    return this.productosService.update(data.id, data.updateProductDto);
  }

  @MessagePattern({ cmd: 'remove_product' })
  remove(@Payload() id: string) {
    return this.productosService.remove(id);
  }

  @MessagePattern({ cmd: 'find_available_products' })
  findAvailable() {
    return this.productosService.findAvailable();
  }

  @MessagePattern({ cmd: 'search_products' })
  search(@Payload() query: string) {
    return this.productosService.search(query);
  }

  @MessagePattern({ cmd: 'toggle_product_availability' })
  toggleAvailability(@Payload() id: string) {
    return this.productosService.toggleAvailability(id);
  }

  // 👇 NUEVO: El "chivato" que le chiva los precios al microservicio de pedidos
  @MessagePattern({ cmd: 'get_ingredients_prices' })
  getIngredientsPrices(@Payload() ids: string[]) {
    return this.productosService.findIngredientsPrices(ids);
  }
}