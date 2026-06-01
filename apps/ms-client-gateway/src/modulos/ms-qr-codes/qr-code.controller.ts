import { Controller, Post, Body, Inject, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MS_QRCODES } from '../../config/service'; // <-- Asegúrate de que la ruta a tu config sea la correcta

@Controller('gestion/qr')
export class GatewayQrController {
  constructor(@Inject(MS_QRCODES) private readonly qrClient: ClientProxy) {}

  @Post()
  generateTableQr(@Body('tableId') tableId: string) {
    if (!tableId) {
      throw new BadRequestException('El campo tableId es obligatorio');
    }
    
    return this.qrClient.send({ cmd: 'generate_table_qr' }, { tableId });
  }
}