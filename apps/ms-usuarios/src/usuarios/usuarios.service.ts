import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Nuestra herramienta para hablar con la BD
import { CreateUserDto } from '@app/common/dto/ms-usuarios/create-usuario.dto';
import { UpdateUserDto } from '@app/common/dto/ms-usuarios/update-usuario.dto';
// Importamos 'bcrypt': una librería famosa para encriptar contraseñas.
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  // 1. CONSTRUCTOR
  // Le damos al servicio acceso a la base de datos (Prisma).
  constructor(private readonly prisma: PrismaService) {}

  // 2. CREAR USUARIO (CONTRATAR)
  async create(createUserDto: CreateUserDto) {
    try {
      // Separamos los datos:
      // - password: La necesitamos aparte para encriptarla.
      // - roleIds: La lista de roles (ej: ["admin-id", "user-id"]) para conectarlos.
      // - userData: El resto de datos normales (nombre, email, apellido).
      const { password, roleIds, ...userData } = createUserDto;

      // ENCRIPTACIÓN:
      // "hash(password, 10)" convierte "123456" en algo ilegible como "$2b$10$EixZa...".
      // El '10' es el coste de procesamiento (más alto = más seguro pero más lento).
      const hashedPassword = await bcrypt.hash(password, 10);

      // Guardamos en la Base de Datos
      const user = await this.prisma.user.create({
        data: {
          ...userData, // Nombre, email, etc.
          password: hashedPassword, // Guardamos la versión segura, NUNCA la original.
          
          // CONEXIÓN DE ROLES (LA "MAGIA"):
          // Si nos enviaron IDs de roles, le decimos a Prisma:
          // "Busca esos roles que ya existen y únelos a este nuevo usuario".
          roles: roleIds && roleIds.length > 0 ? {
            connect: roleIds.map((id) => ({ id })) 
          } : undefined, 
        },
        include: {
          roles: true, // Pedimos que nos devuelva también los roles asignados para confirmar.
        },
      });

      // LIMPIEZA DE SEGURIDAD:
      // Antes de devolver el usuario creado al frontend, quitamos la contraseña del objeto.
      // { password: _, ...result } significa: "Saca 'password' y tíralo a la basura (_), guarda el resto en 'result'".
      const { password: _, ...result } = user;
      return result;

    } catch (error) {
      // MANEJO DE ERRORES PRISMA:
      // El código 'P2002' significa "Unique Constraint Failed".
      // O sea, intentaste crear un usuario con un email o username que YA EXISTE.
      if (error.code === 'P2002') {
        throw new ConflictException('El email o nombre de usuario ya existe');
      }
      throw error; // Si es otro error, que explote normalmente.
    }
  }

  // 3. LISTAR TODOS
  async findAll() {
    const users = await this.prisma.user.findMany({
      where: { isActive: true }, // FILTRO: Solo traemos a los empleados activos.
      include: {
        roles: true, // JOIN: Trae también sus roles (¿Es Admin? ¿Es Camarero?).
      },
      orderBy: { createdAt: 'desc' } // Los más nuevos primero.
    });

    // LIMPIEZA MASIVA:
    // Recorremos la lista de usuarios y le quitamos la contraseña a CADA UNO.
    return users.map(user => {
      const { password, ...rest } = user;
      return rest;
    });
  }

  // 4. BUSCAR UNO
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        // ANIDAMIENTO PROFUNDO:
        // "Trae los roles del usuario, Y ADEMÁS, trae los permisos de esos roles".
        // Así sabemos exactamente qué puede hacer este usuario.
        roles: {
          include: { permisos: true } 
        }
      }
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Limpieza de seguridad otra vez.
    const { password, ...result } = user;
    return result;
  }

  // 5. ACTUALIZAR
  async update(id: string, updateUserDto: UpdateUserDto) {
    // Sacamos la password por si el usuario quiere cambiarla.
    const { password, ...updateData } = updateUserDto;
    
    // Preparamos el objeto de datos a actualizar.
    let dataToUpdate: any = { ...updateData };
    
    // Si el usuario envió una nueva contraseña, ¡HAY QUE ENCRIPTARLA DE NUEVO!
    // No podemos guardar la nueva contraseña en texto plano.
    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: dataToUpdate,
      });

      const { password: _, ...result } = updatedUser;
      return result;

    } catch (error) {
      // Error P2025: "Record to update not found" (El ID no existe).
      if (error.code === 'P2025') {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
      throw error;
    }
  }

  // 6. BORRAR
  async remove(id: string) {
    // OPCIÓN A: Soft Delete (Comentada) -> "Despedir pero guardar ficha".
    /*
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false }
    });
    */

    // OPCIÓN B: Hard Delete (Activa) -> "Eliminar todo rastro".
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
      throw error;
    }
  }
}