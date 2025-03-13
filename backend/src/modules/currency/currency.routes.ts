import express from 'express';
import { container } from '../../di/container';
import { CurrencyController } from './currency.controller';
import { RouteUri } from '../../enums/route-uri.enum';

const currencyRouter = express.Router();

// Resolve the controller from the DI container
const currencyController = container.get(CurrencyController);

// Routes
currencyRouter.get(RouteUri.CURRENCIES, (req, res) => currencyController.findAll(req, res));

export { currencyRouter };
