import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envs } from '../../config/envs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1. Le decimos que extraiga el token del Header (Bearer Token)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 2. Le decimos que no acepte tokens caducados
      ignoreExpiration: false,
      // 3. Le damos la llave maestra para comprobar la firma
      secretOrKey: envs.jwtSecret, 
    });
  }

  // Si la firma es correcta, Passport ejecuta esta función automáticamente
  async validate(payload: any) {
    // Lo que devuelvas aquí, se inyectará en la petición (Request) 
    // y es lo que leerá nuestro RolesGuard para saber si es ADMIN o CAMARERO
    return { id: payload.id, role: payload.role, email: payload.email };
  }
}