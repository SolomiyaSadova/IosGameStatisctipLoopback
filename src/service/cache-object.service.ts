import { Options, repository } from '@loopback/repository';
import { ObjectCacheRepository } from '../repositories';
import { CacheObject } from '../models';

export class CacheObjectService {
  constructor(
    @repository(ObjectCacheRepository)
    public cache: ObjectCacheRepository,
  ) {
  }

  async set(key: string, values: CacheObject[], options?: Options): Promise<void> {
    let counter = 0;
    const promises = values.map(value => {
      counter++;
      return this.cache.set(`${key}-${counter}`, value, options);
    });
    await Promise.all(promises);
  }

  async get(key: string, options?: Options): Promise<CacheObject[]> {
    const objectKeys = this.cache.keys({ match: `${key}-*` });
    const objectPromises = [];

    for await (const objectKey of objectKeys) {
      objectPromises.push(this.cache.get(objectKey, options));
    }

    return Promise.all(objectPromises);
  }

}