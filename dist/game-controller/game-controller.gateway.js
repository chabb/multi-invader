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
let GameControllerGateway = class GameControllerGateway {
    constructor(playerService) {
        this.playerService = playerService;
    }
    handleRegistration(id, socket) {
        console.log('new player registration');
        socket.emit('registered', { id: socket.id }, () => {
            console.log(`player ${socket.id} connected`);
            this.playerService.addPlayer(id);
        });
    }
    handleEvents(client, payload) {
        return 'Hello world!';
    }
    afterInit(server) {
        console.log('Server started, config : ', server._opts);
    }
    handleConnection(socket) {
        console.log('Client connecting...', socket.id);
    }
    handleDisconnect(socket) {
        console.log(` Client ${socket.id} disconnected`);
        this.playerService.removePlayer(socket.id);
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
    (0, common_1.UseGuards)(register_guard_1.RegisteredGuard),
    (0, websockets_1.SubscribeMessage)('events'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", String)
], GameControllerGateway.prototype, "handleEvents", null);
exports.GameControllerGateway = GameControllerGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [players_service_1.PlayersService])
], GameControllerGateway);
//# sourceMappingURL=game-controller.gateway.js.map