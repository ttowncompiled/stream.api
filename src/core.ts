import { Callback, OnComplete, OnError, OnNext } from './types';

export interface Disposable {
  dispose: () => void;
  isDisposed: boolean;
}

export type Generator<T> = (observer: Observer<T>) => void;

export interface Observer<T> {
  complete: OnComplete;
  error: OnError;
  next: OnNext<T>;
}

export type Transform<T, R> = (object: T) => R;

export interface AbstractScheduler {
  schedule(cb: Callback): void;
  tick(): void;
}

export interface AbstractObservable<T> extends Disposable {
  subscribe: (subscriber: Observer<T>) => void;
}

export interface AbstractSubject<T> extends Observer<T>, AbstractObservable<T> {}

