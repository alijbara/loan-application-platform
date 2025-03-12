import { Currency } from '../../enums/currency.enum';
import { IBaseEntity } from '../base-entity/base-entity.interface';

export interface ILoanApplication extends IBaseEntity {
  name: string;
  loanAmount: number;
  loanAmountGBP: number;
  loanTerm: number;
  currency: Currency;
  submissionDate: Date;
}
