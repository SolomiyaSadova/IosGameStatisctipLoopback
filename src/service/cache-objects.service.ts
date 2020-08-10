import { Options, repository } from '@loopback/repository';
import { CacheObject } from '../models';
import { CacheObjectListRepository } from '../repositories/cache-object-list.repository';
import { CacheObjectList } from '../models/cache-object-list.model';


export class CacheObjectsService {
  constructor(
    @repository(CacheObjectListRepository)
    public cacheObjectListRepository: CacheObjectListRepository,
  ) {
  }

  async set(key: string, objects: CacheObject[], options?: Options): Promise<void> {
    await this.cacheObjectListRepository.set(key, new CacheObjectList({ objects }), options);
  }

  async get(key: string, options?: Options): Promise<CacheObjectList> {
    return this.cacheObjectListRepository.get(key, options);
  }
}