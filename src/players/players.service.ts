import { Injectable } from '@nestjs/common';
import { Player } from './player.interface';

@Injectable()
export class PlayersService {
  players: { [id: string]: Player };
}
