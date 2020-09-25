import { ApplicationEvent } from './index';
import EventEmitter = NodeJS.EventEmitter;
import * as events from 'events';

export class EventBusService {

  emitter: events.EventEmitter = new events.EventEmitter()

  emit(event: ApplicationEvent): boolean {
    return this.emitter.emit(event.toString());
  }

  addListener(event: ApplicationEvent, listener: () => void): void {
    this.emitter.addListener(event, listener);
  }
}