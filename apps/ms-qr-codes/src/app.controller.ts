import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Este es el "canal" de NATS por el que escucharemos
  @MessagePattern({ cmd: 'generate_table_qr' })
  async generateQr(@Payload() data: { tableId: string }) {
    const qrImage = await this.appService.generateQrForTable(data.tableId);
    
    return { 
      tableId: data.tableId,
      qrBase64: qrImage 
    };
  }
}