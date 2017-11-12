import reducer, {actions} from '../';

describe('Drawer reducer', () => {

  let state;

  beforeEach(() => {
    state = {
      open: false
    }
  });

  describe('with TOGGLE_DRAWER action', () => {

    it('should set open to true when false, and back', () => {
      const nextState = reducer(state, actions.toggleDrawer());

      const expectedState = Object.assign({}, state, {open: true});

      expect(nextState).toEqual(expectedState);
    });
  });

});
