import { OnComplete, OnError, OnNext } from '../types';
import { AbstractObservable, Generator, Observer } from '../core';
import { Scheduler } from './scheduler';

export abstract class Observable<T> implements AbstractObservable<T> {

  isDisposed: boolean;
  _scheduler: Scheduler;
  _subscribers: Observer<T>[];

  constructor() {
    this.isDisposed = false;
    this._scheduler = new Scheduler();
    this._subscribers = [];
  }

  static create<E>(cb: Generator<E>): Observable<E> {
    return new ColdObservable<E>(cb);
  }

  static defer<E>(cb: Generator<E>): Observable<E> {
    return new DeferredObservable<E>(cb);
  }

  static publish<E>(cb: Generator<E>): Observable<E> {
    return new HotObservable<E>(cb);
  }
  
  abstract dispose(): void;
  
  abstract subscribe(subscriber: Observer<T>): void;

  subscribeOnComplete(complete: OnComplete<T>): void {
    let observer: Observer<T> = {
      complete: complete,
      error: this._throw,
      next: () => {}
    };
    this.subscribe(observer);
  }

  subscribeOnError(error: OnError): void {
    let observer: Observer<T> = {
      complete: () => {},
      error: error,
      next: () => {}
    };
    this.subscribe(observer);
  }

  subscribeOnNext(next: OnNext<T>): void {
    let observer: Observer<T> = {
      complete: () => {},
      error: this._throw,
      next: next
    };
    this.subscribe(observer);
  }

  _assertNoComplete(): void {
    throw new Error('An Observable called complete after being disposed.');
  }

  _assertNoError(): void {
    throw new Error('An Observable called error after being disposed.');
  }

  _assertNoNext(): void {
    throw new Error('An Observable called next after being disposed.');
  }

  _assertNoSubscribe(): void {
    throw new Error('An Observable was subscribed to after being disposed.');
  }

  _throw(err: any): void { throw err; }

}

export class ColdObservable<T> extends Observable<T> {

  _cb: Generator<T>;
  
  constructor(cb: Generator<T>) {
    super();
    this._cb = cb;
  }
  
  dispose(): void { this.isDisposed = true; }
  
  subscribe(subscriber: Observer<T>): void {
    if (this.isDisposed) this._assertNoSubscribe();
    let observer: Observer<T> = {
      complete: () => {
        if (this.isDisposed) this._assertNoComplete();
        this.dispose();
        this._scheduler.schedule(() => subscriber.complete(this));
      },
      error: err => {
        if (this.isDisposed) this._assertNoError();
        this._scheduler.schedule(() => subscriber.error(err));
      },
      next: object => {
        if (this.isDisposed) this._assertNoNext();
        this._scheduler.schedule(() => subscriber.next(object));
      }
    };
    setTimeout(() => {
      try { this._cb(observer); }
      catch(err) { observer.error(err); }
    });
  }
  
}

export abstract class PublishableObservable<T> extends Observable<T> {
  
  _cb: Generator<T>;
  
  constructor(cb: Generator<T>) {
    super();
    this._cb = cb;
  }
  
  dispose(): void {
    this.isDisposed = true;
    this._scheduler.schedule(() => {
      this._subscribers.forEach(subscriber => setTimeout(() => subscriber.complete(this)));
      this._subscribers = [];
    });
  }
  
  _publish(): void {
    let observer: Observer<T> = {
      complete: () => {
        if (this.isDisposed) this._assertNoComplete();
        this.dispose();
      },
      error: err => {
        if (this.isDisposed) this._assertNoError();
        this._scheduler.schedule(() => {
          this._subscribers.forEach(subscriber => setTimeout(() => subscriber.error(err)));
        });
      },
      next: object => {
        if (this.isDisposed) this._assertNoNext();
        this._scheduler.schedule(() => {
          this._subscribers.forEach(subscriber => setTimeout(() => subscriber.next(object)));
        });
      }
    };
    setTimeout(() => {
      try { this._cb(observer); }
      catch(err) { observer.error(err); }
    });
  }
  
}

export class DeferredObservable<T> extends PublishableObservable<T> {

  constructor(cb: Generator<T>) { super(cb); }
  
  subscribe(subscriber: Observer<T>): void {
    if (this.isDisposed) {
      subscriber.error(this._assertNoSubscribe());
      return;
    }
    this._subscribers.push(subscriber);
    if (this._subscribers.length === 1) this._publish();
  }

}

export class HotObservable<T> extends PublishableObservable<T> {

  constructor(cb: Generator<T>) {
    super(cb);
    this._publish();
  }
  
  subscribe(subscriber: Observer<T>): void { 
    if (this.isDisposed) {
      subscriber.error(this._assertNoSubscribe());
      return;
    }
    this._subscribers.push(subscriber);
  }
  
}
