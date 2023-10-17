import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PlayersService } from '../players/players.service';
import { TurretService } from "../turret/turret.service";
export declare class GameControllerGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
    private readonly turretService;
    private readonly playerService;
    private readonly log;
    private server;
    constructor(turretService: TurretService, playerService: PlayersService);
    handleRegistration(id: string, socket: Socket): void;
    stop(id: string, socket: Socket): void;
    handleEvents(id: string, socket: Socket): void;
    rotateRight(id: string, socket: Socket): void;
    rotateLeft(id: string, socket: Socket): void;
    stopRotation(id: string, socket: Socket): void;
    afterInit(server: Server): void;
    handleConnection(socket: Socket): void;
    handleDisconnect(socket: Socket): void;
}
