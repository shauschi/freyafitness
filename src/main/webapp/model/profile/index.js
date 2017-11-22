import {createActions, handleActions} from 'redux-actions';
import {getProfile} from '../../service/profile';

const initialState = {
  pending: false,
  current: undefined
};

export const actions = createActions({
  PROFILE: {
    LOAD: {
      PENDING: undefined,
      SUCCESS: profile => profile,
      ERROR: error => error
    }
  }
});

export const fetchProfile = (filterOptions) => {
  return dispatch => {
    dispatch(actions.profile.load.pending())
    return getProfile(filterOptions)
      .then(profile => dispatch(actions.profile.load.success(profile)))
      .catch(error => dispatch(actions.profile.load.error(error)))
  }
};

export default handleActions({
  [actions.profile.load.pending]: (state, {payload}) => Object.assign(
    {}, state, {pending: true}
  ),
  [actions.profile.load.success]: (state, {payload}) => Object.assign(
    {}, state, {current: payload, pending: false}
  ),
  [actions.profile.load.error]: (state, {payload}) => Object.assign(
    {}, state, {pending: false, errorMessage: payload.message}
  )
}, initialState);
