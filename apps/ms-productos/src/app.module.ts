import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Importamos los módulos (las "piezas" funcionales) de este microservicio
import { ProductosModule } from './productos/productos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { AlergenosModule } from './alergenos/alergenos.module';

// Importamos las "Entidades".
// Piensa en las Entidades como los "planos" de tus tablas.
// Le dicen al programa cómo debe ser un Producto, una Categoría, etc. en la base de datos.
import { Product } from '../../../libs/common/src/entities/ms-productos/productos.entity';
import { Category } from '../../../libs/common/src/entities/ms-productos/categoria.entity';
import { Allergen } from '../../../libs/common/src/entities/ms-productos/alergeno.entity';

@Module({
  imports: [
    // 1. CARGA DE CONFIGURACIÓN (.env)
    // Este módulo lee el archivo .env para saber contraseñas, puertos, etc.
    ConfigModule.forRoot({
      isGlobal: true, // Hace que la configuración esté disponible en todos lados sin importarla de nuevo.
      envFilePath: 'apps/ms-productos/.env', // Le dice explícitamente dónde buscar el archivo .env.
    }),

    // 2. CONEXIÓN A LA BASE DE DATOS (TypeORM)
    // Aquí configuramos el "cable" que conecta este código con PostgreSQL.
    TypeOrmModule.forRoot({
      type: 'postgres', // Le decimos qué tipo de base de datos usamos.
      url: process.env.DATABASE_URL, // Usamos la variable secreta que leímos del .env.
      
      // Busca automáticamente archivos que parezcan tablas (entidades) para cargarlos.
      autoLoadEntities: true, 
      
      // ¡OJO! Esto es "Magia peligrosa".
      // synchronize: true -> Si cambias algo en el código (ej. añades un campo 'precio'),
      // TypeORM modificará la base de datos REAL automáticamente.
      // Es genial para desarrollo, pero PELIGROSO en producción (podrías borrar datos sin querer).
      synchronize: true, 
      
      // Aquí listamos las tablas específicas que vamos a usar.
      entities: [Product, Category, Allergen],
    }),

    // 3. MÓDULOS DE FUNCIONALIDAD
    // Aquí "enchufamos" las partes que hacen el trabajo real.
    ProductosModule,  // Maneja la lógica de crear/editar productos.
    CategoriasModule, // Maneja las categorías.
    AlergenosModule,  // Maneja los alérgenos.
  ],
  controllers: [], // (Vacío porque este es solo el módulo principal, los controladores están en los sub-módulos)
  providers: [],
})
export class AppModule {}