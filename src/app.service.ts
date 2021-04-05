import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  valueOf(): Array<string> {
    return ['BTC', 'ETH', 'XRP', 'LTC', 'BCH', 'ETC'];
  }

  valueIn(): Array<string> {
    return ['USD', 'EUR', 'GBP', 'JPY', 'ZAR'];
  }
}
