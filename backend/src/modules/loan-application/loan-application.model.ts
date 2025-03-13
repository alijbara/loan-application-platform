import { model, Schema } from 'mongoose';
import { ILoanApplication } from './loan-application.interface';

const LoanApplicationSchema = new Schema<ILoanApplication>(
  {
    name: { type: String, required: true },
    loanAmount: { type: Number, required: true },
    convertedLoanAmount: { type: Object, required: true },
    loanTerm: { type: Number, required: true },
    currency: { type: String, required: true },
    submissionDate: { type: Date, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Enable virtual `id` field
LoanApplicationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure _id is not returned in the response
LoanApplicationSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export const LoanApplicationModel = model<ILoanApplication>(
  'LoanApplication',
  LoanApplicationSchema,
);
