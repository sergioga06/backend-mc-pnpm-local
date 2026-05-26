import { PartialType } from '@nestjs/mapped-types';
import { CreateAlergenoDto } from './create-alergeno.dto';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateAlergenoDto extends PartialType(CreateAlergenoDto) {
  @IsString()
  @IsNotEmpty()
  id: string;
}