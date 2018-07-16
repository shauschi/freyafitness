import reducer, {actions} from '../';

describe('contact reducer', () => {

  let state;

  beforeEach(() => {
    state = {
      pending: false,
      errorMessage: '',
      data: {}
    }
  });

  describe('with PENDING action', () => {

    it('should only set state to pending', () => {
      const nextState = reducer(state, actions.contact.send.pending());

      const expectedState = Object.assign({}, state, {pending: true});

      expect(nextState).toEqual(expectedState);
    });
  });

  describe('with SUCCESS action', () => {

    it('should set pending to false and update current news list', () => {
      const expected = {message: 'success'};
      const nextState = reducer(state, actions.contact.send.success(expected));

      const expectedState = Object.assign({}, state, {pending: false, data: {}});

      expect(nextState).toEqual(expectedState);
    });
  });

  describe('with ERROR action', () => {

    it('should set pending to false and update error message', () => {
      const error = new Error('Oops, something went wrong!');
      const nextState = reducer(state, actions.contact.send.error(error));

      const expectedState = Object.assign({}, state, {pending: false, errorMessage: error.message});

      expect(nextState).toEqual(expectedState);
    });
  });

});
