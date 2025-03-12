import { SortOrder } from 'mongoose';
import { IBaseEntity } from '../modules/base-entity/base-entity.interface';

export interface ISortOptions<T extends Record<string, any>> {
  field: keyof T;
  order: SortOrder;
}
