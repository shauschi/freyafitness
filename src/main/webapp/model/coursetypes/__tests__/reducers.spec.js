import reducer, {actions} from '../';

describe('coursetypes reducer', () => {

  let state;

  beforeEach(() => {
    state = {
      pending: false,
      errorMessage: null,
      data: undefined
    }
  });

  describe('with PENDING action', () => {

    it('should only set state to pending', () => {
      const nextState = reducer(state, actions.courseTypes.load.pending());

      const expectedState = Object.assign({}, state, {pending: true});

      expect(nextState).toEqual(expectedState);
    });
  });

  describe('with SUCCESS action', () => {

    it('should set pending to false and update current courseTypes list', () => {
      const expected = [{id: 'course1'}, {id: 'course2'}];
      const nextState = reducer(state, actions.courseTypes.load.success(expected));

      const expectedState = Object.assign({}, state, {pending: false, data: expected});

      expect(nextState).toEqual(expectedState);
    });
  });

  describe('with ERROR action', () => {

    it('should set pending to false and update error message', () => {
      const error = new Error('Oops, something went wrong!');
      const nextState = reducer(state, actions.courseTypes.load.error(error));

      const expectedState = Object.assign({}, state, {pending: false, errorMessage: error.message});

      expect(nextState).toEqual(expectedState);
    });
  });

});
