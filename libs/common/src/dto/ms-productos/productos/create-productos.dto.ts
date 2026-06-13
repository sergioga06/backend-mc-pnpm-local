import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  IsUUID,
} from 'class-validator';

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

  // 👇 PERMISO DE ENTRADA: Le decimos a NestJS que acepte la lista de extras
  @IsOptional()
  @IsArray()
  extras?: { name: string, price: number }[];
}