import type { ILoanApplication } from '@/interfaces/loan-application.interface';

export type LoanApplicationSortableField = keyof Pick<ILoanApplication, 'loanAmount' | 'loanTerm' | 'submissionDate'>;
