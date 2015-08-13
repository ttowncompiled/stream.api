import { expect } from 'chai';
import { Scheduler } from '../../src/async';

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
