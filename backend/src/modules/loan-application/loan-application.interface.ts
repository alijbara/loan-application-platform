import { IBaseEntity } from '../base-entity/base-entity.interface';

export interface ILoanApplication extends IBaseEntity {
  name: string;
  loanAmount: number;
  convertedLoanAmount: Record<string, number>;
  loanTerm: number;
  currency: string;
  submissionDate: Date;
}
