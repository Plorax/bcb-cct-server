import { Controller, Get, Param, Post, Put, Query, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { TickerItem } from './t-responses';
import { TickerService } from './ticker.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly tickerService: TickerService,
  ) {}

  @Post('/subscribeToTicker')
  async subscribeTo(@Body() data: {exchange: string, ticker: string, pairs: string}) {
    this.tickerService.subscribeTo(data.exchange, data.ticker, data.pairs);
  }

  @Get('/getExchanges')
  async getExchangesList(): Promise<string[]> {
    return this.tickerService.getExchanges();
  }

  @Get('/getTickerCurrencyPairValue')
  async getTickerCurrencyPairValue(@Query('exchange') exchange: string, @Query('ticker') ticker: string, @Query('pairs') pairs: string): Promise<TickerItem[]> {
    return this.tickerService.getValueOf(exchange, ticker, pairs);
  }
}
