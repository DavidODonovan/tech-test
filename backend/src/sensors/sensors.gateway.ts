import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000', //update this to our frontend host in prod.
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class SensorsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  emitStatusUpdate(sensorId: number, status: string) {
    this.server.emit('statusUpdate', { id: sensorId, currentStatus: status });
  }
}
