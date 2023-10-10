import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('Configuration, TURRETS', app.get(ConfigService).get('TURRETS'));
  console.log('Configuration, WIDTH', app.get(ConfigService).get('WIDTH'));
  console.log('Configuration, HEIGHT', app.get(ConfigService).get('HEIGHT'));
  console.log('Configuration, MAXLIFE', app.get(ConfigService).get('MAXLIFE'));
  await app.listen(3000);
}
bootstrap();
