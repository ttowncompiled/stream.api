import {AbstractSubject, Observer} from '../core';
import {Observable} from './observable';

export abstract class BaseSubject<T, R>
    extends Observable<R> implements AbstractSubject<T, R> {

  _disposeUponNoSubscriptions: boolean;
  _subscriptions: Observable<T>[];

  abstract next(object?: T): void;

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
    this._scheduler.schedule<R>(this._subscribers, subscriber => {
      subscriber.error(err);
    });
  }

  subscribe(subscriber: Observer<R>): void {
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
    this._scheduler.schedule<R>(this._subscribers, subscriber => {
      subscriber.complete(this);
    }).then(() => {
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

export class Subject<T> extends BaseSubject<T, T> {

  constructor() {
    super();
  }

  next(object?: T): void {
    if (this.isDisposed) {
      this._assertNoNext();
    }
    this._scheduler.schedule<T>(this._subscribers, subscriber => {
      subscriber.next(object);
    });
  }
}
