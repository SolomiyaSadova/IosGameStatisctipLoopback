import { Options, repository } from '@loopback/repository';
import { CacheObject, Game, GameType } from '../models';
import * as config from '../config/config.json';
import { logger } from '../logger-config';
import { CacheObjectListRepository } from '../repositories/cache-object-list.repository';
import { CacheObjectList } from '../models/cache-object-list.model';

const OPTIONS = {
  ttl: 9000000,
};

export class CacheObjectService {
  constructor(
    @repository(CacheObjectListRepository)
    public cacheObjectListRepository: CacheObjectListRepository,
  ) {
  }

  async set(key: string, value: CacheObjectList, options?: Options): Promise<void> {
    await this.cacheObjectListRepository.set(key, value, OPTIONS);
  }

  async get(key: string, options?: Options): Promise<CacheObjectList> {
   return this.cacheObjectListRepository.get(key, options);
  }

  async deleteAllGames(key: string) {
    await this.cacheObjectListRepository.delete(`paid-${key}`);
    await this.cacheObjectListRepository.delete(`free-${key}`);
    await this.cacheObjectListRepository.delete(`grossing-${key}`);
  }

  async saveGamesInCacheByType(fetchedGames: Game[]): Promise<void> {
    const paidGames: CacheObject[] = [];
    const freeGames: CacheObject[] = [];
    const grossingGames: CacheObject[] = [];
    for (const fetchedGame of fetchedGames) {
      switch (fetchedGame.gameType) {
        case GameType.PAID:
          paidGames.push(CacheObject.fromData(fetchedGame));
          break;
        case GameType.FREE:
          freeGames.push(CacheObject.fromData(fetchedGame));
          break;
        case GameType.GROSSING:
          grossingGames.push(CacheObject.fromData(fetchedGame));
          break;
        default:
          logger.warn('Unknown game type');
      }
    }
    if (freeGames?.length) {
      const gameObjectList = new CacheObjectList({ objects: freeGames });
      await this.cacheObjectListRepository
        .set(`free-${config.GAME_CACHE_KEY}`, gameObjectList, OPTIONS);
    }
    if (paidGames?.length) {
      const gameObjectList = new CacheObjectList({ objects: paidGames });
      await this.cacheObjectListRepository
        .set(`paid-${config.GAME_CACHE_KEY}`, gameObjectList, OPTIONS);
    }
    if (grossingGames?.length) {
      const gameObjectList = new CacheObjectList({ objects: grossingGames });
      await this.cacheObjectListRepository
        .set(`grossing-${config.GAME_CACHE_KEY}`, gameObjectList, OPTIONS);
    }
  }

}