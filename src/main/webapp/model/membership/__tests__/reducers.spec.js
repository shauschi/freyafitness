import reducer, {actions, initialState} from '../';
import {setPath} from './../../../utils/RamdaUtils'

describe('membership reducer', () => {

  let state;

  beforeEach(() => {
    state = initialState
  });

  describe('with CREATE_MEMBERSHIP.SHOW action', () => {

    it('should only set state to show: true', () => {
      const nextState = reducer(state, actions.createMembership.show());

      const expectedState = setPath(['create', 'show'], true, state);

      expect(nextState).toEqual(expectedState);
    });
  });

  describe('with CREATE_MEMBERSHIP.HIDE action', () => {

    it('should only set state to show: true', () => {
      let nextState = reducer(state, actions.createMembership.show());
      nextState = reducer(nextState, actions.createMembership.hide());

      const expectedState = setPath(['create', 'show'], false, state);

      expect(nextState).toEqual(expectedState);
    });
  });

  describe('with CREATE_MEMBERSHIP.ON_DATA_CHANGED action', () => {

    it('should only set state to show: true', () => {
      const nextState = reducer(nextState, actions.createMembership.onDataChanged(['any', 'path'], 'foo'));

      const expectedState = setPath(['create', 'data', 'any', 'path'], 'foo', state);

      expect(nextState).toEqual(expectedState);
    });
  });

});
