import {expect} from 'chai';
import {OnComplete, OnError, OnNext} from '../../src/types';
import {Generator, Observer} from '../../src/core';
import {Observable, Subject} from '../../src/async';

describe('Subject', () => {

  it('should defer its first subscription until it has a subscriber', done => {
    let cb: Generator<void> = observer =>
        done(new Error('cold generator was called'));
    let observable: Observable<void> = Observable.create<void>(cb);
    new Subject<void>().subscribeTo(observable);
    done();
  });

  it('should subscribe to its following subscriptions if it has a subscriber',
     done => {
       let subject: Subject<void> = new Subject<void>();
       subject.subscribeOnNext(() => done());
       subject.subscribeTo(
           Observable.create<void>(observer => observer.next()));
     });

  it('should handle multiple subscriptions', done => {
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

  it('should trigger complete notifications for each of its subscribers',
     done => {
       let completed: boolean = false;
       let subject: Subject<void> = new Subject<void>();
       let subscriber: OnComplete<void> = () => {
         if (completed) done();
         completed = true;
       };
       subject.subscribeOnComplete(subscriber);
       subject.subscribeOnComplete(subscriber);
       subject.dispose();
     });

  it('should trigger error notifications for each of its subscribers', done => {
    let sequence: number[] = [1, 2, 3];
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

  it('should trigger next notifications for each of its subscribers', done => {
    let sequence: number[] = [1, 2, 3];
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

  it('should trigger notifications asynchronously', done => {
    let flag: boolean = false;
    let subject: Subject<void> = new Subject<void>();
    subject.subscribeTo(Observable.create<void>(observer => observer.next()));
    subject.subscribeOnNext(() => {
      if (flag) done();
    });
    flag = true;
  });

  it('if disposed, should be disposed after its subscriptions complete',
     done => {
       let subject: Subject<void> = new Subject<void>();
       subject.subscribeTo(
           Observable.create<void>(observer => observer.complete()));
       subject.subscribeOnComplete(() => {
         expect(subject.isDisposed).to.be.true;
         expect(subject._subscribers).to.be.empty;
         done();
       });
       subject.dispose();
     });

  it('should pass its reference on complete', done => {
    let subject: Subject<void> = new Subject<void>();
    subject.subscribeOnComplete(subscription => {
      expect(subscription).to.equal(subject);
      done();
    });
    subject.dispose();
  });

  it('should listen for complete notifications and unsubscribe from its subscriptions',
     done => {
       let subject: Subject<void> = new Subject<void>();
       let observable: Observable<void> =
           Observable.create<void>(observer => observer.complete());
       subject.subscribeTo(observable);
       subject.subscribeOnComplete(() => {
         expect(subject._subscriptions).to.be.empty;
         done();
       });
       subject.dispose();
     });

  it('should listen for error notifications', done => {
    let subject: Subject<void> = new Subject<void>();
    subject.subscribeTo(
        Observable.create<void>(observer => observer.error(null)));
    subject.subscribeOnError(err => done());
  });

  it('should listen for next notifications', done => {
    let subject: Subject<void> = new Subject<void>();
    subject.subscribeTo(Observable.create<void>(observer => observer.next()));
    subject.subscribeOnNext(() => done());
  });

  it('should throw an error if subscribed to after being disposed', done => {
    let subject: Subject<void> = new Subject<void>();
    subject.dispose();
    try {
      subject.subscribeOnComplete(() => {});
    } catch (err) {
      done();
    }
  });

  it('should throw an error if a subscription is added after being disposed',
     done => {
       let subject: Subject<void> = new Subject<void>();
       subject.dispose();
       try {
         subject.subscribeTo(null);
       } catch (err) {
         done();
       }
     });

  it('should throw an error if it calls complete after being disposed',
     done => {
       let subject: Subject<void> = new Subject<void>();
       subject.dispose();
       try {
         subject.complete();
       } catch (err) {
         done();
       }
     });

  it('should throw an error if it calls error after being disposed', done => {
    let subject: Subject<void> = new Subject<void>();
    subject.dispose();
    try {
      subject.error(null);
    } catch (err) {
      done();
    }
  });

  it('should throw an error if it calls next after being disposed', done => {
    let subject: Subject<void> = new Subject<void>();
    subject.dispose();
    try {
      subject.next();
    } catch (err) {
      done();
    }
  });

});
