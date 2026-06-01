import { Injectable, Logger } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  async generateQrForTable(tableId: string): Promise<string> {
    try {
      // Esta será la URL que se abrirá en el móvil del cliente al escanear
      const frontendUrl = `http://tupizzeria.com/menu?mesa=${tableId}`;
      
      // Generamos el código QR como una cadena de texto Base64 (lista para mostrar en HTML)
      const qrCodeBase64 = await QRCode.toDataURL(frontendUrl);
      
      this.logger.log(`QR generado con éxito para la mesa: ${tableId}`);
      return qrCodeBase64;
    } catch (error) {
      // Comprobamos si el error es una instancia de la clase Error estándar de Node
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      this.logger.error(`Error generando QR: ${errorMessage}`);
      throw new Error('No se pudo generar el código QR');
    }
  }
}