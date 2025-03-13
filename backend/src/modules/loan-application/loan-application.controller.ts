import { Request, Response } from 'express';
import { BaseEntityController } from '../base-entity/base-entity.controller';
import { ILoanApplication } from './loan-application.interface';
import { IEntityService } from '../base-entity/entity-service.interface';
import { inject, injectable } from 'inversify';
import { LoanApplicationServiceToken } from '../../di/tokens';

@injectable()
export class LoanApplicationController extends BaseEntityController<ILoanApplication> {
  protected readonly sortableFields: Array<keyof ILoanApplication> = [
    'loanAmount',
    'loanTerm',
    'submissionDate',
  ];

  constructor(
    @inject(LoanApplicationServiceToken) entityService: IEntityService<ILoanApplication>,
  ) {
    super(entityService);
  }

  public async insertOne(req: Request, res: Response) {
    const { name, loanAmount, loanTerm, currency } = req.body;

    try {
      const loanApplication = { name, loanAmount, loanTerm, currency };
      const savedLoanApplication = await this.entityService.insertOne(loanApplication);
      res.status(201).json(savedLoanApplication);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to save loan application' });
    }
  }

  public async findAll(req: Request, res: Response) {
    const queryOptions = this.getQueryOptions(req);

    try {
      const result = await this.entityService.findAll(queryOptions);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch loan applications' });
    }
  }
}
