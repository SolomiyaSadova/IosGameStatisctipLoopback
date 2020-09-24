export * from './event-bus.service';

export const enum ApplicationEvent {
  MESSAGE_BROKER_RESTARTED = 'message-broker:restarted'
}