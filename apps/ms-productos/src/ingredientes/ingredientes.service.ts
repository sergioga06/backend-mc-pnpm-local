import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm'; // 👈 IMPORTANTE: Añadimos IsNull
import { Ingredient } from '@app/common/entities/ms-productos/ingrediente.entity';
import { CreateIngredientDto } from '@app/common/dto/ms-productos/ingredientes/create-ingrediente.dto';
import { UpdateIngredientDto } from '@app/common/dto/ms-productos/ingredientes/update-ingrediente.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class IngredientesService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

  async create(createIngredientDto: CreateIngredientDto) {
    try {
      const ingredient = this.ingredientRepository.create(createIngredientDto);
      ingredient.isActive = true; // Forzamos a true para los nuevos
      return await this.ingredientRepository.save(ingredient);
    } catch (error) {
      // 23505 es el código de error de PostgreSQL para "Unique Constraint" (Duplicados)
      if (error.code === '23505') {
        throw new RpcException({ 
          statusCode: 400, 
          message: `El ingrediente '${createIngredientDto.name}' ya existe en la despensa.` 
        });
      }
      throw new RpcException(error);
    }
  }

  async findAll() {
    // 👻 RESCATE FANTASMA: Buscamos los true y los NULL (los antiguos)
    return await this.ingredientRepository.find({
      where: [
        { isActive: true },
        { isActive: IsNull() } 
      ]
    });
  }

  async findOne(id: string) {
    const ingredient = await this.ingredientRepository.findOne({
      where: [
        { id, isActive: true },
        { id, isActive: IsNull() }
      ]
    });
    if (!ingredient) throw new NotFoundException(`Ingrediente no encontrado`);
    return ingredient;
  }

  async update(id: string, updateIngredientDto: UpdateIngredientDto) {
    const ingredient = await this.findOne(id);
    Object.assign(ingredient, updateIngredientDto);
    // Al actualizarlo, lo "curamos" forzando su estado a true si estaba en NULL
    if (ingredient.isActive === null) ingredient.isActive = true;
    return await this.ingredientRepository.save(ingredient);
  }

  async remove(id: string) {
    const ingredient = await this.findOne(id);
    ingredient.isActive = false; // Borrado lógico
    return await this.ingredientRepository.save(ingredient);
  }
}