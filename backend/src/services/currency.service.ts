import { inject, injectable } from 'inversify';
import { Currency } from '../enums/currency.enum';
import { IApiService } from '../interfaces/api-service.interface';
import { ICacheService } from '../interfaces/cache-service.interface';
import { ICurrencyService } from '../interfaces/currency-service.interface';
import { IApiServiceToken, ICacheServiceToken } from '../di/tokens';

@injectable()
export class CurrencyService implements ICurrencyService {
  private _apiService: IApiService;
  private _cacheService: ICacheService;
  private _apiKey: string;
  private _baseUrl: string;
  private _exchangeUri: string;
  private _ttl: number;

  constructor(
    @inject(IApiServiceToken) apiService: IApiService,
    @inject(ICacheServiceToken) cacheService: ICacheService,
  ) {
    this._apiService = apiService;
    this._cacheService = cacheService;
    // set API Key
    const apiKey = process.env.CURRENCY_API_KEY;
    if (!apiKey) throw new Error('No Currency API key was provided in environment variables');
    this._apiKey = apiKey;
    // set Base URL
    const url = process.env.CURRENCY_API_BASE_URL;
    if (!url) throw new Error('No Currency API Base URL was provided in environment variables');
    this._baseUrl = url;
    // set Exchange URi
    const exchangeUri = process.env.CURRENCY_API_EXCHANGE_URI;
    if (!exchangeUri)
      throw new Error('No Currency API Exchange URI was provided in environment variables');
    this._exchangeUri = exchangeUri;
    // set ttl
    const ttl = process.env.CURRENCY_API_CACHE_TTL;
    this._ttl = parseInt(ttl || '3600');
  }

  /**
   * Convert an amount from one currency to another.
   * @param amount - The amount to convert.
   * @param fromCurrency - The source currency.
   * @param toCurrency - The target currency.
   * @returns The converted amount.
   */
  public async convertAmount(
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency,
  ): Promise<number> {
    // Generate a unique cache key for the currency pair
    const cacheKey = `exchange_rate_${fromCurrency}_${toCurrency}`;

    // Check if the exchange rate is cached
    const cachedRate = await this._cacheService.get(cacheKey);
    if (cachedRate) {
      return amount * parseFloat(cachedRate);
    }

    // Fetch the exchange rate from the API if not cached
    const exchangeRate = await this.fetchExchangeRate(fromCurrency, toCurrency);

    // Cache the exchange rate
    await this._cacheService.set(cacheKey, exchangeRate.toString(), this._ttl);

    // Return the converted amount
    return amount * exchangeRate;
  }

  /**
   * Fetch the exchange rate from the CurrencyAPI.
   * @param fromCurrency - The source currency.
   * @param toCurrency - The target currency.
   * @returns The exchange rate.
   */
  private async fetchExchangeRate(fromCurrency: Currency, toCurrency: Currency): Promise<number> {
    const url = `${this._baseUrl}${this._exchangeUri}?apikey=${this._apiKey}&base_currency=${fromCurrency}&currencies=${toCurrency}`;

    try {
      const response = await this._apiService.get<{
        data: Record<string, { code: string; value: number }>;
      }>(url);
      const rates = response.data;

      if (!rates[toCurrency]) {
        throw new Error(`Exchange rate for ${toCurrency} not found in API response`);
      }

      return rates[toCurrency].value;
    } catch (error: any) {
      throw new Error(`Failed to fetch exchange rate: ${error.message}`);
    }
  }
}
