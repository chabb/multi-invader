import { ConfigService } from '@nestjs/config';
export declare class PlayersService {
    private readonly conf;
    constructor(conf: ConfigService);
    private players;
    isActive(id: string): boolean;
    addPlayer(id: string): void;
    removePlayer(id: string): void;
}