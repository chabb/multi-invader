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
import {Logger, UseGuards} from '@nestjs/common';
import {TurretService} from "../turret/turret.service";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameControllerGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{

  private readonly log = new Logger();
  constructor(
      private readonly turretService: TurretService,
      private readonly playerService: PlayersService,
      ) {}

  @UseGuards(UnRegisteredGuard)
  @SubscribeMessage('register')
  handleRegistration(@MessageBody('id') id: string, @ConnectedSocket() socket: Socket): void {
    this.log.log(`new player registration ${id}`);
    socket.emit('registered', { id: socket.id }, () => {
      this.log.log(`player ${socket.id} connected`);
      const player = this.playerService.createPlayer(id);
      this.log.debug('current number of player', this.playerService.getPlayers().length);
      // send current state
      socket.emit('state', {
        turrets: this.turretService.getTurrets(),
        player: this.playerService.getPlayers().length
      }, ({x, y}) => {
        this.log.log(`game state sent to ${socket.id}`)
        this.playerService.addPlayer({...player, x, y});
        this.playerService.getPlayers().forEach(playerId => {
          if( playerId !== socket.id) {
            this.log.log('sending new player state');
            socket.emit('player', {id, index: this.playerService.getPlayers().length}, () => {
              this.log.log(`player ${playerId} info sent to player`, socket.id)
            });
          }
        });
      });
    });
  }
  @UseGuards(RegisteredGuard)
  @SubscribeMessage('events')
  handleEvents(client: any, payload: any): string {
    return 'Hello world!';
  }

  afterInit(server: Server): void {
    this.log.warn('Server started, config : ', server._opts);
  }

  handleConnection(socket: Socket): void {
    this.log.log('Client connecting...', socket.id);
  }

  handleDisconnect(socket: Socket): void {
    this.log.warn(` Client ${socket.id} disconnected`);
    this.playerService.removePlayer(socket.id);
  }
}
