import { Currency } from '../enums/currency.enum';
import type { AtLeastOne } from './at-least-one.type';

export type ConvertedLoanAmount = AtLeastOne<{ [K in Currency]: number }>;
