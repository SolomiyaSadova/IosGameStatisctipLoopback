import { Channel, connect, Connection, Options } from 'amqplib';
import { logger } from '../logger-config';
import { inject } from '@loopback/context';
import { APPLICATION_EVENTS_BUS_SERVICE } from '../bindings';
import { AMQP, RESTART_CONNECTION_TIMEOUT } from '../config/config.json';
import { ApplicationEvent, EventBusService } from './events';

export type AMQPConnection = Connection;
export type AMQPChannel = Channel;
export type AssertQueueOptions = Options.AssertQueue;
export type PublishOptions = Options.Publish;
export type ConsumeOptions = Options.Consume;
export type AssertExchangeOptions = Options.AssertExchange;


export class MessageBrokerService {

  constructor(
    @inject(APPLICATION_EVENTS_BUS_SERVICE)
    public eventBusService: EventBusService,
  ) {
  }

  reconnectionTimeoutId: NodeJS.Timeout;
  connection: AMQPConnection;

  async connect(): Promise<Connection> {
    logger.info(`Connecting to the Message Broker via ${AMQP}`);
    try {
      this.connection = await connect(AMQP);

      this.attachConnectionEventHandlers();
      logger.info(`Connected to the Message Broker via ${AMQP}`);
      return this.connection;
    } catch (e) {
      logger.error(`Error connecting to message broker - ${e.message}`);

      await this.delay(RESTART_CONNECTION_TIMEOUT);

      // eslint-disable-next-line no-return-await
      return await this.connect();
    }
  }

  async createChannel(): Promise<AMQPChannel> {
    logger.info('Creating new channel...');
    const channel = this.connection.createChannel();
    return channel;
  }

  async assertQueue(queueName: string, channel: AMQPChannel, queueOptions: AssertQueueOptions): Promise<string> {
    const queueAssertion = await channel.assertQueue(queueName, queueOptions);
    return queueAssertion.queue;
  }

  async publishToQueue(queueName: string, message: string, publishOptions: PublishOptions): Promise<boolean> {
    const channel = await this.createChannel();
    const queueOptions = {
      durable: true,
      exclusive: false,
      autoDelete: false,
      arguments: null,
    };
    const queue = await this.assertQueue(queueName, channel, queueOptions);
    logger.info(`Send message to queue - ${queueName}, ${Buffer.from(message)}`);
    const answer = channel.sendToQueue(
      queue,
      Buffer.from(message),
      publishOptions,
    );
    await channel.close();
    return answer;
  }

  onRestart(listener: () => Promise<void>): void {
    this.eventBusService
      .addListener(ApplicationEvent.MESSAGE_BROKER_RESTARTED, () => {
        listener()
          .then(() => logger.info('Executed MESSAGE_BROKER_RESTARTED callback'))
          .catch(() => logger.info('Error executing MESSAGE_BROKER_RESTARTED callback'));
      });
  }

  private onConnectionClose(): void {
    if (this.reconnectionTimeoutId) clearTimeout(this.reconnectionTimeoutId);

    this.reconnectionTimeoutId = setTimeout(() => {
      this.connect()
        .then(() => this.notifyListeners())
        .catch(() => this.onConnectionClose());
    }, RESTART_CONNECTION_TIMEOUT);
  }

  // eslint-disable-next-line
  private onConnectionError(error: any): void {
    if (error.message !== 'Connection closing') {
      logger.info('[AMQP] conn error ', error.message);
    }
  }

  private attachConnectionEventHandlers(): void {
    this.connection.on('error', this.onConnectionError.bind(this));
    this.connection.on('close', this.onConnectionClose.bind(this));
  }

  private notifyListeners(): void {
    logger.info('Restarted connection');
    this.eventBusService.emit(ApplicationEvent.MESSAGE_BROKER_RESTARTED);
  }

  private async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms));
  }

}

