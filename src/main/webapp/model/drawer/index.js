import {createActions, handleActions} from 'redux-actions';
import {togglePath} from "../../utils/RamdaUtils.jsx";

const initialState = {
  open: false
};

export const actions = createActions({
  TOGGLE_DRAWER: undefined
});

export const toggleDrawer = () => {
  return dispatch => dispatch(actions.toggleDrawer());
};

export default handleActions({
  [actions.toggleDrawer]: state => togglePath(['open'], state)
}, initialState)
