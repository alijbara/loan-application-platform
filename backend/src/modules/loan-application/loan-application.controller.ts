import { Request, Response } from 'express';
import { BaseEntityController } from '../base-entity/base-entity.controller';
import { ILoanApplication } from './loan-application.interface';
import { LoanApplicationService } from './loan-application.service';

export class LoanApplicationController extends BaseEntityController<ILoanApplication> {
  protected readonly sortableFields: Array<keyof ILoanApplication> = [
    'loanAmount',
    'loanTerm',
    'submissionDate',
  ];

  constructor(entityService: LoanApplicationService) {
    super(entityService);
  }

  public async save(req: Request, res: Response) {
    const { name, loanAmount, loanTerm, currency } = req.body;

    try {
      const loan = { name, loanAmount, loanTerm, currency };
      const savedLoan = await this.entityService.save(loan);
      res.status(201).json(savedLoan);
    } catch (error) {
      res.status(500).json({ error: 'Failed to save loan application' });
    }
  }

  public async getLoans(req: Request, res: Response) {
    const queryOptions = this.getQueryOptions(req);

    try {
      const loans = await this.entityService.findAll(queryOptions);
      res.status(200).json(loans);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch loans' });
    }
  }
}
