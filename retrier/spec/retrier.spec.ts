import { Retrier } from '../src/retrier';

describe('<< Package: retrier >>', () => {
  it('Should be defined.', () => {
    expect(Retrier).toBeDefined();
  });

  describe('Simple resolve test:', () => {
    it('Should return Promise.', () => {
      const cbToResolve = () => new Promise((resolve, reject) => resolve('Immediate resolve!'));
      const retrier = new Retrier(cbToResolve);
      expect(retrier.resolve() instanceof Promise).toBe(true);
    });

    it('Should resolve promise within provided callback.', async () => {
      const cbToResolve = () => new Promise((resolve, reject) => resolve('Immediate resolve!'));
      const retrier = new Retrier(cbToResolve);
      expect(await retrier.resolve()).toBe('Immediate resolve!');
    });
  });

  describe('Simple reject test:', () => {
    it('Should reject (error specified).', async () => {
      const cbToResolve = () => new Promise((resolve, reject) => reject(new Error('Immediate reject!')));
      const retrier = new Retrier(cbToResolve);
      let error;

      try {
        await retrier.resolve();
      } catch (e) {
        error = e;
      }

      expect(error.message).toBe('Immediate reject!');
    });

    it('Should reject (error not specified).', async () => {
      const cbToResolve = () => new Promise((resolve, reject) => reject());
      const retrier = new Retrier(cbToResolve);
      let error;

      try {
        await retrier.resolve();
      } catch (e) {
        error = e;
      }

      expect(error.message).toBe('Retry limit reached!');
    });
  });

  describe('Resolve with retrying:', () => {
    it('Should reject without retrying (wtihout specifying limit - default is 1).', async () => {
      const o = {} as any;
      o.cbToResolve = () => new Promise((resolve, reject) => reject(new Error('Immediate reject!')));
      spyOn(o, 'cbToResolve').and.callThrough();
      const retrier = new Retrier(o.cbToResolve);

      let error;
      try {
        await retrier.resolve();
      } catch (e) {
        error = e;
      }

      expect(o.cbToResolve.calls.count()).toBe(1);
    });

    it('Should reject with max retries (limit specified).', async () => {
      const o = {} as any;
      o.cbToResolve = () => new Promise((resolve, reject) => reject(new Error('Immediate reject!')));
      spyOn(o, 'cbToResolve').and.callThrough();
      const retrier = new Retrier(o.cbToResolve, { limit: 3 });

      let error;
      try {
        await retrier.resolve();
      } catch (e) {
        error = e;
      }

      expect(o.cbToResolve.calls.count()).toBe(3);
    });
  });
});
