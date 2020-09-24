import { GamesQueueConsumer } from './games-queue-consumer';
import { GAMES_QUEUE_CONSUMER } from '../bindings';
import { inject } from '@loopback/context';

export class ConsumersBootService {

  constructor(
    @inject(GAMES_QUEUE_CONSUMER)
    public gamesQueueConsumer: GamesQueueConsumer,
  ) {
  }

  async bootConsumers() {
    await this.gamesQueueConsumer.subscribe();
  }
}