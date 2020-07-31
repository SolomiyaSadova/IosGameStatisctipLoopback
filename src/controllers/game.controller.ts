import { CountSchema, Where } from '@loopback/repository';
import { get, param } from '@loopback/rest';
import { Game, GameType } from '../models';

import { FETCHING_GAMES_SERVICE, GAME_SERVICE_API } from '../bindings';
import { inject } from '@loopback/context';
import { FetchingGameService } from '../service/fetching-game-service';
import { GameServiceClientApi } from '../service/game-service-client-api';

const VERSION_1 = '/v1';
const VERSION_2 = '/v2';
const GAME_PATH = '/ios/charts/game';
const GAME_PATH_V1 = `${VERSION_1}/${GAME_PATH}`;
const GAME_PATH_V2 = `${VERSION_2}/${GAME_PATH}`;

export class GameController {
  constructor(
    @inject(FETCHING_GAMES_SERVICE)
    public fetchingGameService: FetchingGameService,
    @inject(GAME_SERVICE_API)
    public gameServiceApi: GameServiceClientApi,
  ) {
  }

  @get(GAME_PATH_V2, {
    responses: {
      '200': {
        description: 'Get all games',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async getAllGamesFromKotlinService(@param.where(Game) where?: Where<Game>,
                                     @param.query.number('limit') limit = 100) {
    return this.gameServiceApi.getAllGames(limit);
  }

  @get(`${GAME_PATH_V2}/paid`, {
    responses: {
      '200': {
        description: 'Get all paid games',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async getPaidGamesFromKotlinService(@param.where(Game) where?: Where<Game>,
                                      @param.query.number('limit') limit = 100) {
    return this.gameServiceApi.getGamesByType('paid', limit);
  }

  @get(`${GAME_PATH_V2}/free`, {
    responses: {
      '200': {
        description: 'Get all free games',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async getFreeGamesFromKotlinService(@param.where(Game) where?: Where<Game>,
                                      @param.query.number('limit') limit = 100) {
    return this.gameServiceApi.getGamesByType('free', limit);
  }

  @get(`${GAME_PATH_V2}/grossing`, {
    responses: {
      '200': {
        description: 'Get all grossing games',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async getGrossingGamesFromKotlinService(@param.where(Game) where?: Where<Game>,
                                          @param.query.number('limit') limit = 100) {
    return this.gameServiceApi.getGamesByType('grossing', limit);
  }


  @get(GAME_PATH_V1, {
    responses: {
      '200': {
        description: 'Get game all games',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async getAllGames(@param.where(Game) where?: Where<Game>): Promise<Array<Game>> {
    return this.fetchingGameService.getAllGames();
  }

  @get(`${GAME_PATH_V1}/free`, {
    responses: {
      '200': {
        description: 'Get game of type FREE',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async getFreeGames(@param.where(Game) where?: Where<Game>,
                     @param.query.number('limit') limit = 100): Promise<Array<Game>> {
    return this.fetchingGameService.getGamesByType(GameType.FREE, limit);
  }

  @get(`${GAME_PATH_V1}/paid`, {
    responses: {
      '200': {
        description: 'Get game of type PAID',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async getPaidGames(@param.where(Game) where?: Where<Game>,
                     @param.query.number('limit') limit = 100): Promise<Array<Game>> {
    return this.fetchingGameService.getGamesByType(GameType.PAID, limit);
  }

  @get(`${GAME_PATH_V1}/grossing`, {
    responses: {
      '200': {
        description: 'Get game of type GROSSING',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async getGrossingGames(@param.where(Game) where?: Where<Game>,
                         @param.query.number('limit') limit = 100): Promise<Array<Game>> {
    return this.fetchingGameService.getGamesByType(GameType.GROSSING, limit);
  }
}