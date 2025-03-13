import { Container } from 'inversify';
import {
  CurrencyServiceToken,
  IApiServiceToken,
  ICacheServiceToken,
  LoanApplicationModelToken,
  LoanApplicationServiceToken,
} from './tokens';
import { LoanApplicationRepository } from '../modules/loan-application/loan-application.repository';
import { LoanApplicationModel } from '../modules/loan-application/loan-application.model';
import { ICurrencyService } from '../interfaces/currency-service.interface';
import { CurrencyService } from '../modules/currency/currency.service';
import { IEntityService } from '../modules/base-entity/entity-service.interface';
import { ILoanApplication } from '../modules/loan-application/loan-application.interface';
import { LoanApplicationService } from '../modules/loan-application/loan-application.service';
import { AxiosApiService } from '../services/axios-api.service';
import { IApiService } from '../interfaces/api-service.interface';
import { ICacheService } from '../interfaces/cache-service.interface';
import { RedisCacheService } from '../services/redis-cache.service';
import { LoanApplicationController } from '../modules/loan-application/loan-application.controller';
import { CurrencyController } from '../modules/currency/currency.controller';

const container = new Container();

// Bind models
container
  .bind<typeof LoanApplicationModel>(LoanApplicationModelToken)
  .toConstantValue(LoanApplicationModel);

// Bind repositories
container.bind(LoanApplicationRepository).toSelf().inSingletonScope();

// Bind currency services
container.bind<ICurrencyService>(CurrencyServiceToken).to(CurrencyService).inSingletonScope();

// Bind entity services
container
  .bind<IEntityService<ILoanApplication>>(LoanApplicationServiceToken)
  .to(LoanApplicationService)
  .inSingletonScope();

// Bind external services
container.bind<IApiService>(IApiServiceToken).to(AxiosApiService).inSingletonScope();
container.bind<ICacheService>(ICacheServiceToken).to(RedisCacheService).inSingletonScope();

// Bind controllers
container.bind(LoanApplicationController).toSelf().inRequestScope();
container.bind(CurrencyController).toSelf().inRequestScope();

export { container };
