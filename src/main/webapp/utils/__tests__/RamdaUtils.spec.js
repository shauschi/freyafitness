import {setPath, assignPath, togglePath} from './../RamdaUtils.jsx';

describe('courses reducer', () => {

  let state;

  beforeEach(() => {
    state = {
      hello: 'world',
      foo: {
        bar: true,
        bar2: true
      },
      data: {
        test: ['one', 'two', 'three']
      }
    }
  });

  describe('test setPath', () => {

    it('should override the existing state without a given path', () => {
      const nextState = setPath([], 'override all', state);
      const expectedState = 'override all';
      expect(nextState).toEqual(expectedState);
    });

    it('should set the value along path to the new value', () => {
      const nextState = setPath(['foo'], {newBar: true}, state);
      const expectedState = {
        hello: 'world',
        foo: {
          newBar: true
        },
        data: {
          test: ['one', 'two', 'three']
        }
      };
      expect(nextState).toEqual(expectedState);
    });

    it('should set the value along path with array index to the new value', () => {
      const nextState = setPath(['data', 'test', 1], 'new two', state);
      const expectedState = {
        hello: 'world',
        foo: {
          bar: true,
          bar2: true
        },
        data: {
          test: ['one', 'new two', 'three']
        }
      };
      expect(nextState).toEqual(expectedState);
    });
  });

  describe('test assignPath', () => {

    it('should add the new value along path to the existing object', () => {
      const nextState = assignPath(['foo'], {newBar: true}, state);
      const expectedState = {
        hello: 'world',
        foo: {
          bar: true,
          bar2: true,
          newBar: true
        },
        data: {
          test: ['one', 'two', 'three']
        }
      };
      expect(nextState).toEqual(expectedState);
    });
  });

  describe('test togglePath', () => {

    it('should add the new value along path to the existing object', () => {
      const nextState = togglePath(['foo', 'bar'], state);
      const expectedState = {
        hello: 'world',
        foo: {
          bar: false,
          bar2: true
        },
        data: {
          test: ['one', 'two', 'three']
        }
      };
      expect(nextState).toEqual(expectedState);
    });
  });

});
