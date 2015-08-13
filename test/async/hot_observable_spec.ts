import { expect } from 'chai';
import { OnComplete, OnNext } from '../../src/types';
import { Generator, Observer } from '../../src/core';
import { HotObservable } from '../../src/async/observable';

describe.only('Hot Observable', () => {

  it('should not wait for a subscriber to call its generator', done => {
    new HotObservable<void>(observer => done());
  });

  it('should trigger next notifications for each of its subscribers', done => {
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

  it('should trigger error notifications for each of its subscribers', done => {
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

  it('should trigger complete notifications for each of its subscribers', done => {
    let completed: boolean = false;
    let cb: Generator<void> = observer => observer.complete();
    let subscriber: OnComplete<void> = () => {
      if (completed) done();
      completed = !completed;
    };
    let observable: HotObservable<void> = new HotObservable<void>(cb);
    observable.subscribeOnComplete(subscriber);
    observable.subscribeOnComplete(subscriber);
  });
  
  it('should trigger notifications asynchronously', done => {
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

  it('should dispose of all its subscribers', done => {
    let cb: Generator<void> = observer => observer.complete();
    let observable: HotObservable<void> = new HotObservable<void>(cb);
    observable.subscribeOnComplete(() => {
      expect(observable._subscribers).to.be.empty;
      expect(observable.isDisposed).to.be.true;
      done();
    });
  });

  it('should pass its reference on complete', done => {
    let observable: HotObservable<void> = new HotObservable<void>(observer => observer.complete());
    observable.subscribeOnComplete(subscription => {
      expect(subscription).to.equal(observable);
      done();
    });
  });

  it('should throw an error if subscribed to after being disposed', done => {
    let cb: Generator<void> = observer => observer.complete();
    let observable: HotObservable<void> = new HotObservable<void>(cb);
    observable.subscribeOnComplete(() => {
      expect(observable.isDisposed).to.be.true;
      try { observable.subscribeOnComplete(() => {}); }
      catch(err) { done(); }
    });
  });

  it('should throw an error if its generator calls complete after completing', done => {
    let cb: Generator<void> = observer => {
      observer.complete();
      try { observer.complete(); }
      catch(err) { done(); }
    };
    new HotObservable<void>(cb).subscribeOnComplete(() => {});
  });

  it('should throw an error if its generator calls error after completing', done => {
    let cb: Generator<void> = observer => {
      observer.complete();
      try { observer.error(null); }
      catch(err) { done(); }
    };
    new HotObservable<void>(cb).subscribeOnComplete(() => {});
  });

  it('should throw an error if its generator calls next after completing', done => {
    let cb: Generator<void> = observer => {
      observer.complete();
      try { observer.next(); }
      catch(err) { done(); }
    };
    new HotObservable<void>(cb).subscribeOnComplete(() => {});
  });

  it('should catch any error thrown inside of its generator', done => {
    new HotObservable<void>(observer => {
        throw new Error('hot generator catch test');
      })
      .subscribeOnError(err => done());
  });

});
