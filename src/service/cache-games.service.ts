import { CacheObject, Game } from '../models';
import { inject } from '@loopback/core';
import { CACHE_SERVICE, GAME_SERVICE_API } from '../bindings';
import { CacheObjectsService } from './cache-objects.service';
import { GameServiceClientApi } from './game-service-client-api';
import * as config from '../config/config.json';
import { repository } from '@loopback/repository';
import { CacheObjectListRepository } from '../repositories/cache-object-list.repository';

const GAME_CACHE_OPTIONS = {
  ttl: parseInt(config.GAME_CACHE_TTL),
};

export class CacheGamesService {

  constructor(
    @repository(CacheObjectListRepository)
    public cacheObjectListRepository: CacheObjectListRepository,
    @inject(GAME_SERVICE_API)
    public gameServiceClientApi: GameServiceClientApi,
    @inject(CACHE_SERVICE)
    public cache: CacheObjectsService,
  ) {
  }

  async getCachedGames(gameType: string): Promise<Game[]> {
    const cacheObjectList = await this.cache.get(`${gameType}-${config.GAME_CACHE_KEY}`);
    if (cacheObjectList) {
      return cacheObjectList.objects.map(object => new Game(object));
    }
    return [];
  }

  async getAllCachedGames(): Promise<Game[]> {
    const paid = await this.cacheObjectListRepository.get(`paid-${config.GAME_CACHE_KEY}`);
    const free = await this.cacheObjectListRepository.get(`free-${config.GAME_CACHE_KEY}`);
    const grossing = await this.cacheObjectListRepository.get(`grossing-${config.GAME_CACHE_KEY}`);

    return [
      ...paid.objects.map(object => new Game(object)),
      ...free.objects.map(object => new Game(object)),
      ...grossing.objects.map(object => new Game(object)),
    ];

  }

  cacheGames(gameType: string, games: Game[]): Promise<void> {
    const objects = games.map(CacheObject.fromData);
    return this.cache.set(`${gameType}-${config.GAME_CACHE_KEY}`, objects, GAME_CACHE_OPTIONS);
  }

  async deleteCachedGames(gameType: string): Promise<void> {
    await this.cacheObjectListRepository.delete(`${gameType}-${config.GAME_CACHE_KEY}`);
  }
}