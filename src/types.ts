import { Observer } from './core';

export type Callback = () => void;

export type Generator<T> = (observer: Observer<T>) => void;

export type OnComplete = () => void;

export type OnError = (err: any) => void;

export type OnNext<T> = (item?: T) => void;

