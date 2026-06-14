import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // 👇 Interceptamos la decisión de Passport para que nos confiese el error
  handleRequest(err, user, info) {
    console.log("--- DEBUG PASSPORT ---");
    console.log("Razón del rechazo:", info?.message || info);
    
    if (err || !user) {
      // Ahora Postman te dirá EXACTAMENTE cuál es el problema
      throw err || new UnauthorizedException(`Acceso bloqueado: ${info?.message || 'Token inválido'}`);
    }
    return user;
  }
}