import {expect} from 'chai';
import {Generator} from '../../src/core';
import {ColdObservable} from '../../src/async/observable';

describe('Cold Observable', () => {

  it('should call its generator for each new subscriber', done => {
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

  it('should trigger complete notifications', done => {
    new ColdObservable<void>(observer => {
        observer.complete();
      })
      .subscribeOnComplete(() => {
        done();
      });
  });

  it('should trigger error notifications', done => {
    let sequence: number[] = [1, 2, 3];
    new ColdObservable<number>(observer => {
        sequence.forEach(object => {
          observer.error(object);
        });
      })
      .subscribeOnError(object => {
        expect(sequence.indexOf(object)).to.be.above(-1);
        sequence.splice(sequence.indexOf(object), 1);
        if (sequence.length === 0) {
          done();
        }
      });
  });

  it('should trigger next notifications', done => {
    let sequence: number[] = [1, 2, 3];
    new ColdObservable<number>(observer => {
        sequence.forEach(object => {
          observer.next(object);
        });
      })
      .subscribeOnNext(object => {
        expect(sequence.indexOf(object)).to.be.above(-1);
        sequence.splice(sequence.indexOf(object), 1);
        if (sequence.length === 0) {
          done();
        }
      });
  });

  it('should pass its reference on complete', done => {
    let observable: ColdObservable<void> =
        new ColdObservable<void>(observer => {
          observer.complete();
        });
    observable.subscribeOnComplete(subscription => {
      expect(subscription).to.equal(observable);
      done();
    });
  });

  it('should trigger notifications asynchronously', done => {
    let flag: boolean = false;
    let completeFlag: boolean = false;
    let errorFlag: boolean = false;
    let nextFlag: boolean = false;
    new ColdObservable<void>(observer => {
        observer.complete();
      })
      .subscribeOnComplete(() => {
        expect(flag).to.be.true;
        completeFlag = true;
        if (completeFlag && errorFlag && nextFlag) {
          done();
        }
      });
    new ColdObservable<void>(observer => {
        observer.error(null);
      })
      .subscribeOnError(() => {
        expect(flag).to.be.true;
        errorFlag = true;
        if (completeFlag && errorFlag && nextFlag) {
          done();
        }
      });
    new ColdObservable<void>(observer => {
        observer.next();
      })
      .subscribeOnNext(() => {
        expect(flag).to.be.true;
        nextFlag = true;
        if (completeFlag && errorFlag && nextFlag) {
          done();
        }
      });
    flag = true;
  });

  it('should throw an error if subscribed to after being disposed', done => {
    let cb: Generator<void> = observer => observer.complete();
    let observable: ColdObservable<void> = new ColdObservable<void>(cb);
    observable.dispose();
    expect(observable.isDisposed).to.be.true;
    try {
      observable.subscribe(null);
    } catch (err) {
      done();
    }
  });

  it('should throw an error if its generator calls complete after completing',
     done => {
       let cb: Generator<void> = observer => {
         observer.complete();
         try {
           observer.complete();
         } catch (err) {
           done();
         }
       };
       new ColdObservable<void>(cb).subscribeOnComplete(() => {});
     });

  it('should throw an error if its generator calls error after completing',
     done => {
       let cb: Generator<void> = observer => {
         observer.complete();
         try {
           observer.error(null);
         } catch (err) {
           done();
         }
       };
       new ColdObservable<void>(cb).subscribeOnComplete(() => {});
     });

  it('should throw an error if its generator calls next after completing',
     done => {
       let cb: Generator<void> = observer => {
         observer.complete();
         try {
           observer.next();
         } catch (err) {
           done();
         }
       };
       new ColdObservable<void>(cb).subscribeOnComplete(() => {});
     });

  it('should catch any error thrown inside of its generator', done => {
    new ColdObservable<void>(observer => {
      throw new Error('cold generator catch test');
    }).subscribeOnError(err => done());
  });

});
