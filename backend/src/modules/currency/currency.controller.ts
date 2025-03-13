import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ICurrencyService } from '../../interfaces/currency-service.interface';
import { CurrencyServiceToken } from '../../di/tokens';

@injectable()
export class CurrencyController {
  private _currencyService: ICurrencyService;

  constructor(@inject(CurrencyServiceToken) currencyService: ICurrencyService) {
    this._currencyService = currencyService;
  }

  public async findAll(req: Request, res: Response) {
    try {
      const result = await this._currencyService.getCurrencies();
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch currencies' });
    }
  }
}
