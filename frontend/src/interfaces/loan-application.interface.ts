import type { ConvertedLoanAmount } from '@/types/converted-loan-amount.type';
import { Currency } from '../enums/currency.enum';

export interface ILoanApplication {
  id: string;
  name: string;
  loanAmount: number;
  convertedLoanAmount: ConvertedLoanAmount;
  loanTerm: number;
  currency: Currency;
  submissionDate: Date;
}
