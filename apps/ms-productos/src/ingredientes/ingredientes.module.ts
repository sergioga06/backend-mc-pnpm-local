import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientesService } from './ingredientes.service';
import { IngredientesController } from './ingredientes.controller';
import { Ingredient } from '@app/common/entities/ms-productos/ingrediente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient])],
  controllers: [IngredientesController],
  providers: [IngredientesService],
})
export class IngredientesModule {}