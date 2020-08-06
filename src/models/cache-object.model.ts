import { Entity, model } from '@loopback/repository';

@model({ settings: { strict: false } })
export class CacheObject extends Entity {
  // Add an indexer property to allow additional data
  [key: string]: unknown;

  constructor(data?: Partial<CacheObject>) {
    super(data);
  }

  static fromData(data: object): CacheObject {
    const cacheObject = new CacheObject();
    Object.assign(cacheObject, data);
    return cacheObject;
  }
}
