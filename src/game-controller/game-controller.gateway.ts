import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameControllerGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  afterInit(server: Server): void {
    console.log('Server started, path : ', server.path);
  }

  handleConnection(socket: Socket): void {
    socket.emit('register', { id: socket.id }, () => {
      console.log(`player ${socket.id} registered `, () => {});
    });
  }

  handleDisconnect(socket: Socket): void {}
}
