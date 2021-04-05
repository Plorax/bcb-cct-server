import { HttpService, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TickerItem } from './t-responses';


@Injectable()
export class TickerService {
  apiKey = 'bd9cc48d14fc35225ce92b2c1a61785ef51209e6fdd41f995962727134371067';
  tickers: {[id: string]: TickerItem} = {};
  exchanges: string[] = [];
  webws: any;

  constructor(private http: HttpService) {
    const WebSocket = require('ws');
    const webws = new WebSocket('wss://streamer.cryptocompare.com/v2?api_key=' + this.apiKey);
    const tickers = this.tickers;
    const exchanges = this.exchanges;

    this.webws = webws;

    this.webws.on('open', function open() {
        var subRequest = {
            "action": "SubAdd",
            "subs": ["2~Coinbase~BTC~USD"]
        };
        webws.send(JSON.stringify(subRequest));
    });

    this.webws.on('message', function incoming(data) {
        // console.log(data);
        const vdata = JSON.parse(data);

        if (vdata['TYPE'] == 2 && Object.keys(vdata).indexOf('PRICE') > -1) {

          const exchange = vdata['MARKET'];
          const fromSymbol = vdata['FROMSYMBOL'];
          const toSymbol = vdata['TOSYMBOL'];
          const price = vdata['PRICE'];

          if (exchanges.indexOf(exchange) == -1) {
            console.log('adding exchange ' + exchange);
            exchanges.push(exchange);
          }

          console.log(' .. received ' + exchange + ':' + fromSymbol + ':' + toSymbol + '=' + price);
          tickers[exchange+':'+fromSymbol+':'+toSymbol] = new TickerItem(fromSymbol, toSymbol, price);
        }
    });
  }

  subscribeTo(exchange: string, ticker: string, pairs: string): void {

    const webws = this.webws;
    const tickers = this.tickers;
    const exchanges = this.exchanges;

    pairs.split(',').forEach((pair) => {
      if (Object.keys(this.tickers).indexOf(exchange+':'+':'+ticker+':'+pair) > -1) {
        return;
      }
      var subRequest = {
          "action": "SubAdd",
          "subs": ["2~"+exchange+"~"+ticker+"~"+pair]
      };
      webws.send(JSON.stringify(subRequest));
      if (exchanges.indexOf(exchange) == -1) {
        console.log('adding exchange ' + exchange);
        exchanges.push(exchange);
      }
      tickers[exchange+':'+ticker+':'+pair] = new TickerItem(ticker, pair, '');
    });
  }

  async getValueOf(exchange: string, ticker: string, conversions: string): Promise<TickerItem[]> {

    const tickerItems = conversions.split(',').map((conversion) => {
      if (Object.keys(this.tickers).indexOf(exchange+':'+ticker+':'+conversion) > -1) {
        return this.tickers[exchange+':'+ticker+':'+conversion];
      }
    });

    return tickerItems.filter((e) => e != null);
  }

  async getExchanges(): Promise<string[]> {
    return this.exchanges;
  }
}
