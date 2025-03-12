import { Currency } from '../../enums/currency.enum';
import { ConvertedLoanAmount } from '../../types/converted-loan-amount.type';
import { IBaseEntity } from '../base-entity/base-entity.interface';

export interface ILoanApplication extends IBaseEntity {
  name: string;
  loanAmount: number;
  convertedLoanAmount: ConvertedLoanAmount;
  loanTerm: number;
  currency: Currency;
  submissionDate: Date;
}
