import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client'; // Asumiendo que usarás Prisma como en ms-productos
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  
  private readonly logger = new Logger('AuthService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected for Auth');
  }

  // 1. Método para verificar si el usuario existe y la contraseña es correcta
  async loginUser(loginUserDto: any) { // Luego definiremos el DTO
    const { email, password } = loginUserDto;

    try {
      const user = await this.user.findUnique({
        where: { email }
      });

      if (!user) {
        throw new RpcException({
          status: 404,
          message: 'User not found'
        });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        throw new RpcException({
          status: 401,
          message: 'Invalid credentials'
        });
      }

      // Aquí retornaríamos el usuario (sin el password) y el Token
      const { password: _, ...rest } = user;
      return {
        user: rest,
        token: 'GENERAR_TOKEN_AQUÍ' // Esto lo haremos con @nestjs/jwt
      };

    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message
      });
    }
  }
}