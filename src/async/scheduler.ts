import {Notification, Notify} from '../types';
import {AbstractScheduler, Observer} from '../core';

export class Scheduler implements AbstractScheduler {

  _queue: Notification[];

  constructor() {
    this._queue = [];
  }

  schedule<T>(subscribers: Observer<T>[], notify: Notify<T>): Promise<void> {
    return new Promise<void>(resolve => {
      this._queue.push({
        cb: notify,
        notified: resolve,
        subscribers: subscribers
      });
      if (this._queue.length === 1) {
        this._scheduleNotification();
      }
    });
  }

  tick(): void {
    if (this._queue.length === 0) {
      return;
    }
    this._queue.splice(0, 1)[0].notified();
    if (this._queue.length > 0) {
      this._scheduleNotification();
    }
  }

  _scheduleNotification(): void {
    new Promise<void>(canTick => {
      setTimeout(() => {
        let promises: Promise<void>[] = [];
        let notification: Notification = this._queue[0];
        notification.subscribers.forEach(subscriber => {
          promises.push(new Promise<void>(scheduled => {
            setTimeout(() => {
              notification.cb(subscriber);
            });
            scheduled();
          }));
        });
        Promise.all<void>(promises).then(() => {
          canTick();
        });
      });
    }).then(() => {
      this.tick();
    });
  }
}
