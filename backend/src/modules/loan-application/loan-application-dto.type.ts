import { ILoanApplication } from './loan-application.interface';

export type ILoanApplicationDTO = Pick<ILoanApplication, 'name' | 'loanAmount' | 'loanTerm' | 'currency'>;
