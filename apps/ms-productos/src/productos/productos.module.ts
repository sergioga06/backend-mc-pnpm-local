import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Product, Allergen, Category } from '@app/common'; // Import de la lib
import { CategoriasModule } from '../categorias/categorias.module';

@Module({
  imports: [
    // Registramos las entidades que este módulo necesita tocar
    TypeOrmModule.forFeature([Product, Allergen, Category]),
    CategoriasModule,
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}