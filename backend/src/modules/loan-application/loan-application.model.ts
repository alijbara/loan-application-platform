import { model, Schema } from 'mongoose';
import { ILoanApplication } from './loan-application.interface';
import { BaseEntitySchema } from '../base-entity/base-entity.model';

const LoanApplicationSchema = new Schema<ILoanApplication>({
  name: { type: String, required: true },
  loanAmount: { type: Number, required: true },
  convertedLoanAmount: { type: Object, required: true },
  loanTerm: { type: Number, required: true },
  currency: { type: String, required: true },
  submissionDate: { type: Date, required: true },
});

const CombinedSchema = new Schema({
  ...BaseEntitySchema.obj,
  ...LoanApplicationSchema.obj,
});

export const LoanApplicationModel = model<ILoanApplication>('LoanApplication', CombinedSchema);
