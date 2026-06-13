import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IngredientesService } from './ingredientes.service';
import { CreateIngredientDto } from '@app/common/dto/ms-productos/ingredientes/create-ingrediente.dto';
import { UpdateIngredientDto } from '@app/common/dto/ms-productos/ingredientes/update-ingrediente.dto';

@Controller()
export class IngredientesController {
  constructor(private readonly ingredientesService: IngredientesService) {}

  @MessagePattern({ cmd: 'create_ingredient' })
  create(@Payload() createIngredientDto: CreateIngredientDto) {
    return this.ingredientesService.create(createIngredientDto);
  }

  @MessagePattern({ cmd: 'find_all_ingredients' })
  findAll() {
    return this.ingredientesService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_ingredient' })
  findOne(@Payload('id') id: string) {
    return this.ingredientesService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_ingredient' })
  update(@Payload() payload: { id: string; updateIngredientDto: UpdateIngredientDto }) {
    return this.ingredientesService.update(payload.id, payload.updateIngredientDto);
  }

  @MessagePattern({ cmd: 'remove_ingredient' })
  remove(@Payload('id') id: string) {
    return this.ingredientesService.remove(id);
  }
}