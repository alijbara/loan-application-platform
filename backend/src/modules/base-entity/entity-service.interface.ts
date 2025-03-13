import { IQueryOptions } from '../../interfaces/query-options.interface';
import { DocsWithType } from '../../types/docs-with-total.type';
import { IBaseEntity } from './base-entity.interface';

export interface IEntityService<T extends IBaseEntity> {
  insertOne(dto: Partial<T>): Promise<T>;
  findAll(queryOptions?: IQueryOptions<T>): Promise<DocsWithType<T>>;
}
