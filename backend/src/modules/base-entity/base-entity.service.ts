import { IQueryOptions } from '../../interfaces/query-options.interface';
import { IRepository } from '../../interfaces/repository.interface';
import { IEntityService } from './entity-service.interface';
import { IBaseEntity } from './base-entity.interface';

export abstract class BaseEntityService<T extends IBaseEntity> implements IEntityService<T> {
  protected repository: IRepository<T>;

  constructor(repository: IRepository<T>) {
    this.repository = repository;
  }

  protected abstract createEntityFromDTO(dto: Partial<T>): Promise<T>;

  public async insertOne(dto: Partial<T>): Promise<T> {
    //TODO:: Validation
    const entity = await this.createEntityFromDTO(dto);
    return await this.repository.insertOne(entity);
  }

  public async findAll(queryOptions?: IQueryOptions<T>): Promise<T[]> {
    return await this.repository.findAll(queryOptions);
  }
}
