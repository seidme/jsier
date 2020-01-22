import { Retrier } from '../src/retrier';

describe('<< Package: retrier >>', () => {
  it('Should be defined.', () => {
    expect(Retrier).toBeDefined();
  });

  it('Should throw error if not passing callback which returns Promise.', async () => {
    const cbToResolve = () => {};

    let error;
    try {
      await new Retrier().resolve(cbToResolve as any);
    } catch (e) {
      error = e;
    }

    expect(error.message).toBe('Expecting function which returns promise!');
  });

  describe('Simple resolve test:', () => {
    it('Should return Promise.', () => {
      const cbToResolve = () => new Promise((resolve, reject) => resolve('Resolved!'));
      const retrier = new Retrier();

      expect(retrier.resolve(cbToResolve) instanceof Promise).toBe(true);
    });

    it('Should resolve promise within provided callback.', async () => {
      const cbToResolve = () => new Promise((resolve, reject) => resolve('Resolved!'));
      const retrier = new Retrier();

      expect(await retrier.resolve(cbToResolve)).toBe('Resolved!');
    });
  });

  describe('Simple reject test:', () => {
    it('Should reject (error specified).', async () => {
      const cbToResolve = () => new Promise((resolve, reject) => reject(new Error('Rejected!')));

      const retrier = new Retrier();

      let error;
      try {
        await retrier.resolve(cbToResolve);
      } catch (e) {
        error = e;
      }

      expect(error.message).toBe('Rejected!');
    });

    it('Should reject (error not specified).', async () => {
      const cbToResolve = () => new Promise((resolve, reject) => reject());

      const retrier = new Retrier();

      let error;
      try {
        await retrier.resolve(cbToResolve);
      } catch (e) {
        error = e;
      }

      expect(error.message).toBe('Retry limit reached!');
    });
  });

  describe('Resolve with retrying (basic cases with/without specifying limit):', () => {
    it('Should reject without retrying (wtihout specifying limit - default is 1).', async () => {
      const o: any = {
        cbToResolve: () => new Promise((resolve, reject) => reject(new Error('Rejected!')))
      };
      spyOn(o, 'cbToResolve').and.callThrough();

      const retrier = new Retrier();

      let error;
      try {
        await retrier.resolve(o.cbToResolve);
      } catch (e) {
        error = e;
      }

      expect(error.message).toBe('Rejected!');
      expect(o.cbToResolve.calls.count()).toBe(1);
    });

    it('Should reject with max retries (limit specified).', async () => {
      const o: any = {
        cbToResolve: () => new Promise((resolve, reject) => reject(new Error('Rejected!')))
      };
      spyOn(o, 'cbToResolve').and.callThrough();

      const retrier = new Retrier({ limit: 3 });

      let error;
      try {
        await retrier.resolve(o.cbToResolve);
      } catch (e) {
        error = e;
      }

      expect(error.message).toBe('Rejected!');
      expect(o.cbToResolve.calls.count()).toBe(3);
    });

    it('Should resolve after 3rd attempt (limit specified to 5).', async () => {
      let counter = 0;
      const o: any = {
        cbToResolve: () => {
          return new Promise((resolve, reject) => {
            counter++;
            counter >= 3 ? resolve('Resolved!') : reject(new Error('Rejected!'));
          });
        }
      };
      spyOn(o, 'cbToResolve').and.callThrough();

      const retrier = new Retrier({ limit: 5 });

      let result;
      let error;
      try {
        result = await retrier.resolve(o.cbToResolve);
      } catch (e) {
        error = e;
      }

      expect(result).toBe('Resolved!');
      expect(o.cbToResolve.calls.count()).toBe(3);
    });
  });

  describe('Resolve with retrying (advanced cases where retrying is continued even when success response):', () => {
    it('Should keep retrying till reaching the limit.', async () => {
      const o: any = {
        cbToResolve: () => new Promise((resolve, reject) => resolve('Resolved!'))
      };
      spyOn(o, 'cbToResolve').and.callThrough();

      const retrier = new Retrier({ limit: 3, keepRetryingIf: (response, attempt) => true });

      let result;
      let error;
      try {
        result = await retrier.resolve(o.cbToResolve);
      } catch (e) {
        error = e;
      }

      expect(error.message).toBe('Retry limit reached!');
      expect(o.cbToResolve.calls.count()).toBe(3);
    });

    it('Should keep retrying till reaching the limit 2.', async () => {
      let counter = 0;
      const o: any = {
        cbToResolve: () => {
          return new Promise((resolve, reject) => {
            counter++;
            counter >= 3 ? resolve('Resolved!') : reject(new Error('Rejected!'));
          });
        }
      };
      spyOn(o, 'cbToResolve').and.callThrough();

      const retrier = new Retrier({ limit: 5, keepRetryingIf: (response, attempt) => true });

      let result;
      let error;
      try {
        result = await retrier.resolve(o.cbToResolve);
      } catch (e) {
        error = e;
      }

      expect(error.message).toBe('Retry limit reached!');
      expect(o.cbToResolve.calls.count()).toBe(5);
    });
  });

  describe('Resolve with retrying (advanced cases where retrying is stopped due to specific error):', () => {
    it('Should stop retrying after first attempt.', async () => {
      const o: any = {
        cbToResolve: () => new Promise((resolve, reject) => reject(new Error('Rejected!')))
      };
      spyOn(o, 'cbToResolve').and.callThrough();

      const retrier = new Retrier({
        limit: 5,
        stopRetryingIf: (error, attempt) => error.message === 'Rejected!'
      });

      let result;
      let error;
      try {
        result = await retrier.resolve(o.cbToResolve);
      } catch (e) {
        error = e;
      }

      expect(error.message).toBe('Rejected!');
      expect(o.cbToResolve.calls.count()).toBe(1);
    });

    it('Should stop retrying on 3rd attempt.', async () => {
      const o: any = {
        cbToResolve: () => new Promise((resolve, reject) => reject(new Error('Rejected!')))
      };
      spyOn(o, 'cbToResolve').and.callThrough();

      const retrier = new Retrier({ limit: 5, stopRetryingIf: (error, attempt) => attempt === 2 });

      let result;
      let error;
      try {
        result = await retrier.resolve(o.cbToResolve);
      } catch (e) {
        error = e;
      }

      expect(error.message).toBe('Rejected!');
      expect(o.cbToResolve.calls.count()).toBe(3);
    });
  });

  describe('Delays between attempts:', () => {
    // TODO..
  });
});
