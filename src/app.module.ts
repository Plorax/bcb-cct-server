import { TickerService } from './ticker.service';
import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [TickerService, AppService],
})
export class AppModule {}
