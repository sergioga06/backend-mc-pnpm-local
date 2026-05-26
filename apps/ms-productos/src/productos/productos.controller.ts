import { Controller } from '@nestjs/common';
// Importamos herramientas para hablar entre microservicios (no usa HTTP normal como GET/POST)
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductosService } from './productos.service';
// Importamos los "formularios" de datos (DTOs) para asegurar que la información viene bien
import { CreateProductDto } from '@app/common';
import { UpdateProductDto } from '@app/common';

@Controller()
export class ProductosController {
  
  // 1. INYECCIÓN DE DEPENDENCIAS
  // Aquí "contratamos" al servicio (el cocinero) para que esté listo cuando lo necesitemos.
  constructor(private readonly productosService: ProductosService) {}

  // 2. ESCUCHAR MENSAJES (@MessagePattern)
  // A diferencia de una API normal que usa rutas (ej: /productos), los microservicios
  // usan "patrones de mensaje". Si alguien grita "create_product", este método responde.
  
  @MessagePattern({ cmd: 'create_product' })
  create(@Payload() createProductDto: CreateProductDto) {
    // @Payload() es como abrir el sobre que nos enviaron para sacar los datos.
    return this.productosService.create(createProductDto);
  }

  @MessagePattern({ cmd: 'find_all_products' })
  findAll(@Payload() includeInactive: boolean) {
    // Pide al servicio que busque todos.
    // 'includeInactive' es un interruptor para ver si mostramos también los borrados/ocultos.
    return this.productosService.findAll(includeInactive);
  }

  @MessagePattern({ cmd: 'find_one_product' })
  findOne(@Payload() id: string) {
    // Busca un producto específico por su ID único.
    return this.productosService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_product' })
  update(@Payload() data: { id: string; updateProductDto: UpdateProductDto }) {
    // Recibe un paquete con dos cosas: EL ID del producto a cambiar y LOS DATOS nuevos.
    return this.productosService.update(data.id, data.updateProductDto);
  }

  @MessagePattern({ cmd: 'remove_product' })
  remove(@Payload() id: string) {
    // Manda borrar (o desactivar) el producto con ese ID.
    return this.productosService.remove(id);
  }

  // --- EXTRAS ---

  @MessagePattern({ cmd: 'find_available_products' })
  findAvailable() {
    // Una variante rápida para buscar solo lo que está en stock/disponible.
    return this.productosService.findAvailable();
  }

  @MessagePattern({ cmd: 'search_products' })
  search(@Payload() query: string) {
    // Buscador: recibe un texto (query) y le dice al servicio que busque coincidencias.
    return this.productosService.search(query);
  }

  @MessagePattern({ cmd: 'toggle_product_availability' })
  toggleAvailability(@Payload() id: string) {
    // Un interruptor rápido: si está activo lo desactiva, y viceversa.
    return this.productosService.toggleAvailability(id);
  }
}