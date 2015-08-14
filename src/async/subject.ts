import {AbstractSubject, Observer} from '../core';
import {Observable} from './observable';

export class Subject<T> extends Observable<T> implements AbstractSubject<T> {

  _disposeUponNoSubscriptions: boolean;
  _subscriptions: Observable<T>[];

  constructor() {
    super();
    this._disposeUponNoSubscriptions = false;
    this._subscriptions = [];
  }

  complete(subscription?: Observable<T>): void {
    if (this.isDisposed) {
      this._assertNoComplete();
    }
    this._unsubscribeFrom(subscription);
  }

  dispose(): void {
    this._disposeUponNoSubscriptions = true;
    if (this._subscriptions.length === 0) {
      this._disposeSubject();
    }
  }

  error(err: any): void {
    if (this.isDisposed) {
      this._assertNoError();
    }
    this._scheduler.schedule(() => {
      this._subscribers.forEach(subscriber => {
        setTimeout(() => {
          subscriber.error(err);
        });
      });
    });
  }

  next(object?: T): void {
    if (this.isDisposed) {
      this._assertNoNext();
    }
    this._scheduler.schedule(() => {
      this._subscribers.forEach(subscriber => {
        setTimeout(() => {
          subscriber.next(object);
        });
      });
    });
  }

  subscribe(subscriber: Observer<T>): void {
    if (this.isDisposed) {
      this._assertNoSubscribe();
    }
    this._subscribers.push(subscriber);
    if (this._subscribers.length === 1) {
      this._subscriptions.forEach(subscription => {
        subscription.subscribe(this);
      });
    }
  }

  subscribeTo(subscription: Observable<T>): void {
    if (this._disposeUponNoSubscriptions) {
      this._assertNoSubscribeTo();
    }
    this._subscriptions.push(subscription);
    if (this._subscribers.length > 0) {
      subscription.subscribe(this);
    }
  }

  _assertNoSubscribeTo(): void {
    throw new Error('Called subscribeTo on a Subject that has been disposed.');
  }

  _disposeSubject(): void {
    this.isDisposed = true;
    this._scheduler.schedule(() => {
      this._subscribers.forEach(subscriber => {
        setTimeout(() => {
          subscriber.complete(this);
        });
      });
      this._subscribers = [];
    });
  }

  _unsubscribeFrom(subscription: Observable<T>): void {
    let idx: number = this._subscriptions.indexOf(subscription);
    if (idx > -1) {
      this._subscriptions.splice(idx, 1);
    }
    if (this._subscriptions.length === 0 && this._disposeUponNoSubscriptions) {
      this._disposeSubject();
    }
  }
}
