import { Request } from 'express';
import { IQueryOptions } from '../../interfaces/query-options.interface';
import { IBaseEntityService } from './base-entity-service.interface';
import { IBaseEntity } from './base-entity.interface';
import { SortOrder } from '../../enums/sort-order.enum';
import { isValidEnumValue } from '../../util/is-valid-enum-value';

export abstract class BaseEntityController<T extends IBaseEntity> {
  protected entityService: IBaseEntityService<T>;
  protected abstract readonly sortableFields: Array<keyof T>;

  constructor(entityService: IBaseEntityService<T>) {
    this.entityService = entityService;
  }

  protected getQueryOptions(req: Request): IQueryOptions<T> {
    const { sortBy, order, skip, take } = req.query;
    const queryOptions: IQueryOptions<T> = {};
    const sortField = this.sortableFields.find((f) => f == sortBy);
    if (sortField) {
      queryOptions.sort = {
        field: sortField,
        order: isValidEnumValue(SortOrder, order) ? order : SortOrder.DESC,
      };
    }
    queryOptions.skip = parseInt(skip as string) || undefined;
    queryOptions.take = parseInt(take as string) || undefined;

    return queryOptions;
  }
}
