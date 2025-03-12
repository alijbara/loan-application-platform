import { Model } from 'mongoose';
import { ILoanApplication } from './loan-application.interface';

import { BaseEntityRepository } from '../base-entity/base-entity.repository';

export class LoanApplicationRepository extends BaseEntityRepository<ILoanApplication> {
  constructor(model: Model<ILoanApplication>) {
    super(model);
  }
}
