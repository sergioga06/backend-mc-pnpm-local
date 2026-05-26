import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    username: string; // Faltaba este

    @IsString()
    @IsNotEmpty()
    firstName: string; // Antes era 'name'

    @IsString()
    @IsNotEmpty()
    lastName: string;  // Faltaba este

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true }) // Valida que cada elemento sea un string
    roleIds?: string[];
}