import { Model } from 'mongoose';
import { IRepository } from '../../interfaces/repository.interface';
import { IBaseEntity } from './base-entity.interface';
import { IQueryOptions } from '../../interfaces/query-options.interface';
import { DocsWithType } from '../../types/docs-with-total.type';

export class BaseEntityRepository<T extends IBaseEntity> implements IRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public async insertOne(entity: T): Promise<T> {
    const newLoanApplication = new this.model(entity);
    return await newLoanApplication.save();
  }

  public async findAll(queryOptions?: IQueryOptions<T>): Promise<DocsWithType<T>> {
    let sortQuery: any = {};

    if (queryOptions?.sort) {
      const { field, order } = queryOptions.sort;
      sortQuery[field] = order === 'asc' ? 1 : -1; // 1 for ascending, -1 for descending
    }

    const query = this.model.find().sort(sortQuery);

    if (queryOptions?.skip !== undefined) query.skip(queryOptions?.skip);
    if (queryOptions?.take !== undefined) query.limit(queryOptions?.take);

    const total = await this.model.countDocuments();
    const data = await query.exec();
    return { docs: data, total };
  }
}
