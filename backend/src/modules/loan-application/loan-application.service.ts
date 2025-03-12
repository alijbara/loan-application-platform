import { Currency } from '../../enums/currency.enum';
import { ICurrencyService } from '../../interfaces/currency-service.interface';
import { BaseEntityService } from '../base-entity/base-entity.service';
import { ILoanApplicationDTO } from './loan-application-dto.type';
import { ILoanApplication } from './loan-application.interface';
import { LoanApplicationRepository } from './loan-application.repository';

export class LoanApplicationService extends BaseEntityService<ILoanApplication> {
  private _currencyService: ICurrencyService;

  constructor(repository: LoanApplicationRepository, currencyService: ICurrencyService) {
    super(repository);
    this._currencyService = currencyService;
  }

  protected async createEntityFromDTO(dto: ILoanApplicationDTO): Promise<ILoanApplication> {
    const loanAmountGBP = await this._currencyService.convertAmount(
      dto.loanAmount,
      dto.currency,
      Currency.GBP,
    );

    return {
      name: dto.name,
      loanAmount: dto.loanAmount,
      loanTerm: dto.loanTerm,
      currency: dto.currency,
      submissionDate: new Date(),
      loanAmountGBP,
    };
  }
}
