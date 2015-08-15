import {Notify, OnComplete, OnError, OnNext} from './types';

export type Generator<T> = (observer: Observer<T>) => void;
export type Transform<T, R> = (object?: T) => R;

export interface Disposable {
  dispose: () => void;
  isDisposed: boolean;
}

export interface AbstractScheduler {
  schedule<T>(subscribers: Observer<T>[], cb: Notify<T>): void;
  tick(): void;
}

export interface AbstractObservable<T> extends Disposable {
  subscribe: (...subscribers: Observer<T>[]) => void;
}

export interface Observer<T> {
  complete: OnComplete<T>;
  error: OnError;
  next: OnNext<T>;
}

export interface AbstractSubject<T, R> extends AbstractObservable<R>, Observer<T> {
  subscribeTo: (...subscriptions: AbstractObservable<T>[]) => void;
}
