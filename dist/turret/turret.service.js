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
exports.TurretService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let TurretService = class TurretService {
    constructor(conf) {
        this.conf = conf;
        this.turrets = [];
        for (let i = 0; i < parseInt(this.conf.get('TURRETS')); i++) {
            this.turrets.push(this.makeTurret());
        }
    }
    makeTurret() {
        return {
            x: Math.floor(Math.random() * parseInt(this.conf.get('WIDTH'))),
            y: Math.floor(Math.random() * parseInt(this.conf.get('HEIGHT'))),
            rotationSpeed: Math.random() * 0.5,
            firingRate: 40 + Math.floor(Math.random() * 30),
            rotation: Math.random() * Math.PI,
        };
    }
    removeTurret(index) {
        this.turrets.splice(index, 1);
    }
    getTurrets() {
        return [...this.turrets];
    }
};
exports.TurretService = TurretService;
exports.TurretService = TurretService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TurretService);
//# sourceMappingURL=turret.service.js.map