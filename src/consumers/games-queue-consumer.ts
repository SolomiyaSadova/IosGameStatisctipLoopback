import { MessageBrokerService } from '../service/message-broker.service';
import { inject } from '@loopback/context';
import { MESSAGE_BROKER_SERVICE } from '../bindings';
import { Options } from 'amqplib';
import * as config from '../config/config.json';

export type AssertQueueOptions = Options.AssertQueue;
export type PublishOptions = Options.Publish;
export type ConsumeOptions = Options.Consume;

export class GamesQueueConsumer {

  constructor(
    @inject(MESSAGE_BROKER_SERVICE)
    public messageBrokerService: MessageBrokerService,
  ) {}

  async subscribe(): Promise<void> {

    const queueOptions = {
      durable: true,
      exclusive: false,
      autoDelete: false,
      arguments: null,
    };
    const consumeOptions = { noAck: true };

    await this.subscribeToQueue(config.QUEUES.ALL_GAMES.ALL_GAME_QUEUE_RESPONSE, queueOptions, consumeOptions);
    await this.subscribeToQueue(config.QUEUES.FREE_GAMES.FREE_GAME_QUEUE_RESPONSE, queueOptions, consumeOptions);
    await this.subscribeToQueue(config.QUEUES.PAID_GAMES.PAID_GAME_QUEUE_RESPONSE, queueOptions, consumeOptions);
    await this.subscribeToQueue(config.QUEUES.GROSSING_GAMES.GROSSING_GAME_QUEUE_RESPONSE,
      queueOptions, consumeOptions);

    this.messageBrokerService.onRestart(() => this.subscribe.call(this));
  }

  async subscribeToQueue(queueName: string, queueOptions: AssertQueueOptions, consumeOptions: ConsumeOptions) {
    const channel = await this.messageBrokerService.createChannel();
    if (channel) {
      await this.messageBrokerService.assertQueue(queueName, channel, queueOptions);
    }

    await channel.consume(queueName, message => {
      console.log(`Message received from ${queueName}: %s`, message?.content.toString());
    }, consumeOptions);
  }

}