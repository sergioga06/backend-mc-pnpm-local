import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, ILike } from 'typeorm';
// 👇 Añadimos Ingredient al import
import { CreateProductDto, UpdateProductDto, Product, Category, Allergen, Ingredient } from '@app/common';

@Injectable()
export class ProductosService {
  private readonly logger = new Logger('ProductosService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Allergen)
    private readonly allergenRepository: Repository<Allergen>,
    // 👇 Inyectamos el nuevo almacén de ingredientes
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    // 👇 Extraemos también los ingredientIds
    const { categoryId, allergenIds, ingredientIds, ...productDetails } = createProductDto;

    const category = await this.categoryRepository.findOneBy({ id: categoryId });
    if (!category) {
      throw new NotFoundException(`Categoría con ID ${categoryId} no encontrada`);
    }

    let allergens: Allergen[] = [];
    if (allergenIds && allergenIds.length > 0) {
      allergens = await this.allergenRepository.findBy({ id: In(allergenIds) });
    }

    // 👇 Buscamos los ingredientes seleccionados
    let ingredients: Ingredient[] = [];
    if (ingredientIds && ingredientIds.length > 0) {
      ingredients = await this.ingredientRepository.findBy({ id: In(ingredientIds) });
    }

    try {
      const product = this.productRepository.create({
        ...productDetails, 
        category,          
        allergens,         
        ingredients, //  Los guardamos en la tabla intermedia
      });
      return await this.productRepository.save(product);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(includeInactive: boolean = false) {
    const where = includeInactive ? {} : { isActive: true };
    return this.productRepository.find({
      where, 
      relations: ['category', 'allergens', 'ingredients'], // 👇 Añadimos ingredients a la respuesta
      order: { name: 'ASC' } 
    });
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'allergens', 'ingredients'], // 👇 Añadimos ingredients
    });
    if (!product) throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { categoryId, allergenIds, ingredientIds, ...toUpdate } = updateProductDto;

    const product = await this.findOne(id); 

    if (categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: categoryId });
      if (!category) throw new NotFoundException(`Categoría ${categoryId} no encontrada`);
      product.category = category;
    }

    if (allergenIds) {
      const allergens = await this.allergenRepository.findBy({ id: In(allergenIds) });
      product.allergens = allergens;
    }

    // 👇 Actualizamos la lista de ingredientes si nos mandan una nueva
    if (ingredientIds) {
      const ingredients = await this.ingredientRepository.findBy({ id: In(ingredientIds) });
      product.ingredients = ingredients;
    }

    this.productRepository.merge(product, toUpdate);
    return this.productRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    product.isActive = false; 
    return await this.productRepository.save(product);
  }

  async findAvailable() {
    return this.productRepository.find({
      where: { isActive: true },
      relations: ['category', 'allergens', 'ingredients'], // 👇 Añadimos ingredients
    });
  }

  async search(query: string) {
    return this.productRepository.find({
      where: [
        { name: ILike(`%${query}%`), isActive: true }, 
        { description: ILike(`%${query}%`), isActive: true }, 
      ],
      relations: ['category', 'allergens', 'ingredients'], // 👇 Añadimos ingredients
    });
  }

  async toggleAvailability(id: string) {
    const product = await this.findOne(id);
    product.isActive = !product.isActive;
    return await this.productRepository.save(product);
  }

  // 👇 NUEVO: Método para buscar rápidamente cuánto cuestan los ingredientes extra
  async findIngredientsPrices(ids: string[]) {
    if (!ids || ids.length === 0) return [];
    
    return await this.ingredientRepository.find({
      where: { id: In(ids) },
      select: ['id', 'extraPrice'] // Solo extraemos el precio por eficiencia
    });
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new Error('Error al gestionar productos. Revisa los logs.');
  }
}