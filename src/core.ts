import { OnComplete, OnError, OnNext } from './types';

export interface Disposable {
  dispose: () => void;
  isDisposed: boolean;
}

export interface Observer<T> {
  complete: OnComplete;
  error: OnError;
  next: OnNext<T>;
}

export interface AbstractObservable<T> extends Disposable {
  subscribe: (observer: Observer<T>) => void;
}

export interface AbstractScheduler {
  scheduleNotification(cb: () => void): void;
  scheduleSubscription(cb: () => void): void;
}

export interface AbstractSubject<T> extends Observer<T>, AbstractObservable<T> {}

