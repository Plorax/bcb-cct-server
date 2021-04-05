export class TickerItem {
  public ticker: string;
  public currency: string;
  public value: string;

  constructor(_ticker: string, _currency: string, _value: string) {
    this.ticker = _ticker;
    this.currency = _currency;
    this.value = _value;
  }
}
