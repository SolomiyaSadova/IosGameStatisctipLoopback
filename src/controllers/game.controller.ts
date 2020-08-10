import { CountSchema, Where } from '@loopback/repository';
import { get, param } from '@loopback/rest';
import { Game } from '../models';

import { GAMES_FACADE } from '../bindings';
import { inject } from '@loopback/context';
import { GamesFacade } from '../service/games.facade';

const VERSION_2 = '/v2';
const GAME_PATH = '/ios/charts/game';
const GAME_PATH_V2 = `${VERSION_2}/${GAME_PATH}`;

export class GameController {
  constructor(
    @inject(GAMES_FACADE)
    public gamesFacade: GamesFacade,
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
  async getAllGamesFromService(@param.where(Game) where?: Where<Game>,
                               @param.query.number('limit') limit = 300) {
    return this.gamesFacade.getAllGames(limit);
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
    return this.gamesFacade.getPaidGames(limit);
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
    return this.gamesFacade.getFreeGames(limit);
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
    return this.gamesFacade.getGrossingGames(limit);
  }

}