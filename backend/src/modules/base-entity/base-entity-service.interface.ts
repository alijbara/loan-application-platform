import { IQueryOptions } from '../../interfaces/query-options.interface';
import { IRepository } from '../../interfaces/repository.interface';
import { IBaseEntity } from './base-entity.interface';

export interface IBaseEntityService<T extends IBaseEntity> {
  save(dto: Partial<T>): Promise<T>;
  findAll(queryOptions?: IQueryOptions<T>): Promise<T[]>;
}
