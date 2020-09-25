import { CountSchema, Where } from '@loopback/repository';
import { get, param, RestBindings } from '@loopback/rest';
import { Game } from '../../models';

import { GAME_SERVICE_API, MESSAGE_BROKER_SERVICE } from '../../bindings';
import { inject } from '@loopback/context';
import { MessageBrokerService } from '../../service/message-broker.service';
import * as config from '../../config/config.json';
import { GameServiceClientApi } from '../../service/game-service-client-api';
import { ServerSentEvent } from '../../service/events/server-sent-events';
import { Response } from 'express';

const VERSION_1 = '/v1';
const GAME_PATH = '/ios/charts/game/sse';
const GAME_PATH_V1 = `${VERSION_1}${GAME_PATH}`;
const options = {
  persistent: true,
  noAck: false,
  timestamp: Date.now(),
  contentEncoding: 'utf-8',
};

export class GameEventController {
  constructor(
    @inject(MESSAGE_BROKER_SERVICE)
    public messageBrokerService: MessageBrokerService,
    @inject(GAME_SERVICE_API)
    public gameServiceApi: GameServiceClientApi,
    @inject(RestBindings.Http.RESPONSE)
    public response: Response,
  ) {
  }

  @get('v1/events', {
    responses: {
      '200': {
        description: 'Fetch events',
        content: {
          'text/event-stream': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async getAllGamesFromQueue(
    @param.where(Game) where?: Where<Game>,
    @param.query.number('limit') limit = 100): Promise<Response> {

    const games = await this.gameServiceApi.getAllGames(limit);
    this.response.setHeader('Connection', 'keep-alive');
    this.response.contentType('text/event-stream');

    for (const game of games) {
      const event = new ServerSentEvent({ event: 'all-games', data: JSON.stringify(game) });
      this.response.write(event.toEventMessage());
    }

    return this.response;
  }


}