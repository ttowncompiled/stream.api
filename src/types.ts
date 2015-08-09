import { Observer } from './core';

export type OnComplete = () => void;

export type OnError = (err: any) => void;

export type OnNext<T> = (item?: T) => void;

