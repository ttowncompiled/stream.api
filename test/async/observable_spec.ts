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

  it('publish should produce a hot observable', done => {
    Observable.publish(observer => {
      done()
    });
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
