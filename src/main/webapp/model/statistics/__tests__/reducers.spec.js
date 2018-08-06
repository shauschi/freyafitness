import reducer, {actions} from '../';

describe('statistics reducer', () => {

  let state;

  beforeEach(() => {
    state = {
      pending: false,
      error: null,
      lastUpdate: null,
      data: {
        userId: null,
        favouriteCourseTypeId: null,
        favouriteCourseParticipations: null,
        participationsPerMonth: {}
      }
    }
  });

  describe('with PENDING action', () => {

    it('should only set state to pending', () => {
      const nextState = reducer(state, actions.statistics.load.pending());

      const expectedState = Object.assign({}, state, {pending: true});

      expect(nextState).toEqual(expectedState);
    });
  });

  describe('with SUCCESS action', () => {

    it('should set pending to false and update current statistics list', () => {
      const expected = [{id: 'course1'}, {id: 'course2'}];
      const nextState = reducer(state, actions.statistics.load.success(expected));

      const expectedState = Object.assign({}, state, {pending: false, data: expected});

      expect(nextState.pending).toEqual(false);
      expect(nextState.data).toEqual(expected);
      expect(nextState.lastUpdate).not.toBeNull();
    });
  });

  describe('with ERROR action', () => {

    it('should set pending to false and update error message', () => {
      const error = new Error('Oops, something went wrong!');
      const nextState = reducer(state, actions.statistics.load.error(error));

      const expectedState = Object.assign({}, state, {pending: false, error: error.message});

      expect(nextState).toEqual(expectedState);
    });
  });

});
