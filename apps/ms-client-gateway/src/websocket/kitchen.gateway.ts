import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
export class KitchenGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  
  private readonly logger = new Logger('KitchenGateway');

  handleConnection(client: Socket) {
    this.logger.log(`🟢 Cliente/Pantalla conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`🔴 Cliente/Pantalla desconectado: ${client.id}`);
  }

  // 1. Notificación global (Para que la cocina reciba todo)
  notifyNewOrder(order: any) {
    this.server.emit('new_order_kitchen', order);
  }

  // --- LO NUEVO PARA EL ESTADO DE LOS PEDIDOS ---

  // 2. El cliente (móvil) llama a esto para "unirse" a la sala de su pedido
  @SubscribeMessage('join_order_room')
  handleJoinOrderRoom(@MessageBody() orderId: string, @ConnectedSocket() client: Socket) {
    client.join(orderId);
    this.logger.log(`📱 Cliente ${client.id} suscrito a las actualizaciones del pedido: ${orderId}`);
  }

  // 3. El Gateway llama a esto cuando la cocina cambia el estado
  notifyOrderStatusChange(order: any) {
    // server.to(room) envía el mensaje SOLO a los que están en esa sala
    this.server.to(order.id).emit('order_status_updated', order);
  }
}