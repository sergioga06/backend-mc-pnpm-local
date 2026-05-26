import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriasService } from './categorias.service';
// Importamos los "formularios" (DTOs) para saber qué datos nos llegan
import { CreateCategoryDto, UpdateCategoryDto } from '@app/common';

@Controller()
export class CategoriasController {
  
  // 1. CONSTRUCTOR
  // "Contratamos" al servicio de categorías para que haga el trabajo duro cuando se lo pidamos.
  constructor(private readonly categoriesService: CategoriasService) {}

  // 2. CREAR CATEGORÍA
  // Escucha el mensaje "create_category" (que seguramente le envía el Gateway).
  @MessagePattern({ cmd: 'create_category' })
  create(@Payload() createCategoryDto: CreateCategoryDto) {
    // Le pasa el formulario relleno al servicio.
    return this.categoriesService.create(createCategoryDto);
  }

  // 3. LISTAR TODAS
  // Pide el listado de categorías.
  // 'includeInactive' es un filtro opcional para ver también las que hemos borrado/ocultado.
  @MessagePattern({ cmd: 'find_all_categories' })
  findAll(@Payload() includeInactive: boolean) {
    return this.categoriesService.findAll(includeInactive);
  }

  // 4. BUSCAR UNA ESPECÍFICA
  // Busca el detalle de una categoría por su ID único.
  @MessagePattern({ cmd: 'find_one_category' })
  findOne(@Payload() id: string) {
    return this.categoriesService.findOne(id);
  }

  // 5. ACTUALIZAR
  // Recibe un paquete con dos cosas:
  // - id: Cuál categoría queremos cambiar.
  // - updateCategoryDto: Los nuevos datos (nombre, descripción, etc.).
  @MessagePattern({ cmd: 'update_category' })
  update(@Payload() data: { id: string; updateCategoryDto: UpdateCategoryDto }) {
    return this.categoriesService.update(data.id, data.updateCategoryDto);
  }

  // 6. BORRAR (O DESACTIVAR)
  // Manda ocultar la categoría con ese ID.
  @MessagePattern({ cmd: 'remove_category' })
  remove(@Payload() id: string) {
    return this.categoriesService.remove(id);
  }

  // 7. OBTENER MENÚ PÚBLICO
  // Esta función es especial. Probablemente devuelve las categorías YA organizadas
  // con sus productos dentro, listas para mostrarse en la carta digital del cliente.
  @MessagePattern({ cmd: 'get_menu' })
  getMenu() {
    return this.categoriesService.getMenu();
  }
}