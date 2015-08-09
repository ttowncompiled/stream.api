import { OnComplete, OnError, OnNext } from './types';

export interface Observer<T> {
  complete: OnComplete;
  error: OnError;
  next: OnNext<T>;
}

export interface AbstractObservable<T> extends Disposable {
  subscribe: (subscriber: Observer<T>) => void;
}

export interface AbstractSubject<T> extends Observer<T>, AbstractObservable<T> {}

