import { expect } from 'chai';
import { OnComplete, OnNext } from '../../src/types';
import { Generator, Observer } from '../../src/core';
import { DeferredObservable } from '../../src/async/observable';

describe('Deferred Observable', () => {

  it('should call its generator on the first subscription', done => {
    let zero: number = 0;
    new DeferredObservable(observer => observer.next(zero))
      .subscribeOnNext(object => {
        expect(object).to.equal(zero);
        done();
      });
  });

  it('should not call its generator for any other subscription', done => {
    let sequence: number[] = [ 1, 2, 3 ];
    let pending: number[] = [];
    let cb: Generator<number> = observer => sequence.forEach(object => observer.next(object));
    let observable: DeferredObservable<number> = new DeferredObservable<number>(cb);
    let subscriber: OnNext<number> = object => {
      if (pending.length === 0) observable.subscribeOnNext(subscriber);
      if (sequence.indexOf(object) > -1) {
        sequence.splice(sequence.indexOf(object), 1);
        pending.push(object);
      } else {
        expect(pending.indexOf(object)).to.be.above(-1);
        pending.splice(pending.indexOf(object), 1);
      }
      if (sequence.length === 0 && pending.length === 1) done(); 
    };
    observable.subscribeOnNext(subscriber);
  });

  it('should emit all notification to each of its subscribers', done => {
    let sequence: number[] = [ 1, 2, 3 ];
    let pending: number[] = [];
    let cb: Generator<number> = observer => sequence.forEach(object => observer.next(object));
    let subscriber: OnNext<number> = object => {
      if (sequence.indexOf(object) > -1) {
        sequence.splice(sequence.indexOf(object), 1);
        pending.push(object);
      } else {
        expect(pending.indexOf(object)).to.be.above(-1);
        pending.splice(pending.indexOf(object), 1);
      }
      if (sequence.length === 0 && pending.length === 0) done(); 
    };
    let observable: DeferredObservable<number> = new DeferredObservable<number>(cb);
    observable.subscribeOnNext(subscriber);
    observable.subscribeOnNext(subscriber);
  });

  it('should emit all errors to each of its subscribers', done => {
    let sequence: number[] = [ 1, 2, 3 ];
    let pending: number[] = [];
    let cb: Generator<number> = observer => sequence.forEach(object => observer.error(object));
    let subscriber: OnNext<number> = object => {
      if (sequence.indexOf(object) > -1) {
        sequence.splice(sequence.indexOf(object), 1);
        pending.push(object);
      } else {
        expect(pending.indexOf(object)).to.be.above(-1);
        pending.splice(pending.indexOf(object), 1);
      }
      if (sequence.length === 0 && pending.length === 0) done(); 
    };
    let observable: DeferredObservable<number> = new DeferredObservable<number>(cb);
    observable.subscribeOnError(subscriber);
    observable.subscribeOnError(subscriber);
  });

  it('should complete all of its subscribers upon completion', done => {
    let completed: boolean = false;
    let cb: Generator<void> = observer => observer.complete();
    let subscriber: OnComplete<void> = () => {
      if (completed) done();
      completed = !completed;
    };
    let observable: DeferredObservable<void> = new DeferredObservable<void>(cb);
    observable.subscribeOnComplete(subscriber);
    observable.subscribeOnComplete(subscriber);
  });

  it('should dispose of all subscribers upon completion', done => {
    let cb: Generator<void> = observer => observer.complete();
    let observable: DeferredObservable<void> = new DeferredObservable<void>(cb);
    observable.subscribeOnComplete(() => {
      expect(observable._subscribers).to.deep.equal([]);
      expect(observable.isDisposed).to.be.true;
      done();
    });
  });

  it('should pass a reference on complete', done => {
    let observable: DeferredObservable<void> = new DeferredObservable<void>(observer => observer.complete());
    observable.subscribeOnComplete(subscription => {
      expect(subscription).to.equal(observable);
      done();
    });
  });

  it('should fire notifications asynchronously', done => {
    let flag: boolean = false;
    let completeFlag: boolean = false;
    let errorFlag: boolean = false;
    let nextFlag: boolean = false;
    new DeferredObservable<void>(observer => observer.complete())
      .subscribeOnComplete(() => {
        expect(flag).to.be.true;
        completeFlag = true;
        if (completeFlag && errorFlag && nextFlag) done();
      });
    new DeferredObservable<void>(observer => observer.error(null))
      .subscribeOnError(() => {
        expect(flag).to.be.true;
        errorFlag = true;
        if (completeFlag && errorFlag && nextFlag) done();
      });
    new DeferredObservable<void>(observer => observer.next())
      .subscribeOnNext(() => {
        expect(flag).to.be.true;
        nextFlag = true;
        if (completeFlag && errorFlag && nextFlag) done();
      });
    flag = true;
  });

  it('should throw an error if a completed observable is subscribed to', done => {
    let cb: Generator<void> = observer => observer.complete();
    let observable: DeferredObservable<void> = new DeferredObservable<void>(cb);
    let subscriber: Observer<void> = {
      complete: () => observable.subscribe(null),
      error: err => done(),
      next: () => {}
    };
    observable.subscribe(subscriber);
  });

  it('should throw an error if a completed observer calls complete', done => {
    let cb: Generator<void> = observer => {
      observer.complete();
      try { observer.complete(); }
      catch(err) { done(); }
    };
    new DeferredObservable<void>(cb).subscribeOnComplete(() => {});
  });

  it('should throw an error if a completed observer calls error', done => {
    let cb: Generator<void> = observer => {
      observer.complete();
      try { observer.error(null); }
      catch(err) { done(); }
    };
    new DeferredObservable<void>(cb).subscribeOnComplete(() => {});
  });

  it('should throw an error if a completed observer calls next', done => {
    let cb: Generator<void> = observer => {
      observer.complete();
      try { observer.next(); }
      catch(err) { done(); }
    };
    new DeferredObservable<void>(cb).subscribeOnComplete(() => {});
  });

  it('should catch any error thrown inside of a generator', done => {
    new DeferredObservable<void>(observer => {
        throw new Error('deferred generator catch test');
      })
      .subscribeOnError(err => done());
  });

  it('should catch any error thrown inside of a complete call', done => {
    let subscriber: Observer<void> = {
      complete: () => { throw new Error('deferred complete catch test'); },
      error: err => done(),
      next: () => {}
    };
    new DeferredObservable<void>(observer => observer.complete())
      .subscribe(subscriber);
  });

  it('should catch any error thrown inside of a next call', done => {
    let subscriber: Observer<void> = {
      complete: () => {},
      error: err => done(),
      next: () => { throw new Error('deferred next catch test'); }
    };
    new DeferredObservable<void>(observer => observer.next())
      .subscribe(subscriber);
  });

});