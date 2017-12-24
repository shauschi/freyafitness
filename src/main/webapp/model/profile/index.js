import {createActions, handleActions} from 'redux-actions';
import {getOwnProfile} from '../../service/profile';

const initialState = {
  pending: false,
  data: undefined
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

export const fetchOwnProfile = (filterOptions) => {
  return dispatch => {
    dispatch(actions.profile.load.pending())
    return getOwnProfile(filterOptions)
      .then(profile => dispatch(actions.profile.load.success(profile)))
      .catch(error => dispatch(actions.profile.load.error(error)))
  }
};

export default handleActions({
  [actions.profile.load.pending]: (state, {payload}) => Object.assign(
    {}, state, {pending: true}
  ),
  [actions.profile.load.success]: (state, {payload}) => Object.assign(
    {}, state, {data: payload, pending: false}
  ),
  [actions.profile.load.error]: (state, {payload}) => Object.assign(
    {}, state, {pending: false, errorMessage: payload.message}
  )
}, initialState);
