export interface Observer<T> {
  complete: () => void;
  error: (err: any) => void;
  next: (item?: T) => void;
}

export interface Observable<T> {
  subscribe: (observer: Observer<T>) => void;
}

