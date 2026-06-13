import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('MS_USUARIOS') private readonly usersClient: ClientProxy,
  ) {}

  async login(loginDto: any) {
    try {
      // 1. Delegamos la validación de contraseña a ms-usuarios
      const user = await firstValueFrom(
        this.usersClient.send({ cmd: 'validate_credentials' }, loginDto)
      ).catch(() => null);

      if (!user) {
        throw new RpcException({ statusCode: 401, message: 'Email o contraseña incorrectos' });
      }

      // 2. Fabricamos el "Pase VIP" (Token JWT)
      const payload = { 
        sub: user.id, 
        email: user.email, 
        // Si tiene roles asignados, cogemos el primero, si no, es USER
        role: user.roles?.length > 0 ? user.roles[0].name : 'USER' 
      };
      
      const token = this.jwtService.sign(payload);

      // 3. Devolvemos el usuario limpio y su llave mágica
      return { user, token };
    } catch (error) {
       throw new RpcException({ statusCode: 401, message: 'Error de autenticación' });
    }
  }
}