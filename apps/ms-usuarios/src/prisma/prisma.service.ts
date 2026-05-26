import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('PrismaService');

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    
    // Creamos el Pool de conexiones de PostgreSQL
    const pool = new Pool({ connectionString });
    
    // Creamos el adaptador para Prisma
    const adapter = new PrismaPg(pool);
    
    // Pasamos el adaptador al constructor de PrismaClient
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('🚀 Base de datos conectada correctamente con PrismaPg');
    } catch (error) {
      this.logger.error('❌ Error al conectar la base de datos', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}