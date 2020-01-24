import { deepValue } from '../src/deep-value';

describe('<< Package: deep-value >>', () => {
  it('Should be defined.', () => {
    expect(deepValue).toBeDefined();
  });

  it('Should throw error if not passing path to the property as string (second arg).', () => {
    let error;
    try {
      const value = deepValue({}, undefined);
    } catch (e) {
      error = e;
    }

    expect(error.message).toBe('Expecting path to the value to be string.');
  });

  describe('Testing value resolvings: ', () => {
    let testObj;
    beforeEach(() => {
      testObj = {
        a: null,
        b: undefined,
        c: NaN,
        d: '',
        e: 0,
        f: () => {},
        obj: {
          a: 'a',
          arr: [{ a: 'a' }, [2], null, undefined, NaN, '', 0]
        }
      };
    });

    describe('Array as source: ', () => {
      it('Case 1.', () => {
        expect(deepValue(testObj.obj.arr, '[0]')).toBe(testObj.obj.arr[0]);
      });

      it('Case 2.', () => {
        expect(deepValue(testObj.obj.arr, '[0].a')).toBe(testObj.obj.arr[0].a);
      });
    });

    describe('Object as source (extensive testing): ', () => {
      it('Case 1.', () => {
        expect(deepValue(testObj, 'a')).toBe(testObj.a);
      });

      it('Case 2.', () => {
        expect(deepValue(testObj, 'b')).toBe(testObj.b);
      });

      it('Case 3.', () => {
        expect(deepValue(testObj, 'c')).toEqual(testObj.c); // 'toEqual' instead of 'toBe' because NaN !== NaN xD
      });

      it('Case 4.', () => {
        expect(deepValue(testObj, 'd')).toBe(testObj.d);
      });

      it('Case 5.', () => {
        expect(deepValue(testObj, 'e')).toBe(testObj.e);
      });

      it('Case 6.', () => {
        expect(deepValue(testObj, 'obj')).toBe(testObj.obj);
      });

      it('Case 7.', () => {
        expect(deepValue(testObj, 'obj.a')).toBe(testObj.obj.a);
      });

      it('Case 8.', () => {
        expect(deepValue(testObj, 'obj.arr')).toBe(testObj.obj.arr);
      });

      it('Case 9.', () => {
        expect(deepValue(testObj, 'obj.arr[0]')).toBe(testObj.obj.arr[0]);
      });

      it('Case 10.', () => {
        expect(deepValue(testObj, 'obj.arr[0].a')).toBe(testObj.obj.arr[0].a);
      });

      it('Case 11.', () => {
        expect(deepValue(testObj, 'obj.arr[1][0]')).toBe(testObj.obj.arr[1][0]);
        expect(deepValue(testObj, 'obj.arr[1][0]')).toBe(2);
      });

      it('Case 12.', () => {
        expect(deepValue(testObj, 'obj.arr[2]')).toBe(null);
      });

      it('Case 13.', () => {
        expect(deepValue(testObj, 'obj.arr[3]')).toBe(undefined);
      });

      it('Case 14.', () => {
        expect(deepValue(testObj, 'obj.arr[4]')).toEqual(NaN);
      });

      it('Case 13.', () => {
        expect(deepValue(testObj, 'obj.arr[5]')).toBe('');
      });

      it('Case 13.', () => {
        expect(deepValue(testObj, 'obj.arr[6]')).toBe(0);
      });

      it('Case 14.', () => {
        expect(deepValue(testObj, 'obj.f')).toBe(testObj.obj.f);
      });
    });

    describe('Testing non-existing properties (should return undefined): ', () => {
      it('Case 1.', () => {
        expect(deepValue(testObj, '')).toBe(undefined);
      });

      it('Case 2.', () => {
        expect(deepValue(testObj, 'x')).toBe(undefined);
      });

      it('Case 3.', () => {
        expect(deepValue(testObj, 'obj.arr[0].a.x')).toBe(undefined);
      });

      it('Case 4.', () => {
        expect(deepValue(testObj, 'obj.arr[0].a.x[0]')).toBe(undefined);
      });

      it('Case 5.', () => {
        expect(deepValue(testObj, 'obj.arr[0].a.x[0].y')).toBe(undefined);
      });
    });

    describe('Testing invalid paths (should return undefined): ', () => {
      it('Case 1.', () => {
        expect(deepValue(testObj, 'obj,a')).toBe(undefined);
      });

      it('Case 2.', () => {
        expect(deepValue(testObj, 'obj/a')).toBe(undefined);
      });

      it('Case 3.', () => {
        expect(deepValue(testObj, 'obj.arr[]')).toBe(undefined);
      });

      it('Case 4.', () => {
        expect(deepValue(testObj, 'obj.arr.x[]')).toBe(undefined);
      });

      it('Case 5.', () => {
        expect(deepValue(testObj, 'obj.')).toBe(undefined);
      });
    });
  });
});
