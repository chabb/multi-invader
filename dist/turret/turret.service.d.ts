import { ConfigService } from '@nestjs/config';
export declare class TurretService {
    private readonly conf;
    private readonly turrets;
    constructor(conf: ConfigService);
    private makeTurret;
    private removeTurret;
}
