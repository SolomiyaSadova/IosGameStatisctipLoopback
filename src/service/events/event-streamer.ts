import { Subject } from 'rxjs';

export class EventStreamer {
  subject: Subject<string> = new Subject<string>();

  next(message: string) {
    this.subject.next(message);
  }

  subscribe(onNext: (message: string) => void) {
       this.subject.subscribe(onNext);
  }

}