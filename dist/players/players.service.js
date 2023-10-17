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
exports.PlayersService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let PlayersService = class PlayersService {
    constructor(conf) {
        this.conf = conf;
        this.players = {};
    }
    numberOfPlayers() {
        return this.getPlayers().length;
    }
    getPlayers() {
        return Object.keys(this.players);
    }
    isActive(id) {
        return !!this.players[id];
    }
    addPlayer(player) {
        this.players[player.id] = player;
    }
    createPlayer(id) {
        let offsetDirection = Math.random() > 0.5 ? 1 : -1;
        let numberOfPlayets = this.numberOfPlayers();
        return {
            lifePoint: this.conf.get('MAXLIFE'),
            id,
            x: 300 + numberOfPlayets * 50 * offsetDirection,
            y: 300 + numberOfPlayets * 50 * offsetDirection
        };
    }
    removePlayer(id) {
        delete this.players[id];
    }
};
exports.PlayersService = PlayersService;
exports.PlayersService = PlayersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PlayersService);
//# sourceMappingURL=players.service.js.map