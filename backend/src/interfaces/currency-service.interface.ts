import { Currency } from '../enums/currency.enum';

export interface ICurrencyService {
  convertAmount(amount: number, fromCurrency: Currency, toCurrency: Currency): Promise<number>;
}
