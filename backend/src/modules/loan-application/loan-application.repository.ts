import { Model } from 'mongoose';
import { ILoanApplication } from './loan-application.interface';

import { BaseEntityRepository } from '../base-entity/base-entity.repository';
import { inject, injectable } from 'inversify';
import { LoanApplicationModelToken } from '../../di/tokens';

@injectable()
export class LoanApplicationRepository extends BaseEntityRepository<ILoanApplication> {
  constructor(@inject(LoanApplicationModelToken) model: Model<ILoanApplication>) {
    super(model);
  }
}
