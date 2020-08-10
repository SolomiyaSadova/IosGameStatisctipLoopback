import { DefaultKeyValueRepository, juggler } from '@loopback/repository';
import { inject } from '@loopback/core';
import { CacheObjectList } from '../models/cache-object-list.model';

export class CacheObjectListRepository extends DefaultKeyValueRepository<CacheObjectList> {
  constructor(
    @inject('datasources.redis') dataSource: juggler.DataSource,
  ) {
    super(CacheObjectList, dataSource);
  }
}