import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PlayersService } from '../players/players.service';
export declare class UnRegisteredGuard implements CanActivate {
    private readonly playerService;
    constructor(playerService: PlayersService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
