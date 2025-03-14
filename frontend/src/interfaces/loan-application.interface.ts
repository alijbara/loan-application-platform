export interface ILoanApplication {
  id: string;
  name: string;
  loanAmount: number;
  convertedLoanAmount: Record<string, number>;
  loanTerm: number;
  currency: string;
  submissionDate: Date;
}
