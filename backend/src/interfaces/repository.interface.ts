import { IQueryOptions } from './query-options.interface';

export interface IRepository<T extends Record<string, any>> {
  save(loan: T): Promise<T>;
  findAll(queryOptions?: IQueryOptions<T>): Promise<T[]>;
}
