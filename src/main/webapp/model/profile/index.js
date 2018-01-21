import {createActions, handleActions} from 'redux-actions';
import {getOwnProfile} from '../../service/profile';
import {setPath, assignPath} from "../../utils/RamdaUtils.jsx";

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
  [actions.profile.load.pending]: state => setPath(['pending'], true, state),
  [actions.profile.load.success]: (state, {payload}) =>
    assignPath([], {pending: false, data: payload, errorMessage: null}, state),
  [actions.profile.load.error]: (state, {payload}) =>
    assignPath([], {pending: false, errorMessage: payload.message}, state)
}, initialState);
