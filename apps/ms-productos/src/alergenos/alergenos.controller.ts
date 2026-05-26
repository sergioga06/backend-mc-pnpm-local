import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AlergenosService } from './alergenos.service';
// Importamos los formularios de datos (DTOs)
import { CreateAlergenoDto, UpdateAlergenoDto } from '@app/common';

@Controller()
export class AlergenosController {
  
  // 1. CONSTRUCTOR
  // Contratamos al especialista en alérgenos (el Servicio) para que esté listo.
  constructor(private readonly alergenosService: AlergenosService) {}

  // 2. CREAR ALÉRGENO
  // Escucha el grito "create_allergen" desde el Gateway.
  @MessagePattern({ cmd: 'create_allergen' })
  create(@Payload() createAlergenoDto: CreateAlergenoDto) {
    // Le pasa los datos al servicio para que lo guarde.
    return this.alergenosService.create(createAlergenoDto);
  }

  // 3. LISTAR TODOS
  // Devuelve la lista completa de alérgenos disponibles.
  @MessagePattern({ cmd: 'find_all_allergens' })
  findAll() {
    return this.alergenosService.findAll();
  }

  // 4. BUSCAR UNO
  // Busca un alérgeno específico por su ID.
  @MessagePattern({ cmd: 'find_one_allergen' })
  findOne(@Payload() id: string) {
    return this.alergenosService.findOne(id);
  }

  // 5. ACTUALIZAR
  // Fíjate en un detalle curioso aquí:
  // En vez de recibir un objeto { id, datos }, aquí parece que el ID viene DENTRO del formulario (DTO).
  @MessagePattern({ cmd: 'update_allergen' })
  update(@Payload() updateAlergenoDto: UpdateAlergenoDto) {
    // Sacamos el ID del propio DTO y se lo pasamos al servicio junto con el resto de datos.
    return this.alergenosService.update(updateAlergenoDto.id, updateAlergenoDto);
  }

  // 6. BORRAR
  // Manda eliminar un alérgeno (recuerda que en el servicio vimos que esto era un borrado real/hard delete).
  @MessagePattern({ cmd: 'remove_allergen' })
  remove(@Payload() id: string) {
    return this.alergenosService.remove(id);
  }
}