import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envs } from '../../config/envs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envs.jwtSecret, 
    });
    console.log("DEBUG [JwtStrategy]: Secreto cargado:", envs.jwtSecret?.substring(0, 4) + "...");
  }

  async validate(payload: any) {
    console.log("DEBUG: Token decodificado correctamente:", payload);
    return { id: payload.sub, role: payload.role, email: payload.email };
  }
}