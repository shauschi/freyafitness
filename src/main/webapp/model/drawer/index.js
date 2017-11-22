import {createActions, handleActions} from 'redux-actions';

const initialState = {
  open: false
};

export const actions = createActions({
  TOGGLE_DRAWER: undefined
});

export default handleActions({
  [actions.toggleDrawer]: (state, {payload}) => Object.assign(
    {}, state, {open: !state.open}
  )
}, initialState)
