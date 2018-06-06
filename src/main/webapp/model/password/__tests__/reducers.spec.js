import reducer, {actions} from '../';

describe('password reducer', () => {

  let state;

  beforeEach(() => {
    state = {
      pending: false,
      errorMessage: null,
      open: false
    }
  });

  describe('with PENDING action', () => {

    it('should only set state to pending', () => {
      const nextState = reducer(state, actions.password.change.pending());

      const expectedState = Object.assign({}, state, {pending: true});

      expect(nextState).toEqual(expectedState);
    });
  });

  describe('with SUCCESS action', () => {

    it('should set pending to false and update current profile list', () => {
      const nextState = reducer(state, actions.password.change.success());

      const expectedState = Object.assign({}, state, {pending: false});

      expect(nextState).toEqual(expectedState);
    });
  });

  describe('with ERROR action', () => {

    it('should set pending to false and update error message', () => {
      const error = new Error('Oops, something went wrong!');
      const nextState = reducer(state, actions.password.error(error));

      const expectedState = Object.assign({}, state, {pending: false, errorMessage: error.message});

      expect(nextState).toEqual(expectedState);
    });
  });

});
