import { Entity, model, property } from '@loopback/repository';
import { CacheObject } from './cache-object.model';

@model()
export class CacheObjectList extends Entity {
  @property.array(CacheObject)
  objects: CacheObject[]
  constructor(data?: Partial<CacheObjectList>) {
    super(data);
  }
}
