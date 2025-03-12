import { inject, injectable } from 'inversify';
import { Currency } from '../../enums/currency.enum';
import { ICurrencyService } from '../../interfaces/currency-service.interface';
import { IRepository } from '../../interfaces/repository.interface';
import { BaseEntityService } from '../base-entity/base-entity.service';
import { ILoanApplicationDTO } from './loan-application-dto.type';
import { ILoanApplication } from './loan-application.interface';
import { CurrencyServiceToken } from '../../di/tokens';
import { LoanApplicationRepository } from './loan-application.repository';

@injectable()
export class LoanApplicationService extends BaseEntityService<ILoanApplication> {
  private _currencyService: ICurrencyService;

  constructor(
    @inject(LoanApplicationRepository) repository: IRepository<ILoanApplication>,
    @inject(CurrencyServiceToken) currencyService: ICurrencyService,
  ) {
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
