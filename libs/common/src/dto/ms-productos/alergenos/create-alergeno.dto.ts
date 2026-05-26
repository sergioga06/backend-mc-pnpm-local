import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAlergenoDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Ej: "Gluten"

  @IsString()
  @IsOptional()
  icon?: string; // Ej: "gluten-free.png"
}