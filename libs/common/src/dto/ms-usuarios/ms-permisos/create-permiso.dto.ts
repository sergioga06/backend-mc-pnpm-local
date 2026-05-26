import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePermisoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  action: string; // Ejemplo: "read"

  @IsString()
  @IsNotEmpty()
  resource: string; // Ejemplo: "products"
}