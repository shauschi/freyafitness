import reducer, {actions} from '../';

describe('profile reducer', () => {

  let state;

  beforeEach(() => {
    state = {
      pending: false,
      errorMessage: null,
      current: undefined
    }
  });

  describe('with PENDING action', () => {

    it('should only set state to pending', () => {
      const nextState = reducer(state, actions.profile.load.pending());

      const expectedState = Object.assign({}, state, {pending: true});

      expect(nextState).toEqual(expectedState);
    });
  });

  describe('with SUCCESS action', () => {

    it('should set pending to false and update current profile list', () => {
      const expected = {firstname: 'Testee', lastname: 'Foobar'};
      const nextState = reducer(state, actions.profile.load.success(expected));

      const expectedState = Object.assign({}, state, {pending: false, current: expected});

      expect(nextState).toEqual(expectedState);
    });
  });

  describe('with ERROR action', () => {

    it('should set pending to false and update error message', () => {
      const error = new Error('Oops, something went wrong!');
      const nextState = reducer(state, actions.profile.load.error(error));

      const expectedState = Object.assign({}, state, {pending: false, errorMessage: error.message});

      expect(nextState).toEqual(expectedState);
    });
  });

});
