import { inject, injectable } from 'inversify';
import { IApiService } from '../../interfaces/api-service.interface';
import { ICacheService } from '../../interfaces/cache-service.interface';
import { ICurrencyService } from '../../interfaces/currency-service.interface';
import { IApiServiceToken, ICacheServiceToken } from '../../di/tokens';
import { AxiosError, isAxiosError } from 'axios';

@injectable()
export class CurrencyService implements ICurrencyService {
  private _apiService: IApiService;
  private _cacheService: ICacheService;
  private _apiKey: string;
  private _baseUrl: string;
  private _exchangeUri: string;
  private _exchangeTtl: number;
  private _currenciesUri: string;
  private _currenciesTtl: number;

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
    // set Exchange URI
    const exchangeUri = process.env.CURRENCY_API_EXCHANGE_URI;
    if (!exchangeUri)
      throw new Error('No Currency API Exchange URI was provided in environment variables');
    this._exchangeUri = exchangeUri;
    // set Currencies URI
    const currenciesUri = process.env.CURRENCY_API_CURRENCIES_URI;
    if (!currenciesUri)
      throw new Error('No Currency API Currencies URI was provided in environment variables');
    this._currenciesUri = currenciesUri;
    // set exchange ttl
    const exchangeTtl = process.env.CURRENCY_API_EXCHANGE_CACHE_TTL;
    this._exchangeTtl = parseInt(exchangeTtl || '3600');
    // set currencies ttl
    const currenciesTtl = process.env.CURRENCY_API_CURRENCIES_CACHE_TTL;
    this._currenciesTtl = parseInt(currenciesTtl || '3600');
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
    fromCurrency: string,
    toCurrency: string,
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
    await this._cacheService.set(cacheKey, exchangeRate.toString(), this._exchangeTtl);

    // Return the converted amount
    return amount * exchangeRate;
  }

  /**
   * Returns a list of all supported currencies.
   * @returns List of currencies.
   */
  public async getCurrencies(): Promise<string[]> {
    const cacheKey = 'currency_list';

    // Check if the currency list is cached
    const cachedCurrencyList = await this._cacheService.get(cacheKey);
    if (cachedCurrencyList) {
      const deserializedCurrencyList = JSON.parse(cachedCurrencyList);
      if (deserializedCurrencyList && Array.isArray(deserializedCurrencyList)) {
        return deserializedCurrencyList;
      }
    }

    // Fetch the currency list from the API if not cached
    const currencyList = await this.fetchCurrencyList();

    // Cache the currency list
    await this._cacheService.set(cacheKey, JSON.stringify(currencyList), this._currenciesTtl);

    // Return the currency list
    return currencyList;
  }

  /**
   * Fetch the exchange rate from the CurrencyAPI.
   * @param fromCurrency - The source currency.
   * @param toCurrency - The target currency.
   * @returns The exchange rate.
   */
  private async fetchExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
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
      console.error(`Failed to fetch exchange rate from "${fromCurrency}" to "${toCurrency}"`);
      throw error;
    }
  }

  /**
   * Fetches the list of supported currencies from the CurrencyAPI.
   * @returns List of currencies.
   */
  private async fetchCurrencyList(): Promise<string[]> {
    const url = `${this._baseUrl}${this._currenciesUri}?apikey=${this._apiKey}`;
    try {
      const response = await this._apiService.get<{
        data: Record<string, any>;
      }>(url);
      if (!response?.data) {
        throw new Error('Invalid response from CurrencyAPI when requesting supported currencies.');
      }
      return Object.keys(response.data);
    } catch (error: any) {
      console.error('Failed to fetch currency list');
      throw error;
    }
  }
}
