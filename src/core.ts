import { Callback, OnComplete, OnError, OnNext } from './types';

export interface Observer<T> {
  complete: OnComplete<T>;
  error: OnError;
  next: OnNext<T>;
}

export interface Disposable {
  dispose: () => void;
  isDisposed: boolean;
}

export interface AbstractObservable<T> extends Disposable {
  subscribe: (subscriber: Observer<T>) => void;
}

export interface AbstractScheduler {
  schedule(cb: Callback): void;
  tick(): void;
}

export interface AbstractSubscriber<T> extends Disposable, Observer<T> {
  subscribeTo: (subscription: AbstractObservable<T>) => void;
  unsubscribeFrom: (subscription: AbstractObservable<T>) => void;
}

export interface AbstractSubject<T> extends AbstractObservable<T>, AbstractSubscriber<T> {}

export type Generator<T> = (observer: Observer<T>) => void;

export type Transform<T, R> = (object?: T) => R;

