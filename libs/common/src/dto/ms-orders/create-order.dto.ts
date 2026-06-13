import { IsUUID, IsArray, ValidateNested, IsInt, Min, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

// 1. Añadimos el validador para las customizaciones
class OrderItemCustomizationDto {
@IsOptional()
  @IsArray()
  @IsString({ each: true }) // <- AHORA ACEPTARÁ TEXTO NORMAL ("Bacon", "Cebolla")
  added?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) 
  removed?: string[];
}

class OrderItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  // 2. Le decimos al Gateway que deje pasar las customizaciones
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderItemCustomizationDto)
  customizations?: OrderItemCustomizationDto;
}

export class CreateOrderDto {
  @IsUUID()
  tableId: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}