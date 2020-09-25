export class ServerSentEvent {
  /*
   * This is a comment, since it starts with a colon character.
   * EventSource object ignores comments during reading the message
   * **/
  static KEEP_ALIVE_MESSAGE = ': keep this stream alive \n\n';
  /*
   * Named event to fire on EventSource object on message arrived.
   * Indicates that consumer should call "close()" method on EventSource object.
   * **/
  static CLOSE_CONNECTION_MESSAGE = 'event: close \n\n';
  /*
   * A string identifying the type of event described. If this is specified,
   * an event will be dispatched on the browser to the listener for the specified event name
   * **/
  event?: string;
  /*
   * The data field for the message. JSON-like string '{ "a": "b", "c": "d" }'
   * **/
  data?: string;
  /*
   * The event ID to set the EventSource object's last event ID value.
   * **/
  id?: string;
  /*
   * The reconnection time to use when attempting to send the event.
   * This must be an integer, specifying the reconnection time in milliseconds.
   * **/
  retry?: number;
  constructor(object: Partial<ServerSentEvent>) {
    Object.assign(this, object);
  }
  /*
   * According to SSE spec message should be in the predefined format
   * https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Fields
   *
   * "
   *   : any comments starts from a colon character
   *
   *   id: optional, message id to track last received message
   *   event: optional, named event to fire on EventSource object
   *   data: optional, message payload
   *   retry: optional, reconnection time in milliseconds
   * "
   *
   * Keep in mind: EventSource object was designed to work with such format.
   * Probably, EventSource object will be used in the browser clients but if the consumer
   * is another server he will need to parse message manually.
   *
   * **/
  toEventMessage(): string {
    // Messages in the event stream are separated by a pair of newline characters.
    let message = '';
    for (const prop in this) {
      if (this[prop]) {
        if (message) {
          message += '\n'; // message not empty, put new line char
        }
        message += `${prop}: ${this[prop]}`;
      }
    }
    message += '\n\n'; // 2 new-line characters at the end indicates the end of message
    return message;
  }
}