import { Player } from './player.interface';
import { ConfigService } from '@nestjs/config';
export declare class PlayersService {
    private readonly conf;
    constructor(conf: ConfigService);
    private players;
    numberOfPlayers(): number;
    getPlayers(): string[];
    isActive(id: string): boolean;
    addPlayer(player: Player): void;
    createPlayer(id: any): Player;
    removePlayer(id: string): void;
}
