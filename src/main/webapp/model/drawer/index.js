import {createActions, handleActions} from 'redux-actions';
import {togglePath} from "../../utils/RamdaUtils";

const initialState = {
  open: false
};

export const actions = createActions({
  TOGGLE_DRAWER: undefined
});

export default handleActions({
  [actions.toggleDrawer]: state => togglePath(['open'], state)
}, initialState)
