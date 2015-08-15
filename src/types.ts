import {AbstractObservable, Observer} from './core';

export type Notify<T> = (subscriber: Observer<T>) => void;

export type OnComplete<T> = (subscription?: AbstractObservable<T>) => void;
export type OnError = (err: any) => void;
export type OnNext<T> = (object?: T) => void;

export interface Notification {
  cb: Notify<any>;
  notified: Function;
  subscribers: Observer<any>[];
}
