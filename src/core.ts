import {Callback, OnComplete, OnError, OnNext} from './types';

export type Generator<T> = (observer: Observer<T>) => void;
export type Transform<T, R> = (object?: T) => R;

export interface Disposable {
  dispose: () => void;
  isDisposed: boolean;
}

export interface AbstractScheduler {
  schedule(cb: Callback): void;
  tick(): void;
}

export interface AbstractObservable<T> extends Disposable {
  subscribe: (subscriber: Observer<T>) => void;
}

export interface Observer<T> {
  complete: OnComplete<T>;
  error: OnError;
  next: OnNext<T>;
}

export interface AbstractSubject<T> extends AbstractObservable<T>, Observer<T> {
  subscribeTo: (subscription: AbstractObservable<T>) => void;
}
