import { IsInt, IsEnum, IsString, IsOptional, Min } from 'class-validator';
import { TableStatus } from '../../entities/ms-tables/table.entity';

export class CreateTableDto {
  @IsInt()
  @Min(1)
  number: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(TableStatus)
  @IsOptional()
  status?: TableStatus;
}