import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import {PlayersService} from "../players/players.service";
import {UnRegisteredGuard} from "../register/unregister.guard";
import {RegisteredGuard} from "../register/register.guard";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameControllerGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  constructor(private readonly playerService: PlayersService) {
  }


  @UseGuards(UnRegisteredGuard)
  @SubscribeMessage('register')
  handleMessage(@MessageBody('id') id: string): void {
    this.playerService.addPlayer(id);
  }

  @UseGuards(RegisteredGuard)
  @SubscribeMessage('events')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  afterInit(server: Server): void {
    console.log('Server started, path : ', server.path);
  }

  handleConnection(socket: Socket): void {
    socket.emit('registered', { id: socket.id }, () => {
      console.log(`player ${socket.id} connected`);
    });
  }

  handleDisconnect(socket: Socket): void {
    console.log(` Client ${socket.id} disconnected`);
  }
}
