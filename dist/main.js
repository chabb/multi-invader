"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const log = new common_1.Logger();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    log.log(`Configuration, TURRETS ${app.get(config_1.ConfigService).get('TURRETS')}`);
    log.log(`Configuration, WIDTH ${app.get(config_1.ConfigService).get('WIDTH')}`);
    log.log(`Configuration, HEIGHT ${app.get(config_1.ConfigService).get('HEIGHT')}`);
    log.log(`Configuration, MAXLIFE ${app.get(config_1.ConfigService).get('TURRETS')}`);
    await app.listen(app.get(config_1.ConfigService).get('PORT'));
}
bootstrap().then(r => console.log('waiting....'));
//# sourceMappingURL=main.js.map