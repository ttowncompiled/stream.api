import {Notification, Notify} from '../types';
import {AbstractScheduler, Observer} from '../core';

export class Scheduler implements AbstractScheduler {

  _queue: Notification[];

  constructor() {
    this._queue = [];
  }

  schedule<T>(subscribers: Observer<T>[], cb: Notify<T>): void {
    this._queue.push({cb: cb, subscribers: subscribers});
    if (this._queue.length === 1) {
      this._scheduleSubscription();
    }
  }

  tick(): void {
    if (this._queue.length === 0) {
      return;
    }
    this._queue.splice(0, 1);
    if (this._queue.length > 0) {
      this._scheduleSubscription();
    }
  }

  _scheduleSubscription(): void {
    setTimeout(() => {
      let notification: Notification = this._queue[0];
      notification.subscribers.forEach(subscriber => {
        setTimeout(() => {
          notification.cb(subscriber);
        });
      });
      setTimeout(() => {
        this.tick();
      });
    });
  }
}
