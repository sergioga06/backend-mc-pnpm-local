import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Inyección global
import { CreateRoleDto } from '@app/common/dto/ms-usuarios/ms-roles/create-role.dto';
import { UpdateRoleDto } from '@app/common/dto/ms-usuarios/ms-roles/update-role.dto';

@Injectable()
export class RolesService {
  
  // 1. CONSTRUCTOR
  // Traemos a Prisma para poder hablar con la base de datos.
  constructor(private readonly prisma: PrismaService) {}

  // 2. CREAR ROL
  async create(createRoleDto: CreateRoleDto) {
    // Sacamos la lista de IDs de permisos y el nombre del rol.
    const { permisoIds, name } = createRoleDto;
    
    // --- GENERACIÓN MANUAL DE SLUG ---
    // Un slug es el nombre pero en formato "amigable para máquinas" (sin espacios ni tildes).
    // .toLowerCase() -> pone todo en minúsculas.
    // .replace(/ /g, '_') -> cambia TODOS los espacios por guiones bajos.
    // Ej: "Jefe de Cocina" -> "jefe_de_cocina"
    const slug = name.toLowerCase().replace(/ /g, '_');

    return this.prisma.role.create({
      data: {
        name,
        slug,
        // --- RELACIÓN CON PERMISOS (CONNECT) ---
        // Aquí ocurre la magia de Prisma.
        // Si nos enviaron una lista de IDs de permisos (ej: ["id1", "id2"]),
        // le decimos a Prisma: "Busca esos permisos que YA existen y conéctalos a este nuevo rol".
        permisos: permisoIds ? {
          connect: permisoIds.map((id) => ({ id }))
        } : undefined
      },
      // include: { permisos: true } -> Es como un JOIN. 
      // Nos devuelve el Rol creado Y ADEMÁS la lista completa de sus permisos dentro.
      include: { permisos: true }
    });
  }

  // 3. LISTAR TODOS
  async findAll() {
    return this.prisma.role.findMany({
      // Siempre traemos los permisos asociados para saber qué puede hacer cada rol.
      include: { permisos: true }
    });
  }

  // 4. BUSCAR UNO
  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { permisos: true }
    });
    
    if (!role) throw new NotFoundException(`Rol ${id} no encontrado`);
    return role;
  }

  // 5. ACTUALIZAR
  async update(id: string, updateRoleDto: UpdateRoleDto) {
    // Separamos los permisos del resto de datos (nombre, slug, etc.).
    const { permisoIds, ...data } = updateRoleDto;

    return this.prisma.role.update({
      where: { id },
      data: {
        ...data,
        // --- ACTUALIZAR RELACIONES (SET) ---
        // Esto es muy potente. 
        // 'set' significa: "Olvida los permisos que tenías antes y pon EXACTAMENTE estos".
        // Si antes tenía [A, B] y ahora mandas [B, C], el resultado final será [B, C].
        permisos: permisoIds ? {
          set: permisoIds.map((pid) => ({ id: pid })) 
        } : undefined
      },
      include: { permisos: true }
    });
  }

  // 6. BORRAR (HARD DELETE)
  async remove(id: string) {
    // Al igual que en Permisos, aquí estás borrando el rol DE VERDAD de la base de datos.
    // Asegúrate de que ningún usuario tenga este rol asignado antes de borrarlo,
    // o podrías dejar usuarios "huerfanos" de rol (dependiendo de tu DB).
    return this.prisma.role.delete({ where: { id } });
  }
}