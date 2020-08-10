import { Game} from '../models';
import { inject } from '@loopback/context';
import { CACHE_GAMES_SERVICE, GAME_SERVICE_API } from '../bindings';
import { CacheGamesService } from './cache-games.service';
import { GameServiceClientApi } from './game-service-client-api';

const LIMIT = 100;

export class GamesFacade {

  constructor(
    @inject(CACHE_GAMES_SERVICE)
    public cacheService: CacheGamesService,
    @inject(GAME_SERVICE_API)
    public gameServiceClientApi: GameServiceClientApi,
  ) {
  }

  async getAllGames(limit: number): Promise<Game[]> {
    const cachedGames = await this.cacheService.getAllCachedGames();
    return cachedGames.slice(0, limit);
  }

  async getPaidGames(limit: number): Promise<Game[]> {
    return this.getGamesByType('paid', limit);
  }

  async getGrossingGames(limit: number): Promise<Game[]> {
    return this.getGamesByType('grossing', limit);
  }

  async getFreeGames(limit: number): Promise<Game[]> {
    return this.getGamesByType('free', limit);
  }

  async cacheAllGames() {
    const paidGames = await this.gameServiceClientApi.getGamesByType('paid', LIMIT);
    const freeGames = await this.gameServiceClientApi.getGamesByType('free', LIMIT);
    const grossingGames = await this.gameServiceClientApi.getGamesByType('grossing', LIMIT);
    await this.updateAndInvalidateCachedGames('paid', paidGames);
    await this.updateAndInvalidateCachedGames('free', freeGames);
    await this.updateAndInvalidateCachedGames('grossing', grossingGames);
  }

  private async getGamesByType(gameType: string, limit: number): Promise<Game[]> {
    const cachedGames = await this.cacheService.getCachedGames(gameType);
    return cachedGames.slice(0, limit);
  }

  private async updateAndInvalidateCachedGames(gameType: string, games: Game[]): Promise<void> {
    await this.deleteCachedGames([gameType]);

    return this.cacheService.cacheGames(gameType, games);
  }

  private async deleteCachedGames(gameTypes: string[]) {
    const deletePromises = gameTypes.map(type => this.cacheService.deleteCachedGames(type));

    await Promise.all(deletePromises);
  }
}