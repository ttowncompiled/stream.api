import { OnComplete, OnError, OnNext } from './types';

export interface Observer<T> {
  complete: OnComplete;
  error: OnError;
  next: OnNext<T>;
}

