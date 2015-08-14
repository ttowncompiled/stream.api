import {expect} from 'chai';
import {Scheduler} from '../../src/async';

describe('Scheduler', () => {

  it('should process the next subscription '
        + 'when there is no pending subscription',
     done => {
       new Scheduler().schedule(() => {
         done();
       });
     });

  it('should not process the next subscription '
        + 'until the pending subscription is finished',
     done => {
       let ticked: boolean = false;
       let scheduler: Scheduler = new Scheduler();
       scheduler.schedule(() => {
         ticked = true;
       });
       scheduler.schedule(() => {
         expect(ticked).to.be.true;
         done();
       });
     });

  it('should not attempt to process a subscription '
        + 'if there are no scheduled subscriptions',
     done => {
       new Scheduler().tick();
       done();
     });

  it('should process subscriptions asynchronously', done => {
    let flag: boolean = false;
    new Scheduler().schedule(() => {
      expect(flag).to.be.true;
      done();
    });
    flag = true;
  });

});
