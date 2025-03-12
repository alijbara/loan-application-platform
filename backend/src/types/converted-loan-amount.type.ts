import { Currency } from '../enums/currency.enum';
import { AtLeastOne } from './at-least-one.type';

export type ConvertedLoanAmount = AtLeastOne<{ [K in Currency]: number }>;
