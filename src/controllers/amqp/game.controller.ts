import { CountSchema, Where } from '@loopback/repository';
import { get, param } from '@loopback/rest';
import { Game } from '../../models';

import { MESSAGE_BROKER_SERVICE } from '../../bindings';
import { inject } from '@loopback/context';
import { MessageBrokerService } from '../../service/message-broker.service';
import * as config from '../../config/config.json';

const VERSION_1 = '/v1';
const GAME_PATH = '/ios/charts/game/sse';
const GAME_PATH_V1 = `${VERSION_1}/${GAME_PATH}`;
const options = {
  persistent: true,
  noAck: false,
  timestamp: Date.now(),
  contentEncoding: 'utf-8',
};

export class AmqpController {
  constructor(
    @inject(MESSAGE_BROKER_SERVICE)
    public messageBrokerService: MessageBrokerService,
  ) {
  }

  @get(GAME_PATH_V1, {
    responses: {
      '200': {
        description: 'Get all games',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async getAllGamesFromQueue(@param.where(Game) where?: Where<Game>,
                             @param.query.number('limit') limit = 100) {
    const message = AmqpController.createMessageForRequestQueue(limit);
    await this.messageBrokerService.publishToQueue(config.QUEUES.ALL_GAMES.ALL_GAME_QUEUE_REQUEST, message, options);
  }


  @get(`${GAME_PATH_V1}/paid`, {
    responses: {
      '200': {
        description: 'Get all paid games',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async getPaidGamesFromKotlinService(@param.where(Game) where?: Where<Game>,
                                      @param.query.number('limit') limit = 100) {
    const message = AmqpController.createMessageForRequestQueue(limit);
    await this.messageBrokerService.publishToQueue(config.QUEUES.PAID_GAMES.PAID_GAME_QUEUE_REQUEST,
      message, options);

  }

  @get(`${GAME_PATH_V1}/free`, {
    responses: {
      '200': {
        description: 'Get all free games',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async getFreeGamesFromKotlinService(@param.where(Game) where?: Where<Game>,
                                      @param.query.number('limit') limit = 100) {
    const message = AmqpController.createMessageForRequestQueue(limit);
    await this.messageBrokerService.publishToQueue(config.QUEUES.FREE_GAMES.FREE_GAME_QUEUE_REQUEST,
      message, options);

  }

  @get(`${GAME_PATH_V1}/grossing`, {
    responses: {
      '200': {
        description: 'Get all grossing games',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async getGrossingGamesFromKotlinService(@param.where(Game) where?: Where<Game>,
                                          @param.query.number('limit') limit = 100) {
    const message = AmqpController.createMessageForRequestQueue(limit);
    await this.messageBrokerService.publishToQueue(config.QUEUES.GROSSING_GAMES.GROSSING_GAME_QUEUE_REQUEST,
      message, options);
  }


  private static createMessageForRequestQueue(limit: number): string {
    return `{"limit":${limit}}`;
  }
}