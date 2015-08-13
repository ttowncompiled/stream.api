import { expect } from 'chai';
import { OnComplete, OnError, OnNext } from '../../src/types';
import { Generator, Observer } from '../../src/core';
import { Observable, Subject } from '../../src/async';

describe('Subject', () => {
  
  it('should emit notifications to all of its subscribers', done => {
    let sequence: number[] = [ 1, 2, 3 ];
    let pending: number[] = [];
    let subject: Subject<number> = new Subject<number>();
    sequence.forEach(object => subject.next(object));
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
    subject.subscribeOnNext(subscriber);
    subject.subscribeOnNext(subscriber);
  });

  it('should emit errors to all of its subscribers', done => {
    let sequence: number[] = [ 1, 2, 3 ];
    let pending: number[] = [];
    let subject: Subject<number> = new Subject<number>();
    sequence.forEach(object => subject.error(object));
    let subscriber: OnError = (object: number) => {
      if (sequence.indexOf(object) > -1) {
        sequence.splice(sequence.indexOf(object), 1);
        pending.push(object);
      } else {
        expect(pending.indexOf(object)).to.be.above(-1);
        pending.splice(pending.indexOf(object), 1);
      }
      if (sequence.length === 0 && pending.length === 0) done(); 
    };
    subject.subscribeOnError(subscriber);
    subject.subscribeOnError(subscriber);

  });

  it('should complete all of its subscribers upon completion', done => {
    let completed: boolean = false;
    let subject: Subject<void> = new Subject<void>();
    subject.complete();
    let subscriber: OnComplete<void> = () => {
      if (completed) done();
      completed = true;
    };
    subject.subscribeOnComplete(subscriber);
    subject.subscribeOnComplete(subscriber);
  });

  it('should be disposed when all of its subscriptions complete', done => {
    let cb: Generator<void> = observer => observer.complete();
    let observable: Observable<void> = Observable.create<void>(cb);
    let subject: Subject<void> = new Subject<void>();
    subject.subscribeTo(observable);
    subject.subscribeOnComplete(() => {
      expect(subject._subscribers).to.be.empty;
      expect(subject._subscriptions).to.be.empty;
      expect(subject.isDisposed).to.be.true;
      done();
    });
  });

  it('should act as an observer', done => {
    let nextFlag: boolean = true;
    let errorFlag: boolean = true;
    let cb: Generator<void> = observer => {
      observer.next();
      observer.error(null);
      observer.complete();
    };
    let observable: Observable<void> = Observable.create<void>(cb);
    let subject: Subject<void> = new Subject<void>();
    subject.subscribeTo(observable);
    let subscriber: Observer<void> = {
      complete: () => { if (nextFlag && errorFlag) done(); },
      error: err => errorFlag = true,
      next: () => nextFlag = true
    };
    subject.subscribe(subscriber);
  });

  it('should lazily subscribe', done => {
    let cb: Generator<void> = observer => done(new Error('cold generator was called'));
    let observable: Observable<void> = Observable.create<void>(cb);
    new Subject<void>().subscribeTo(observable);
    done();
  });

  it('should handle mutiple subscriptions', done => {
    let zero: number = 0;
    let flag: boolean = false;
    let cb: Generator<number> = observer => observer.next(zero);
    let observable: Observable<number> = Observable.create<number>(cb);
    let subject: Subject<number> = new Subject<number>();
    subject.subscribeTo(observable);
    subject.subscribeTo(observable);
    subject.subscribeOnNext(object => {
      expect(object).to.equal(zero);
      if (flag) done();
      flag = true;
    });
  });
 
});
