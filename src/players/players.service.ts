import { Injectable } from '@nestjs/common';
import { Player } from './player.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PlayersService {
  constructor(private readonly conf: ConfigService) {}

  private players: { [id: string]: Player } = {};

  isActive(id: string): boolean {
    return !!this.players[id];
  }

  addPlayer(id: string): void {
    this.players[id] = {
      lifePoint: this.conf.get('MAXLIFE'),
    };
  }

  removePlayer(id: string): void {
    delete this.players[id];
  }
}
