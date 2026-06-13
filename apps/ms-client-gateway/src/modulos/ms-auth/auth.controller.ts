import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';

@Controller('gestion/auth')
export class GatewayAuthController {
  // Asegúrate de usar el token de inyección correcto de tu config (Ej: 'MS_AUTH')
  constructor(@Inject('MS_AUTH') private readonly authClient: ClientProxy) {}

  @Post('login')
  login(@Body() loginDto: any) {
    return this.authClient.send({ cmd: 'login_user' }, loginDto)
      .pipe(catchError(error => throwError(() => new RpcException(error))));
  }
}