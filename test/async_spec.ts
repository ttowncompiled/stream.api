/// <reference path="../typings/tsd.d.ts" />
import { expect } from 'chai';
import { OnComplete, OnNext } from '../src/types';
import { Generator, Observer } from '../src/core';
import { Scheduler } from '../src/async/async_scheduler';
import { ColdObservable, DeferredObservable, HotObservable, Observable } from '../src/async/async_observable';

describe('Scheduler', () => {

  it('should call the subscription if there is no pending subscription', done => {
    new Scheduler().schedule(() => done());
  });

  it('should not call the subscription until the pending subscription is finished', done => {
    let ticked: boolean = false;
    let scheduler: Scheduler = new Scheduler();
    scheduler.schedule(() => ticked = true);
    scheduler.schedule(() => {
      expect(ticked).to.be.true;
      done();
    });
  });

  it('should schedule subscriptions asynchronously', done => {
    let flag: boolean = false;
    new Scheduler().schedule(() => {
      expect(flag).to.be.true;
      done();
    });
    flag = true;
  });

});

describe('Observable', () => {

  it('create should produce a cold observable', done => {
    let zero: number = 0;
    let cb: Generator<number> = observer => observer.next(zero);
    let observable: Observable<number> = Observable.create<number>(cb);
    observable.subscribeOnNext(firstItem => {
      expect(firstItem).to.equal(zero);
      observable.subscribeOnNext(secondItem => {
        expect(secondItem).to.equal(zero);
        done();
      });
    });
  });

  it('defer should produce a deferred observable', done => {
    let sequence: number[] = [ 1, 2, 3 ];
    let pending: number[] = [];
    let cb: Generator<number> = observer => sequence.forEach(object => observer.next(object));
    let observable: Observable<number> = Observable.defer<number>(cb);
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

  it('publish should produce a hot observable', done => {
    Observable.publish(observer => done());
  });

});

describe('Cold Observable', () => {

  it('should call its generator for each new subscription', done => {
    let zero: number = 0;
    let cb: Generator<number> = observer => observer.next(zero);
    let observable: ColdObservable<number> = new ColdObservable<number>(cb);
    observable.subscribeOnNext(firstItem => {
      expect(firstItem).to.equal(zero);
      observable.subscribeOnNext(secondItem => {
        expect(secondItem).to.equal(zero);
        done();
      });
    });
  });

  it('should emit all notifications to its subscription', done => {
    let sequence: number[] = [ 1, 2, 3 ];
    new ColdObservable<number>(observer => sequence.forEach(object => observer.next(object)))
      .subscribeOnNext(object => {
        expect(sequence.indexOf(object)).to.be.above(-1);
        sequence.splice(sequence.indexOf(object), 1);
        if (sequence.length === 0) done();
      });
  });

  it('should emit all errors to its subscription', done => {
    let sequence: number[] = [ 1, 2, 3 ];
    new ColdObservable<number>(observer => sequence.forEach(object => observer.error(object)))
      .subscribeOnError(object => {
        expect(sequence.indexOf(object)).to.be.above(-1);
        sequence.splice(sequence.indexOf(object), 1);
        if (sequence.length === 0) done();
      });
  });

  it('should complete its subscription upon completion', done => {
    new ColdObservable<void>(observer => observer.complete())
      .subscribeOnComplete(() => done());
  });

  it('should fire notifications asynchronously', done => {
    let flag: boolean = false;
    let completeFlag: boolean = false;
    let errorFlag: boolean = false;
    let nextFlag: boolean = false;
    new ColdObservable<void>(observer => observer.complete())
      .subscribeOnComplete(() => {
        expect(flag).to.be.true;
        completeFlag = true;
        if (completeFlag && errorFlag && nextFlag) done();
      });
    new ColdObservable<void>(observer => observer.error(null))
      .subscribeOnError(() => {
        expect(flag).to.be.true;
        errorFlag = true;
        if (completeFlag && errorFlag && nextFlag) done();
      });
    new ColdObservable<void>(observer => observer.next())
      .subscribeOnNext(() => {
        expect(flag).to.be.true;
        nextFlag = true;
        if (completeFlag && errorFlag && nextFlag) done();
      });
    flag = true;
  });

  it('should throw an error if a completed observable is subscribed to', done => {
    let cb: Generator<void> = observer => observer.complete();
    let observable: ColdObservable<void> = new ColdObservable<void>(cb);
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
      observer.complete();
    };
    new ColdObservable<void>(cb).subscribeOnError(err => done());
  });

  it('should throw an error if a completed observer calls error', done => {
    let cb: Generator<void> = observer => {
      observer.complete();
      observer.error(null);
    };
    new ColdObservable<void>(cb).subscribeOnError(err => done());
  });

  it('should throw an error if a completed observer calls next', done => {
    let cb: Generator<void> = observer => {
      observer.complete();
      observer.next();
    };
    new ColdObservable<void>(cb).subscribeOnError(err => done());
  });

  it('should catch any error thrown inside of a generator', done => {
    new ColdObservable<void>(observer => {
        throw new Error('cold generator catch test');
      })
      .subscribeOnError(err => done());
  });

  it('should catch any error thrown inside of a complete call', done => {
    let subscriber: Observer<void> = {
      complete: () => { throw new Error('cold complete catch test'); },
      error: err => done(),
      next: () => {}
    };
    new ColdObservable<void>(observer => observer.complete())
      .subscribe(subscriber);
  });

  it('should catch any error thrown inside of a next call', done => {
    let subscriber: Observer<void> = {
      complete: () => {},
      error: err => done(),
      next: () => { throw new Error('cold next catch test'); }
    };
    new ColdObservable<void>(observer => observer.next())
      .subscribe(subscriber);
  });

});

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
    let subscriber: OnComplete = () => {
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

describe('Hot Observable', () => {

  it('should not wait for a subscription to call its generator', done => {
    new HotObservable<void>(observer => done());
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
    let observable: HotObservable<number> = new HotObservable<number>(cb);
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
    let observable: HotObservable<number> = new HotObservable<number>(cb);
    observable.subscribeOnError(subscriber);
    observable.subscribeOnError(subscriber);
  });

  it('should complete all of its subscribers upon completion', done => {
    let completed: boolean = false;
    let cb: Generator<void> = observer => observer.complete();
    let subscriber: OnComplete = () => {
      if (completed) done();
      completed = !completed;
    };
    let observable: HotObservable<void> = new HotObservable<void>(cb);
    observable.subscribeOnComplete(subscriber);
    observable.subscribeOnComplete(subscriber);
  });

  it('should dispose of all subscribers upon completion', done => {
    let cb: Generator<void> = observer => observer.complete();
    let observable: HotObservable<void> = new HotObservable<void>(cb);
    observable.subscribeOnComplete(() => {
      expect(observable._subscribers).to.deep.equal([]);
      expect(observable.isDisposed).to.be.true;
      done();
    });
  });

  it('should fire notifications asynchronously', done => {
    let flag: boolean = false;
    let completeFlag: boolean = false;
    let errorFlag: boolean = false;
    let nextFlag: boolean = false;
    new HotObservable<void>(observer => observer.complete())
      .subscribeOnComplete(() => {
        expect(flag).to.be.true;
        completeFlag = true;
        if (completeFlag && errorFlag && nextFlag) done();
      });
    new HotObservable<void>(observer => observer.error(null))
      .subscribeOnError(() => {
        expect(flag).to.be.true;
        errorFlag = true;
        if (completeFlag && errorFlag && nextFlag) done();
      });
    new HotObservable<void>(observer => observer.next())
      .subscribeOnNext(() => {
        expect(flag).to.be.true;
        nextFlag = true;
        if (completeFlag && errorFlag && nextFlag) done();
      });
    flag = true;
  });

  it('should throw an error if a completed observable is subscribed to', done => {
    let cb: Generator<void> = observer => observer.complete();
    let observable: HotObservable<void> = new HotObservable<void>(cb);
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
    new HotObservable<void>(cb);
  });

  it('should throw an error if a completed observer calls error', done => {
    let cb: Generator<void> = observer => {
      observer.complete();
      try { observer.error(null); }
      catch(err) { done(); }
    };
    new HotObservable<void>(cb);
  });

  it('should throw an error if a completed observer calls next', done => {
    let cb: Generator<void> = observer => {
      observer.complete();
      try { observer.next(); }
      catch(err) { done(); }
    };
    new HotObservable<void>(cb);
  });

  it('should catch any error thrown inside of a generator', done => {
    new HotObservable<void>(observer => {
        throw new Error('hot generator catch test');
      })
      .subscribeOnError(err => done());
  });

  it('should catch any error thrown inside of a complete call', done => {
    let subscriber: Observer<void> = {
      complete: () => { throw new Error('hot complete catch test'); },
      error: err => done(),
      next: () => {}
    };
    new HotObservable<void>(observer => observer.complete())
      .subscribe(subscriber);
  });

  it('should catch any error thrown inside of a next call', done => {
    let subscriber: Observer<void> = {
      complete: () => {},
      error: err => done(),
      next: () => { throw new Error('hot next catch test'); }
    };
    new HotObservable<void>(observer => observer.next())
      .subscribe(subscriber);
  });

});

