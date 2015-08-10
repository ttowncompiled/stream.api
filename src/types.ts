import { AbstractObservable } from './core';

export type Callback = () => void;

export type OnComplete<T> = (subscription?: AbstractObservable<T>) => void;

export type OnError = (err: any) => void;

export type OnNext<T> = (object?: T) => void;

