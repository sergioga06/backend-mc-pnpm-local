import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// 1. Definimos las reglas exactas para el contenido de los Extras
export class ExtraItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  // ✅ PERFECTO: La imagen ya tiene su pase VIP
  @IsString()
  @IsOptional()
  image?: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  allergenIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  ingredientIds?: string[];

  // ✅ CORREGIDO: Ahora NestJS validará y aceptará el interior de los extras
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExtraItemDto)
  extras?: ExtraItemDto[];
}