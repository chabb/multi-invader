import {Injectable} from '@nestjs/common';
import {Player} from './player.interface';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class PlayersService {
    constructor(private readonly conf: ConfigService) {
    }

    private players: { [id: string]: Player } = {};

    getPlayers(): string[] {
        return Object.keys(this.players);
    }

    isActive(id: string): boolean {
        return !!this.players[id];
    }

    addPlayer(player: Player): void {
        this.players[player.id] = player
    }

    createPlayer(id): Omit<Player, 'x' | 'y'> {
        return {
            lifePoint: this.conf.get('MAXLIFE'),
            id
        };
    }

    removePlayer(id: string): void {
        delete this.players[id];
    }
}
