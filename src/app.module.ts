import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameControllerGateway } from './game-controller/game-controller.gateway';
import { PlayersService } from './players/players.service';
import { ConfigModule } from '@nestjs/config';
import { TurretService } from './turret/turret.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, GameControllerGateway, PlayersService, TurretService],
})
export class AppModule {}
