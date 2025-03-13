import { DocsWithType } from '../types/docs-with-total.type';
import { IQueryOptions } from './query-options.interface';

export interface IRepository<T extends Record<string, any>> {
  insertOne(loan: T): Promise<T>;
  findAll(queryOptions?: IQueryOptions<T>): Promise<DocsWithType<T>>;
}
