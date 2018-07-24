import {createActions, handleActions} from 'redux-actions';
import {getMembershipTypes} from '../../service/membershiptypes';
import {setPath, assignPath} from '../../utils/RamdaUtils';

const initialState = {
  pending: false,
  data: []
};

export const actions = createActions({
  MEMBERSHIP_TYPES: {
    LOAD: {
      PENDING: undefined,
      SUCCESS: news => news,
      ERROR: error => error
    }
  }
});

export const fetchMembershipTypes = (filterOptions) => {
  return dispatch => {
    dispatch(actions.membershipTypes.load.pending());
    return getMembershipTypes(filterOptions)
      .then(courseTypes => dispatch(actions.membershipTypes.load.success(courseTypes)))
      .catch(error => dispatch(actions.membershipTypes.load.error(error)))
  }
};

export default handleActions({
  [actions.membershipTypes.load.pending]: state => setPath(['pending'], true, state),
  [actions.membershipTypes.load.success]: (state, {payload}) =>
    assignPath([], {pending: false, data: payload, errorMessage: null}, state),
  [actions.membershipTypes.load.error]: (state, {payload}) =>
    assignPath([], {pending: false, errorMessage: payload.message}, state),
}, initialState);
