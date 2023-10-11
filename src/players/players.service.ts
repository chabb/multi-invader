import { Injectable } from '@nestjs/common';
import { Player } from './player.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PlayersService {
  constructor(private readonly conf: ConfigService) {}

  private players: { [id: string]: Player } = {};

  getPlayers(): string[] {
    return Object.keys(this.players);
  }

  isActive(id: string): boolean {
    return !!this.players[id];
  }

  addPlayer(id: string): void {
    this.players[id] = {
      lifePoint: this.conf.get('MAXLIFE'),
      x: 20 * Object.keys(this.players).length + 1,
      y: 20 * Object.keys(this.players).length + 1
    };
  }

  removePlayer(id: string): void {
    delete this.players[id];
  }
}
