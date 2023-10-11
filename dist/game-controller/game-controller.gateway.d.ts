import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PlayersService } from '../players/players.service';
import { TurretService } from "../turret/turret.service";
export declare class GameControllerGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
    private readonly turretService;
    private readonly playerService;
    private readonly log;
    constructor(turretService: TurretService, playerService: PlayersService);
    handleRegistration(id: string, socket: Socket): void;
    handleEvents(client: any, payload: any): string;
    afterInit(server: Server): void;
    handleConnection(socket: Socket): void;
    handleDisconnect(socket: Socket): void;
}
