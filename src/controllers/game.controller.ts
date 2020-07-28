import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository';
import { del, get, getModelSchemaRef, param, patch, post, put, requestBody } from '@loopback/rest';
import { Game, GameType } from '../models';
import { GameRepository } from '../repositories';
import { GamesFeedApi } from '../service/game-feed-api.service';

import { GAME_FEED_SERVICE } from '../bindings';
import { inject } from '@loopback/context';

export class GameController {
  constructor(
    @repository(GameRepository)
    public gameRepository: GameRepository,
    @inject(GAME_FEED_SERVICE)
    public gamesFeedApi: GamesFeedApi,
  ) {
  }

  @post('/ios-charts-game', {
    responses: {
      '200': {
        description: 'Game model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Game) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Game, {
            title: 'NewGame',
            exclude: ['id'],
          }),
        },
      },
    })
      game: Omit<Game, 'id'>,
  ): Promise<Game> {
    return this.gameRepository.create(game);
  }

  @get('/ios-charts-game/count', {
    responses: {
      '200': {
        description: 'Game model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(@param.where(Game) where?: Where<Game>): Promise<Count> {
    return this.gameRepository.count(where);
  }

  @get('/ios-charts-game', {
    responses: {
      '200': {
        description: 'Array of Game model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Game, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Game) filter?: Filter<Game>): Promise<Game[]> {
    await this.gamesFeedApi.updateGamesFromUrl(
      'https://rss.itunes.apple.com/api/v1/us/ios-apps/top-free/games/100/explicit.json');
    return this.gameRepository.find(filter);
  }

  @patch('/ios-charts-game', {
    responses: {
      '200': {
        description: 'Game PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Game, { partial: true }),
        },
      },
    })
      game: Game,
    @param.where(Game) where?: Where<Game>,
  ): Promise<Count> {
    return this.gameRepository.updateAll(game, where);
  }

  @get('/ios-charts-game/{id}', {
    responses: {
      '200': {
        description: 'Game model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Game, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Game, { exclude: 'where' })
      filter?: FilterExcludingWhere<Game>,
  ): Promise<Game> {
    return this.gameRepository.findById(id, filter);
  }

  @patch('/ios-charts-game/{id}', {
    responses: {
      '204': {
        description: 'Game PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Game, { partial: true }),
        },
      },
    })
      game: Game,
  ): Promise<void> {
    await this.gameRepository.updateById(id, game);
  }

  @put('/ios-charts-game/{id}', {
    responses: {
      '204': {
        description: 'Game PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() game: Game,
  ): Promise<void> {
    await this.gameRepository.replaceById(id, game);
  }

  @del('/ios-charts-game/{id}', {
    responses: {
      '204': {
        description: 'Game DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.gameRepository.deleteById(id);
  }

  @get('/ios/charts/game/free', {
    responses: {
      '200': {
        description: 'Game model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async getFreeGames(@param.where(Game) where?: Where<Game>,
                     @param.query.number('limit') limit = 100 ): Promise<Array<Game>> {
    return this.gameRepository.find({where: {gameType: GameType.FREE}, limit: limit });
  }

  @get('/ios/charts/game/paid', {
    responses: {
      '200': {
        description: 'Game model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async getPaidGames(@param.where(Game) where?: Where<Game>,
                     @param.query.number('limit') limit = 100 ): Promise<Array<Game>> {
    return this.gameRepository.find({where: {gameType: GameType.PAID}, limit: limit });
  }

  @get('/ios/charts/game/grossing', {
    responses: {
      '200': {
        description: 'Game model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async getGrossingGames(@param.where(Game) where?: Where<Game>,
                     @param.query.number('limit') limit = 100 ): Promise<Array<Game>> {
    return this.gameRepository.find({where: {gameType: GameType.GROSSING}, limit: limit });
  }
}