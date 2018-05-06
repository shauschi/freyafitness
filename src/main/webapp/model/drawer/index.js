import {createActions, handleActions} from 'redux-actions';
import {setPath, togglePath} from "../../utils/RamdaUtils";

const initialState = {
  open: false
};

export const actions = createActions({
  TOGGLE_DRAWER: undefined,
  CLOSE_DRAWER: undefined
});

export const toggleDrawer = () => {
  return dispatch => dispatch(actions.toggleDrawer());
};

export default handleActions({
  [actions.toggleDrawer]: state => togglePath(['open'], state),
  [actions.closeDrawer]: state => setPath(['open'], false, state)
}, initialState)
