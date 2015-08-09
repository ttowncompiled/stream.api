import { OnComplete, OnError, OnNext } from './types';

export interface Observer<T> {
  complete: OnComplete;
  error: OnError;
  next: OnNext<T>;
}

export interface AbstractObservable<T> {
  subscribe: (subscriber: Observer<T>) => void;
}

