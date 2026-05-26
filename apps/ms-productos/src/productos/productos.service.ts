import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, ILike } from 'typeorm';
// Importamos los "moldes" (Entidades) y los "formularios" (DTOs)
import { CreateProductDto, UpdateProductDto, Product, Category, Allergen } from '@app/common';

@Injectable() // Marca esta clase como un "Servicio" que se puede inyectar en otros lados.
export class ProductosService {
  // Un sistema para escribir mensajes en la consola (útil para ver errores).
  private readonly logger = new Logger('ProductosService');

  // 1. EL CONSTRUCTOR (PREPARAR LAS HERRAMIENTAS)
  // Aquí "inyectamos" las tablas de la base de datos para poder usarlas.
  // Es como decirle al cocinero: "Toma acceso a la despensa de Productos, Categorías y Alérgenos".
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Allergen)
    private readonly allergenRepository: Repository<Allergen>,
  ) {}

  // 2. CREAR UN PRODUCTO
  async create(createProductDto: CreateProductDto) {
    // Separamos los datos: sacamos los IDs de categoría y alérgenos, y dejamos el resto (nombre, precio, etc.) aparte.
    const { categoryId, allergenIds, ...productDetails } = createProductDto;

    // Antes de guardar, verificamos que la Categoría exista en la base de datos.
    const category = await this.categoryRepository.findOneBy({ id: categoryId });
    if (!category) {
      // Si no existe, lanzamos un error y paramos todo.
      throw new NotFoundException(`Categoría con ID ${categoryId} no encontrada`);
    }

    // Buscamos los alérgenos si nos enviaron alguno.
    let allergens: Allergen[] = [];
    if (allergenIds && allergenIds.length > 0) {
      // "In" busca todos los que coincidan con la lista de IDs.
      allergens = await this.allergenRepository.findBy({ id: In(allergenIds) });
    }

    try {
      // Preparamos el objeto final para guardar.
      const product = this.productRepository.create({
        ...productDetails, // Copia nombre, precio, descripción...
        category,          // Asigna la relación con la categoría real.
        allergens,         // Asigna la relación con los alérgenos reales.
      });
      // Guardamos en la base de datos.
      return await this.productRepository.save(product);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // 3. BUSCAR TODOS
  async findAll(includeInactive: boolean = false) {
    // Si includeInactive es falso, solo buscamos los que tengan isActive: true.
    const where = includeInactive ? {} : { isActive: true };
    
    return this.productRepository.find({
      where, 
      relations: ['category', 'allergens'], // ¡Importante! Trae también los datos de la categoría y alérgenos asociados.
      order: { name: 'ASC' } // Ordenados alfabéticamente.
    });
  }

  // 4. BUSCAR UNO
  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'allergens'],
    });
    // Si no lo encuentra, error 404.
    if (!product) throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    return product;
  }

  // 5. ACTUALIZAR
  async update(id: string, updateProductDto: UpdateProductDto) {
    const { categoryId, allergenIds, ...toUpdate } = updateProductDto;

    // Primero buscamos el producto original (reutilizamos el método findOne de arriba).
    const product = await this.findOne(id); 

    // Si nos piden cambiar la categoría, verificamos que la nueva exista.
    if (categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: categoryId });
      if (!category) throw new NotFoundException(`Categoría ${categoryId} no encontrada`);
      product.category = category;
    }

    // Si nos piden cambiar alérgenos, buscamos los nuevos.
    if (allergenIds) {
      const allergens = await this.allergenRepository.findBy({ id: In(allergenIds) });
      product.allergens = allergens;
    }

    // "merge" mezcla los datos viejos (product) con los nuevos (toUpdate).
    this.productRepository.merge(product, toUpdate);
    
    // Guardamos los cambios.
    return this.productRepository.save(product);
  }

  // 6. BORRAR (SOFT DELETE)
  async remove(id: string) {
    const product = await this.findOne(id);
    // TRUCO: No borramos el dato de verdad. Solo ponemos "isActive = false".
    // Así mantenemos el historial de ventas antiguas sin perder datos.
    product.isActive = false; 
    return await this.productRepository.save(product);
  }

  // --- MÉTODOS EXTRAS ---

  async findAvailable() {
    // Busca solo los activos.
    return this.productRepository.find({
      where: { isActive: true },
      relations: ['category', 'allergens'],
    });
  }

  async search(query: string) {
    // Buscador inteligente.
    // ILike significa "Insensitive Like": busca mayúsculas y minúsculas por igual.
    // %texto% significa "que contenga el texto en cualquier parte".
    return this.productRepository.find({
      where: [
        { name: ILike(`%${query}%`), isActive: true }, // Busca en el nombre...
        { description: ILike(`%${query}%`), isActive: true }, // ...O en la descripción.
      ],
      relations: ['category', 'allergens'],
    });
  }

  async toggleAvailability(id: string) {
    const product = await this.findOne(id);
    // Invierte el valor: si es true pasa a false, y viceversa.
    product.isActive = !product.isActive;
    return await this.productRepository.save(product);
  }

  // Manejo de errores genérico para no repetir código.
  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new Error('Error al gestionar productos. Revisa los logs.');
  }
}