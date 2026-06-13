import { PartialType } from '@nestjs/mapped-types';
import { CreateIngredientDto } from './create-ingrediente.dto';
import { IsBoolean, IsOptional } from 'class-validator';


export class UpdateIngredientDto extends PartialType(CreateIngredientDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}