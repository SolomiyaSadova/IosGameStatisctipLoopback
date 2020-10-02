import { get, RestBindings } from '@loopback/rest';

import { EVENT_STREAMER, GAME_SERVICE_API, MESSAGE_BROKER_SERVICE } from '../../bindings';
import { inject } from '@loopback/context';
import { MessageBrokerService } from '../../service/message-broker.service';
import { GameServiceClientApi } from '../../service/game-service-client-api';
import { Response } from 'express';
import { EventStreamer } from '../../service/events/event-streamer';
import { ServerSentEvent } from '../../service/events/server-sent-events';


export class NewTopGamesStreamerController {
  constructor(
    @inject(MESSAGE_BROKER_SERVICE)
    public messageBrokerService: MessageBrokerService,
    @inject(GAME_SERVICE_API)
    public gameServiceApi: GameServiceClientApi,
    @inject(EVENT_STREAMER)
    public eventStreamer: EventStreamer,
  ) {
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  @get('v1/new-top-games/sse', {
    responses: {
      '200': {
        description: 'Fetch newly added top games',
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
  async streamNewTopGames(
    @inject(RestBindings.Http.RESPONSE)
      response: Response,
  ): Promise<Response> {

    response.setHeader('Connection', 'keep-alive');
    response.contentType('text/event-stream');

    const event = new ServerSentEvent({ event: 'new-top-game', data: JSON.stringify({}) });

    await this.eventStreamer.subscribe((newGames) => response.write(newGames));

    response.write(event.toEventMessage());

    return response;
  }


}