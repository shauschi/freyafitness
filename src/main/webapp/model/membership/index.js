import {createActions, handleActions} from 'redux-actions';
import {assignPath, setPath} from '../../utils/RamdaUtils';
import {showNotification} from "../notification";
import {createMembership as createMembershipApiCall} from "../../service/membership";

export const initialState = {
  create: {
    show: false,
    pending: false,
    errorMessage: '',
    data: {
      userId: null,
      membershipTypeId: null,
      validity: {
        from: null,
        to: null
      }
    }
  }
};

export const actions = createActions({
  CREATE_MEMBERSHIP: {
    SHOW: undefined,
    HIDE: undefined,
    ON_DATA_CHANGED: (path, value) => ({path: path, value: value}),
    SAVE: {
      PENDING: undefined,
      SUCCESS: membership => membership,
      ERROR: error => error
    }
  }
});

export const showCreateMembership = () =>
    dispatch => dispatch(actions.createMembership.show());

export const hideCreateMembership = () =>
    dispatch => dispatch(actions.createMembership.hide());

export const onCreateMembershipDataChanged = (path, value) =>
    dispatch => dispatch(actions.createMembership.onDataChanged(path, value));

export const createMembership = data =>
    dispatch => {
      dispatch(actions.createMembership.save.pending());
      return createMembershipApiCall(data)
        .then(membership => {
          dispatch(actions.createMembership.hide());
          dispatch(actions.createMembership.save.success());
          dispatch(showNotification('Mitgliedschaft angelegt', 'success'));
        })
        .catch(error=> dispatch(actions.createMembership.save.error(error.message)));
    };

export default handleActions({
  // create membership
  [actions.createMembership.show]: state => {
    const nextState = setPath(['create'], initialState.create, state);
    return setPath(['create', 'show'], true, nextState);
  },
  [actions.createMembership.hide]: state => setPath(['create', 'show'], false, state),
  [actions.createMembership.onDataChanged]: (state, {payload}) =>
    setPath(['create', 'data', ...payload.path], payload.value, state),

  [actions.createMembership.save.pending]: state => setPath(['create', 'pending'], true, state),
  [actions.createMembership.save.success]: state =>
    assignPath(['create'], {pending: false, errorMessage: ''}, state),
  [actions.createMembership.save.error]: (state, {payload}) =>
    assignPath(['create'], {pending: false, errorMessage: payload}, state),

}, initialState);
