import { DefaultKeyValueRepository, juggler } from '@loopback/repository';
import { inject } from '@loopback/core';
import { RedisDataSource } from '../datasources';
import { CacheObject } from '../models';

export class ObjectCacheRepository extends DefaultKeyValueRepository<CacheObject> {
  constructor(
    @inject('datasources.redis') dataSource: juggler.DataSource,
  ) {
    super(CacheObject, dataSource);
  }
}