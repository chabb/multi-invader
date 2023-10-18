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
import {ConfigService} from "@nestjs/config";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameControllerGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{

  private readonly log = new Logger();
  private server: Server;
  constructor(
      private readonly turretService: TurretService,
      private readonly playerService: PlayersService,
      private readonly confServe: ConfigService
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
        playerTank: player,
        player: this.playerService.getPlayers().length
      }, () => {
        this.log.log(`game state sent to ${socket.id}`)
        this.playerService.addPlayer(player);
        this.playerService.getPlayers().forEach(playerId => {
          if( playerId !== socket.id) {
            this.log.log('sending new player state');
            this.server.sockets.sockets.get(playerId).emit('player', {id: socket.id, index: this.playerService.getPlayers().length, player}, () => {
              this.log.log(`player ${playerId} info sent to player`, socket.id)
            });
          }
        });
      });
    });
  }


  @SubscribeMessage('config')
  getConfig(): any {
    return {
      width: parseInt(this.confServe.get('WIDTH')),
      height: parseInt(this.confServe.get('HEIGHT')),
      maxLife: parseInt(this.confServe.get('MAXLIFE')),
      turrets: parseInt(this.confServe.get('TURRETS'))
    }
  }

  @UseGuards(RegisteredGuard)
  @SubscribeMessage('stop')
  stop(@MessageBody('id') id: string, @ConnectedSocket() socket: Socket): void {
    this.playerService.getPlayers().forEach(playerId => {
      if( playerId !== socket.id) {
        this.log.log('[stop] sending new player state');
        this.server.sockets.sockets.get(playerId).emit('stop', {id})
      }
    });
  }

  @UseGuards(RegisteredGuard)
  @SubscribeMessage('forward')
  handleEvents(@MessageBody('id') id: string, @ConnectedSocket() socket: Socket): void {
    this.log.log(`forward ${socket.id}-${id}`);
    this.playerService.getPlayers().forEach(playerId => {
      if( playerId !== socket.id) {
        this.log.log(`sending new player state from ${id} to ${playerId}`);
        this.server.sockets.sockets.get(playerId).emit('forward', {id})
      }
    });
  }

  @UseGuards(RegisteredGuard)
  @SubscribeMessage('rotateRight')
  rotateRight(@MessageBody('id') id: string, @ConnectedSocket() socket: Socket): void {
    this.playerService.getPlayers().forEach(playerId => {
      if( playerId !== socket.id) {
        this.log.log('[rotateRight] sending new player state');
        this.server.sockets.sockets.get(playerId).emit('rotateRight', {id})
      }
    });
  }

  @UseGuards(RegisteredGuard)
  @SubscribeMessage('rotateLeft')
  rotateLeft(@MessageBody('id') id: string, @ConnectedSocket() socket: Socket): void {
    this.playerService.getPlayers().forEach(playerId => {
      if( playerId !== socket.id) {
        this.log.log('[rotateLeft] sending new player state');
        this.server.sockets.sockets.get(playerId).emit('rotateLeft', {id})
      }
    });
  }

  @UseGuards(RegisteredGuard)
  @SubscribeMessage('stopRotation')
  stopRotation(@MessageBody('id') id: string, @ConnectedSocket() socket: Socket): void {
    this.playerService.getPlayers().forEach(playerId => {
      if( playerId !== socket.id) {
        this.log.log('[stopRotation] sending new player state');
        this.server.sockets.sockets.get(playerId).emit('stopRotation', {id})
      }
    });
  }

  @UseGuards(RegisteredGuard)
  @SubscribeMessage('fireBullet')
  fireBullet(@MessageBody('id') id: string, @ConnectedSocket() socket: Socket): void {
      this.playerService.getPlayers().forEach(playerId => {
        if( playerId !== socket.id) {
          this.log.log('[fireBullete] sending new player state');
          this.server.sockets.sockets.get(playerId).emit('fireBullet', {id})
        }
      });
  }

  afterInit(server: Server): void {
    this.log.warn('Server started, config : ', server._opts);
    this.server = server;
  }

  handleConnection(socket: Socket): void {
    this.log.log('Client connecting...', socket.id);
  }

  handleDisconnect(socket: Socket): void {
    this.log.warn(` Client ${socket.id} disconnected`);
    this.playerService.removePlayer(socket.id);
  }
}
