import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { Category } from '@app/common'; // Importamos la entidad desde tu librería compartida

@Module({
  imports: [
    // 👇 Esto crea el repositorio de Categorías para este módulo
    TypeOrmModule.forFeature([Category]), 
  ],
  controllers: [CategoriasController],
  providers: [CategoriasService],
  exports: [CategoriasService], // Útil si ProductosModule necesita verificar categorías
})
export class CategoriasModule {}