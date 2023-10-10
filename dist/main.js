"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    console.log('Configuration, TURRETS', app.get(config_1.ConfigService).get('TURRETS'));
    console.log('Configuration, WIDTH', app.get(config_1.ConfigService).get('WIDTH'));
    console.log('Configuration, HEIGHT', app.get(config_1.ConfigService).get('HEIGHT'));
    console.log('Configuration, MAXLIFE', app.get(config_1.ConfigService).get('MAXLIFE'));
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map