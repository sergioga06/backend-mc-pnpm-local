import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Importamos los "moldes" (Entidades) y los "formularios" (DTOs)
import { CreateCategoryDto, UpdateCategoryDto, Category } from '@app/common';

@Injectable()
export class CategoriasService implements OnModuleInit {
  private readonly logger = new Logger('CategoriasService');

  // 1. CONSTRUCTOR
  // Le damos acceso a la tabla de 'Category' en la base de datos.
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // Se ejecuta automáticamente al encender el microservicio. Solo avisa por consola.
  async onModuleInit() {
    this.logger.log('CategoriasService inicializado');
  }

  // 2. CREAR CATEGORÍA
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      // Prepara el objeto con los datos recibidos (nombre, descripción...).
      const category = this.categoryRepository.create(createCategoryDto);
      // Lo guarda en la base de datos.
      return await this.categoryRepository.save(category);
    } catch (error) {
      // Si falla (ej. nombre repetido), gestionamos el error abajo.
      this.handleDBExceptions(error);
    }
  }

  // 3. LISTAR TODAS
  // includeInactive: false -> Muestra solo las activas.
  // includeInactive: true  -> Muestra activas y borradas (para el admin).
  async findAll(includeInactive: boolean = false) {
    const where = includeInactive ? {} : { isActive: true };
    return this.categoryRepository.find({
      where,
      order: { name: 'ASC' } // Orden alfabético (A-Z)
    });
  }

  // 4. BUSCAR UNA
  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'], // ¡OJO! Aquí traemos también los productos que hay dentro.
    });
    
    // Si no existe, lanzamos error 404.
    if (!category) throw new NotFoundException(`Categoría ${id} no encontrada`);
    return category;
  }

  // 5. ACTUALIZAR
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    // Primero buscamos la original.
    const category = await this.findOne(id);
    
    // Mezclamos los datos nuevos sobre los viejos.
    this.categoryRepository.merge(category, updateCategoryDto);
    
    try {
      return await this.categoryRepository.save(category);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // 6. BORRAR (SOFT DELETE)
  async remove(id: string) {
    const category = await this.findOne(id);
    // No borramos el dato, solo lo ocultamos poniendo isActive = false.
    category.isActive = false; 
    return await this.categoryRepository.save(category);
  }

  // --- 7. LA JOYA DE LA CORONA (EL MENÚ) ---
  
  async getMenu() {
    // Aquí NO usamos el método simple .find() porque necesitamos algo complejo:
    // "Dame las categorías activas, Y DENTRO de ellas, dame SOLO los productos activos".
    
    // QueryBuilder es como escribir SQL a mano pero con ayuda.
    return this.categoryRepository.createQueryBuilder('category')
      // Une con la tabla productos y tráelos
      .leftJoinAndSelect('category.products', 'product') 
      // Une los productos con sus alérgenos y tráelos
      .leftJoinAndSelect('product.allergens', 'allergens') 
      
      // FILTRO 1: La categoría debe estar activa
      .where('category.isActive = :active', { active: true })
      // FILTRO 2: El producto DENTRO de la categoría también debe estar activo
      .andWhere('product.isActive = :active', { active: true }) 
      
      // Ordenar todo bonito para el cliente
      .orderBy('category.name', 'ASC')
      .addOrderBy('product.name', 'ASC')
      
      // Ejecutar la consulta
      .getMany();
  }

  // Manejo de errores
  private handleDBExceptions(error: any) {
    // El código '23505' en PostgreSQL significa "Violación de unicidad" (Dato duplicado).
    if (error.code === '23505') {
      throw new Error('Ya existe una categoría con ese nombre');
    }
    this.logger.error(error);
    throw new Error('Error en BD Categorias');
  }
}