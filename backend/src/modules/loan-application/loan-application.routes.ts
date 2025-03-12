import express from 'express';
import { container } from '../../di/container';
import { LoanApplicationController } from './loan-application.controller';
import { RouteUri } from '../../enums/route-uri.enum';

const loanApplicationRouter = express.Router();

// Resolve the controller from the DI container
const loanApplicationController = container.get(LoanApplicationController);

// Routes
loanApplicationRouter.post(RouteUri.LOAN_APPLICATIONS, (req, res) =>
  loanApplicationController.insertOne(req, res),
);
loanApplicationRouter.get(RouteUri.LOAN_APPLICATIONS, (req, res) =>
  loanApplicationController.findAll(req, res),
);

export { loanApplicationRouter };
