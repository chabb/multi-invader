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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisteredGuard = void 0;
const common_1 = require("@nestjs/common");
const players_service_1 = require("../players/players.service");
let RegisteredGuard = class RegisteredGuard {
    constructor(playerService) {
        this.playerService = playerService;
    }
    canActivate(context) {
        const argumentsHost = context.switchToWs();
        const socket = argumentsHost.getClient();
        const data = argumentsHost.getData();
        return socket.id === data.id && this.playerService.isActive(socket.id);
    }
};
exports.RegisteredGuard = RegisteredGuard;
exports.RegisteredGuard = RegisteredGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [players_service_1.PlayersService])
], RegisteredGuard);
//# sourceMappingURL=register.guard.js.map