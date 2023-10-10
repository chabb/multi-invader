import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { PlayersService } from '../players/players.service';
import { UnRegisteredGuard } from '../register/unregister.guard';
import { RegisteredGuard } from '../register/register.guard';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameControllerGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  constructor(private readonly playerService: PlayersService) {}

  @UseGuards(UnRegisteredGuard)
  @SubscribeMessage('register')
  handleRegistration(@MessageBody('id') id: string, @ConnectedSocket() socket: Socket): void {
    console.log('new player registration');
    socket.emit('registered', { id: socket.id }, () => {
      console.log(`player ${socket.id} connected`);
      this.playerService.addPlayer(id);
      // send current state

      // notify other players
    });
  }

  @UseGuards(RegisteredGuard)
  @SubscribeMessage('events')
  handleEvents(client: any, payload: any): string {
    return 'Hello world!';
  }

  afterInit(server: Server): void {
    console.log('Server started, config : ', server._opts);
  }

  handleConnection(socket: Socket): void {
    console.log('Client connecting...', socket.id);
  }

  handleDisconnect(socket: Socket): void {
    console.log(` Client ${socket.id} disconnected`);
    this.playerService.removePlayer(socket.id);
  }
}
