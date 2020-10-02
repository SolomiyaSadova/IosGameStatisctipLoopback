import { inject } from '@loopback/context';
import { EVENT_STREAMER, MESSAGE_BROKER_SERVICE } from '../bindings';
import { MessageBrokerService } from '../service/message-broker.service';
import * as config from '../config/config.json';
import { AssertQueueOptions, ConsumeOptions } from './games-queue-consumer';
import { EventStreamer } from '../service/events/event-streamer';

export class NewTopGamesConsumer {

  constructor(
    @inject(MESSAGE_BROKER_SERVICE)
    public messageBrokerService: MessageBrokerService,
    @inject(EVENT_STREAMER)
    public eventStreamer: EventStreamer,
  ) {
  }

  async subscribe(): Promise<void> {
    const queueOptions = {
      durable: true,
      exclusive: false,
      autoDelete: false,
      arguments: null,
    };
    const consumeOptions = { noAck: true };

    await this.subscribeToQueue(config.QUEUES.NEW_TOP_GAMES.NEW_TOP_GAMES_QUEUE, queueOptions,
      consumeOptions);
  }

  async subscribeToQueue(queueName: string, queueOptions: AssertQueueOptions, consumeOptions: ConsumeOptions) {
    const channel = await this.messageBrokerService.createChannel();
    if (channel) {
      await this.messageBrokerService.assertQueue(queueName, channel, queueOptions);
    }

    await channel.consume(queueName, message => {
      console.log(`Message received from ${queueName}: %s`, message?.content.toString());
      if (message) this.toStream(message.content.toString());
    }, consumeOptions);
  }

  toStream(message: string) {
    this.eventStreamer.next(message);
  }
}