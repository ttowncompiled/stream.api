export interface Disposable {
  dispose: () => void;
}

export interface Observer<T> {
  complete: () => void;
  error: (err: any) => void;
  next: (item?: T) => void;
}

export interface Observable<T> extends Disposable {
  subscribe: (observer: Observer<T>) => void;
}

export interface Subject<T> extends Observer<T>, Observable<T> {}

