import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Importamos el "molde" (Entity) y los "formularios" (DTOs) desde la librería compartida
import { CreateAlergenoDto, UpdateAlergenoDto, Allergen } from '@app/common';

@Injectable()
export class AlergenosService {
  // Herramienta para escribir logs (diario de a bordo) en la consola.
  private readonly logger = new Logger('AlergenosService');

  // 1. CONSTRUCTOR
  // Le pedimos a NestJS que nos dé acceso a la tabla de 'Allergen' (Alérgenos).
  constructor(
    @InjectRepository(Allergen)
    private readonly allergenRepository: Repository<Allergen>,
  ) {}

  // 2. CREAR (Añadir un nuevo peligro)
  async create(createAlergenoDto: CreateAlergenoDto) {
    try {
      // Preparamos el objeto (ej: "Gluten", icono del trigo...).
      const allergen = this.allergenRepository.create(createAlergenoDto);
      // Lo guardamos en la base de datos.
      return await this.allergenRepository.save(allergen);
    } catch (error) {
      this.logger.error(error);
      throw new Error('Error al crear el alérgeno');
    }
  }

  // 3. LISTAR TODOS
  // Devuelve la lista completa de alérgenos registrados.
  async findAll() {
    return this.allergenRepository.find();
  }

  // 4. BUSCAR UNO
  async findOne(id: string) {
    // Busca por el ID exacto.
    const allergen = await this.allergenRepository.findOneBy({ id });
    
    // Si no existe, lanza un error 404.
    if (!allergen) {
      throw new NotFoundException(`Alérgeno con ID ${id} no encontrado`);
    }
    return allergen;
  }

  // 5. ACTUALIZAR
  async update(id: string, updateAlergenoDto: UpdateAlergenoDto) {
    // Primero verificamos que exista (reusando el método de arriba).
    const allergen = await this.findOne(id); 
    
    // Mezclamos los datos nuevos con los viejos.
    this.allergenRepository.merge(allergen, updateAlergenoDto);
    
    // Guardamos los cambios.
    return await this.allergenRepository.save(allergen);
  }

  // 6. BORRAR (¡CUIDADO AQUÍ!)
  async remove(id: string) {
    const allergen = await this.findOne(id);
    
    // DIFERENCIA IMPORTANTE:
    // En Productos y Categorías hacíamos "Soft Delete" (isActive = false).
    // Aquí estás usando .remove(), lo que significa BORRADO REAL (Hard Delete).
    // Si borras esto, desaparece de la base de datos. 
    return await this.allergenRepository.remove(allergen);
  }
}