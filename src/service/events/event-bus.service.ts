import { ApplicationEvent } from './index';
import EventEmitter = NodeJS.EventEmitter;
import * as events from 'events';

export class EventBusService {

  emitter: events.EventEmitter = new events.EventEmitter()

  emit(event: ApplicationEvent): boolean {

    console.log('Event - ', event.toString());
    //console.log('Event - ', event.());
    //todo: check event.toString() - should return string
    return this.emitter.emit(event.toString());
  }

  addListener(event: ApplicationEvent, listener: () => void): void {
    //todo: check event.toString() - should return string
    this.emitter.addListener(event, listener);
  }
}