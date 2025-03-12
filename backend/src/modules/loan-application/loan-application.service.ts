import { inject, injectable } from 'inversify';
import { Currency } from '../../enums/currency.enum';
import { ICurrencyService } from '../../interfaces/currency-service.interface';
import { IRepository } from '../../interfaces/repository.interface';
import { BaseEntityService } from '../base-entity/base-entity.service';
import { ILoanApplicationDTO } from './loan-application-dto.type';
import { ILoanApplication } from './loan-application.interface';
import { CurrencyServiceToken } from '../../di/tokens';
import { LoanApplicationRepository } from './loan-application.repository';
import { isValidEnumValue } from '../../util/is-valid-enum-value';
import { ConvertedLoanAmount } from '../../types/converted-loan-amount.type';

@injectable()
export class LoanApplicationService extends BaseEntityService<ILoanApplication> {
  private _currencyService: ICurrencyService;
  private _defaultExchangeCurrency: Currency;

  constructor(
    @inject(LoanApplicationRepository) repository: IRepository<ILoanApplication>,
    @inject(CurrencyServiceToken) currencyService: ICurrencyService,
  ) {
    super(repository);
    this._currencyService = currencyService;
    const exchangeCurrency = process.env.DEFUALT_EXCHANGE_CURRENCY;
    this._defaultExchangeCurrency = isValidEnumValue(Currency, exchangeCurrency)
      ? exchangeCurrency
      : Currency.GBP;
  }

  protected async createEntityFromDTO(dto: ILoanApplicationDTO): Promise<ILoanApplication> {
    const convertedAmount =
      dto.currency === this._defaultExchangeCurrency // If currency is the same as the default exchange currency, no need to convert
        ? dto.loanAmount // set from loanAmount
        : await this._currencyService.convertAmount(
            // else convert currency
            dto.loanAmount,
            dto.currency,
            this._defaultExchangeCurrency,
          );

    return {
      name: dto.name,
      loanAmount: dto.loanAmount,
      loanTerm: dto.loanTerm,
      currency: dto.currency,
      submissionDate: new Date(),
      convertedLoanAmount: {
        [this._defaultExchangeCurrency]: convertedAmount,
      } as ConvertedLoanAmount, // Type assertion here because TypeScript can't guarantee that the dynamic key is one of the valid Currency keys at compile time
    };
  }
}
