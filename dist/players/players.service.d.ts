import { Player } from './player.interface';
import { ConfigService } from '@nestjs/config';
export declare class PlayersService {
    private readonly conf;
    constructor(conf: ConfigService);
    private players;
    getPlayers(): string[];
    isActive(id: string): boolean;
    addPlayer(player: Player): void;
    createPlayer(id: any): Omit<Player, 'x' | 'y'>;
    removePlayer(id: string): void;
}
