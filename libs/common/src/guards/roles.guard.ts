import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Si la ruta no tiene el decorador @Roles, dejamos pasar
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Si la ruta requiere un rol pero no hay usuario en el token, bloqueamos
    if (!user || !user.role) {
      return false; 
    }

    // Comparamos forzando ambos lados a mayúsculas ("Admin" === "ADMIN")
    return requiredRoles.some((role) => user.role.toUpperCase() === role.toUpperCase());
  }
}