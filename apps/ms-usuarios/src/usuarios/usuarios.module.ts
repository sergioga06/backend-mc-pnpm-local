// src/modules/users/users.module.ts
import { Module } from '@nestjs/common';

import { UsersController } from './usuarios.controller';
import { UsersService } from './usuarios.service';


@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}