import { ISortOptions } from './sort-options.interface';

export interface IQueryOptions<T extends Record<string, any>> {
  sort?: ISortOptions<T>;
  skip?: number;
  take?: number;
}
