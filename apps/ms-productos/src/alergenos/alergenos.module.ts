import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlergenosService } from './alergenos.service';
import { AlergenosController } from './alergenos.controller';
import { Allergen } from '@app/common'; // Tu entidad compartida

@Module({
  imports: [
    TypeOrmModule.forFeature([Allergen]), // Inyectamos el repositorio
  ],
  controllers: [AlergenosController],
  providers: [AlergenosService],
  exports: [AlergenosService], // Por si ProductosService necesita usarlo
})
export class AlergenosModule {}