"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameControllerGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const players_service_1 = require("../players/players.service");
const unregister_guard_1 = require("../register/unregister.guard");
const register_guard_1 = require("../register/register.guard");
const common_1 = require("@nestjs/common");
const turret_service_1 = require("../turret/turret.service");
const config_1 = require("@nestjs/config");
let GameControllerGateway = class GameControllerGateway {
    constructor(turretService, playerService, confServe) {
        this.turretService = turretService;
        this.playerService = playerService;
        this.confServe = confServe;
        this.log = new common_1.Logger();
    }
    handleRegistration(id, socket) {
        this.log.log(`new player registration ${id}`);
        socket.emit('registered', { id: socket.id }, () => {
            this.log.log(`player ${socket.id} connected`);
            const player = this.playerService.createPlayer(id);
            this.log.debug('current number of player', this.playerService.getPlayers().length);
            if (this.playerService.getPlayers().length >= 1) {
                const id = this.playerService.getPlayers()[0];
                this.log.warn(`Retrieving current state from the first player ${id}`);
                this.server.sockets.sockets.get(id).emit('getState', { id }, tanks => {
                    this.log.log('[GET STATE] tanks', tanks);
                    socket.emit('state', {
                        turrets: this.turretService.getTurrets(),
                        playerTank: player,
                        player: this.playerService.getPlayers().length,
                        playerTanks: tanks
                    }, () => {
                        this.log.log(`game state sent to ${socket.id}`);
                        this.playerService.addPlayer(player);
                        this.log.log(`we now have ${this.playerService.numberOfPlayers()} players`);
                        this.playerService.getPlayers().forEach(playerId => {
                            if (playerId !== socket.id) {
                                this.log.log('sending new player state');
                                this.server.sockets.sockets.get(playerId).emit('player', { id: socket.id, index: this.playerService.getPlayers().length, player }, () => {
                                    this.log.log(`player ${playerId} info sent to player`, socket.id);
                                });
                            }
                        });
                    });
                });
            }
            else {
                this.log.warn('FIRST PLAYER REGISTERED');
                this.playerService.addPlayer(player);
                socket.emit('state', {
                    turrets: this.turretService.getTurrets(),
                    playerTank: player,
                    player: this.playerService.getPlayers().length,
                    playerTanks: []
                }, () => this.log.log(`game state sent to ${socket.id}`));
            }
        });
    }
    getConfig() {
        return {
            width: parseInt(this.confServe.get('WIDTH')),
            height: parseInt(this.confServe.get('HEIGHT')),
            maxLife: parseInt(this.confServe.get('MAXLIFE')),
            turrets: parseInt(this.confServe.get('TURRETS'))
        };
    }
    stop(id, socket) {
        this.playerService.getPlayers().forEach(playerId => {
            if (playerId !== socket.id) {
                this.log.log('[stop] sending new player state');
                this.server.sockets.sockets.get(playerId).emit('stop', { id });
            }
        });
    }
    handleEvents(id, socket) {
        this.playerService.getPlayers().forEach(playerId => {
            if (playerId !== socket.id) {
                this.log.log(`[moveForward] sending new player state from ${id} to ${playerId}`);
                this.server.sockets.sockets.get(playerId).emit('forward', { id });
            }
        });
    }
    rotateRight(id, socket) {
        this.playerService.getPlayers().forEach(playerId => {
            if (playerId !== socket.id) {
                this.log.log('[rotateRight] sending new player state');
                this.server.sockets.sockets.get(playerId).emit('rotateRight', { id });
            }
        });
    }
    rotateLeft(id, socket) {
        this.playerService.getPlayers().forEach(playerId => {
            if (playerId !== socket.id) {
                this.log.log('[rotateLeft] sending new player state');
                this.server.sockets.sockets.get(playerId).emit('rotateLeft', { id });
            }
        });
    }
    stopRotation(id, socket) {
        this.playerService.getPlayers().forEach(playerId => {
            if (playerId !== socket.id) {
                this.log.log('[stopRotation] sending new player state');
                this.server.sockets.sockets.get(playerId).emit('stopRotation', { id });
            }
        });
    }
    fireBullet(id, socket) {
        this.playerService.getPlayers().forEach(playerId => {
            if (playerId !== socket.id) {
                this.log.log('[fireBullet] sending new player state');
                this.server.sockets.sockets.get(playerId).emit('fireBullet', { id });
            }
        });
    }
    afterInit(server) {
        this.log.warn('Server started, config : ', server._opts);
        this.server = server;
    }
    handleConnection(socket) {
        this.log.log('Client connecting...', socket.id);
    }
    handleDisconnect(socket) {
        this.log.warn(` Client ${socket.id} disconnected`);
        this.playerService.removePlayer(socket.id);
        socket.emit('playerDisconnect', { id: socket.id });
    }
};
exports.GameControllerGateway = GameControllerGateway;
__decorate([
    (0, common_1.UseGuards)(unregister_guard_1.UnRegisteredGuard),
    (0, websockets_1.SubscribeMessage)('register'),
    __param(0, (0, websockets_1.MessageBody)('id')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameControllerGateway.prototype, "handleRegistration", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], GameControllerGateway.prototype, "getConfig", null);
__decorate([
    (0, common_1.UseGuards)(register_guard_1.RegisteredGuard),
    (0, websockets_1.SubscribeMessage)('stop'),
    __param(0, (0, websockets_1.MessageBody)('id')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameControllerGateway.prototype, "stop", null);
__decorate([
    (0, common_1.UseGuards)(register_guard_1.RegisteredGuard),
    (0, websockets_1.SubscribeMessage)('forward'),
    __param(0, (0, websockets_1.MessageBody)('id')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameControllerGateway.prototype, "handleEvents", null);
__decorate([
    (0, common_1.UseGuards)(register_guard_1.RegisteredGuard),
    (0, websockets_1.SubscribeMessage)('rotateRight'),
    __param(0, (0, websockets_1.MessageBody)('id')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameControllerGateway.prototype, "rotateRight", null);
__decorate([
    (0, common_1.UseGuards)(register_guard_1.RegisteredGuard),
    (0, websockets_1.SubscribeMessage)('rotateLeft'),
    __param(0, (0, websockets_1.MessageBody)('id')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameControllerGateway.prototype, "rotateLeft", null);
__decorate([
    (0, common_1.UseGuards)(register_guard_1.RegisteredGuard),
    (0, websockets_1.SubscribeMessage)('stopRotation'),
    __param(0, (0, websockets_1.MessageBody)('id')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameControllerGateway.prototype, "stopRotation", null);
__decorate([
    (0, common_1.UseGuards)(register_guard_1.RegisteredGuard),
    (0, websockets_1.SubscribeMessage)('fireBullet'),
    __param(0, (0, websockets_1.MessageBody)('id')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameControllerGateway.prototype, "fireBullet", null);
exports.GameControllerGateway = GameControllerGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [turret_service_1.TurretService,
        players_service_1.PlayersService,
        config_1.ConfigService])
], GameControllerGateway);
//# sourceMappingURL=game-controller.gateway.js.map