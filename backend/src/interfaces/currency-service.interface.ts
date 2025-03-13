export interface ICurrencyService {
  convertAmount(amount: number, fromCurrency: string, toCurrency: string): Promise<number>;
  getCurrencies(): Promise<string[]>;
}
