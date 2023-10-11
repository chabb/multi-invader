import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TurretService {
  private readonly turrets: Turret[] = [];
  constructor(private readonly conf: ConfigService) {
    for (let i = 0; i < this.conf.get<number>('TURRETS'); i++) {
      this.turrets.push(this.makeTurret());
    }
  }

  private makeTurret(): Turret {
    return {
      x: Math.floor(Math.random() * this.conf.get<number>('WIDTH')),
      y: Math.floor(Math.random() * this.conf.get<number>('HEIGHT')),
      rotationSpeed: Math.random() * 0.5,
      firingRate: 40 + Math.floor(Math.random() * 30),
      rotation: Math.random() * Math.PI,
    };
  }

  private removeTurret(index: number) {
    this.turrets.splice(index, 1);
  }

  public getTurrets() {
    return [...this.turrets];
  }
}

interface Turret {
  x: number;
  y: number;
  rotationSpeed: number;
  firingRate: number;
  rotation: number;
}
