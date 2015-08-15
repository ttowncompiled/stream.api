import {expect} from 'chai';
import {OnNext} from '../../src/types';
import {Generator, Observer} from '../../src/core';
import {Observable} from '../../src/async';

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
    let sequence: number[] = [1, 2, 3];
    let pending: number[] = [];
    let cb: Generator<number> = observer => {
      sequence.forEach(object => {
        observer.next(object);
      });
    };
    let observable: Observable<number> = Observable.defer<number>(cb);
    let subscriber: OnNext<number> = object => {
      if (pending.length === 0) {
        observable.subscribeOnNext(subscriber);
      }
      if (sequence.indexOf(object) > -1) {
        sequence.splice(sequence.indexOf(object), 1);
        pending.push(object);
      } else {
        expect(pending.indexOf(object)).to.be.above(-1);
        pending.splice(pending.indexOf(object), 1);
      }
      if (sequence.length === 0 && pending.length === 1) {
        done();
      }
    };
    observable.subscribeOnNext(subscriber);
  });

  it('empty should produce a cold observable that only completes', done => {
    let subscriber: Observer<void> = {
      complete: () => {
        done();
      },
      error: err => {
        done(new Error('empty observable should not emit error'));
      },
      next: () => {
        done(new Error('empty observable should not emit object'));
      }
    };
    Observable.empty<void>()
      .subscribe(subscriber);
  });

  it('from should produce a cold observable that generates the sequence',
     done => {
       let sequence: number[] = [1, 2, 3];
       Observable.from<number>(sequence)
         .subscribeOnNext(object => {
           expect(sequence.indexOf(object)).to.be.above(-1);
           sequence.splice(sequence.indexOf(object), 1);
           if (sequence.length === 0) {
             done();
           }
         });
     });

  it('from should complete after generating the sequence', done => {
    let sequence: number[] = [1, 2, 3];
    let count: number = 0;
    let subscriber: Observer<number> = {
      complete: () => {
        expect(count).to.equal(sequence.length);
        done();
      },
      error: err => {},
      next: () => {
        count++;
      }
    };
    Observable.from<number>(sequence)
      .subscribe(subscriber);
  });

  it('merge should produce a deferred observable containing the subscriptions',
     done => {
       let zero: number = 0;
       let count: number = 0;
       let observable: Observable<number> = Observable.of<number>(zero);
       Observable.merge<number>(observable, observable)
         .subscribeOnNext(object => {
           expect(object).to.equal(zero);
           count++;
           if (count === [observable, observable].length) {
             done();
           }
         });
     });

  it('merge should complete when all of its subscriptions complete', done => {
    let zero: number = 0;
    let count: number = 0;
    let observable: Observable<number> = Observable.of<number>(zero);
    let observer: Observer<number> = {
      complete: () => {
        expect(count).to.equal([observable, observable].length);
        done();
      },
      error: err => {},
      next: object => {
        expect(object).to.equal(zero);
        count++;
      }
    };
    Observable.merge<number>(observable, observable)
      .subscribe(observer);
  });

  it('of should produce a cold observable that emits the object', done => {
    let zero: number = 0;
    Observable.of<number>(zero)
      .subscribeOnNext(object => {
        expect(object).to.equal(zero);
        done();
      });
  });

  it('of should complete after emitting the object', done => {
    let zero: number = 0;
    let count: number = 0;
    let subscriber: Observer<number> = {
      complete: () => {
        expect(count).to.equal([zero].length);
        done();
      },
      error: err => {},
      next: () => {
        count++;
      }
    };
    Observable.of<number>(zero)
      .subscribe(subscriber);
  });

  it('start should produce a hot observable', done => {
    Observable.start(observer => {
      done()
    });
  });

  it('throw should produce a cold observable that emits an error', done => {
    let error: Error = new Error('throw produce test');
    Observable.throw<void>(error)
      .subscribeOnError(err => {
        expect(err).to.equal(error);
        done();
      });
  });

  it('throw should complete after emitting the error', done => {
    let error: Error = new Error('throw complete test');
    let count: number = 0;
    let subscriber: Observer<void> = {
      complete: () => {
        expect(count).to.equal([error].length);
        done();
      },
      error: err => {
        count++;
      },
      next: () => {}
    };
    Observable.throw<void>(error)
      .subscribe(subscriber);
  });

  it('join should produce a deferred observable containing the subscriptions',
     done => {
       let zero: number = 0;
       let count: number = 0;
       let observable: Observable<number> = Observable.of<number>(zero);
       observable.join(observable)
         .subscribeOnNext(object => {
           expect(object).to.equal(zero);
           count++;
           if (count === [observable, observable].length) {
             done();
           }
         });
     });

  it('join should complete when all of its subscriptions complete', done => {
    let zero: number = 0;
    let count: number = 0;
    let observable: Observable<number> = Observable.of<number>(zero);
    let observer: Observer<number> = {
      complete: () => {
        expect(count).to.equal([observable, observable].length);
        done();
      },
      error: err => {},
      next: object => {
        expect(object).to.equal(zero);
        count++;
      }
    };
    observable.join(observable)
      .subscribe(observer);
  });

  it('map should produce a map subject', done => {
    let sequence: number[] = [1, 2, 3];
    let composition: number[] = [4, 5, 6];
    Observable.create<number>(observer => {
        sequence.forEach(object => {
          observer.next(object);
        });
      })
      .map<number>(object => {
        return object + 3;
      })
      .subscribeOnNext(object => {
        expect(composition.indexOf(object)).to.be.above(-1);
        composition.splice(composition.indexOf(object), 1);
        if (composition.length === 0) {
          done();
        }
      });
  });

});
