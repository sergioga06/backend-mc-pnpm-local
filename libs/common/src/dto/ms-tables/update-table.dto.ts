import { PartialType } from '@nestjs/mapped-types';
import { CreateTableDto } from './create-table.dto';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class UpdateTableDto extends PartialType(CreateTableDto) {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}