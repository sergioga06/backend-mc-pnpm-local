import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';
// Importación correcta desde la librería
import { LoginUserDto, RegisterUserDto } from '@app/common'; 

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger('AuthService');

  constructor(
    @Inject('NATS_SERVICE') private readonly client: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const { password, ...userData } = registerUserDto;

    try {
      // 1. Enviar a ms-usuarios para crear
      // (ms-usuarios debe tener un @MessagePattern('create_user'))
      const newUser = await firstValueFrom(
        this.client.send('create_user', {
          ...userData,
          password: await bcrypt.hash(password, 10), // Encriptamos aquí o allá, depende de tu diseño
        })
      );

      return {
        user: newUser,
        token: await this.signJWT({ id: newUser.id, email: newUser.email }),
      };

    } catch (error) {
      throw new RpcException(error);
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    try {
      // 1. Pedir usuario a ms-usuarios
      const user = await firstValueFrom(
        this.client.send('find_user_by_email', email)
      );

      if (!user) {
        throw new RpcException({ status: 400, message: 'Credenciales inválidas' });
      }

      // 2. Validar password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new RpcException({ status: 400, message: 'Credenciales inválidas' });
      }

      const { password: _, ...userWithoutPass } = user;

      return {
        user: userWithoutPass,
        token: await this.signJWT({ id: user.id, email: user.email }),
      };

    } catch (error) {
      throw new RpcException({ status: 400, message: 'Credenciales inválidas' });
    }
  }

  async verifyToken(token: string) {
    // ... tu lógica de verificar token (esa estaba bien) ...
    return { valid: true }; // Placeholder
  }

  private signJWT(payload: any) {
    return this.jwtService.sign(payload);
  }
}