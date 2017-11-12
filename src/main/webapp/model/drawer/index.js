import {createActions, handleActions} from 'redux-actions';
import {getJobList} from '../../service/profile';

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
