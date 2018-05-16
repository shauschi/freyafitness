'use strict';
import {createActions, handleActions} from 'redux-actions';
import {setPath, assignPath} from "../../utils/RamdaUtils";
import {
  changePassword as changePasswordApiCall
} from "../../service/password";
import {
  showNotification
} from './../notification';

const initialState = {
  open: false,
  pending: false,
  message: undefined,
  show: false,
  errorMessage: undefined,
  oldPassword: '',
  newPassword: '',
  newPasswordConfirm: ''
};

export const actions = createActions({
  PASSWORD: {
    CHANGE: {
      PENDING: undefined,
      SUCCESS: undefined,
    },
    ERROR: error => error,
    OPEN: undefined,
    CANCEL: undefined,
    CHANGING: (path, value) => ({path: path, value: value})
  }
});

export const changePassword = (changePasswordData) =>
  dispatch => {
    dispatch(actions.password.change.pending());
    return changePasswordApiCall(changePasswordData)
      .then(answer => {
        dispatch(actions.password.change.success());
        dispatch(showNotification(answer.message));
      })
      .catch(error => dispatch(actions.password.error(error)));
  };

export const onPasswordChange = (path, value) => {
  return dispatch => dispatch(actions.password.changing(path, value));
};

export const onOpenPasswordChange = () => {
  return dispatch => dispatch(actions.password.open());
};

export const onCancelPasswordChange = () => {
  return dispatch => dispatch(actions.password.cancel());
};

export default handleActions({
  [actions.password.change.pending]: state => setPath(['pending'], true, state),
  [actions.password.change.success]: state =>
    assignPath([], {pending: false, open: false, errorMessage: null}, state),
  [actions.password.error]: (state, {payload}) =>
    assignPath([], {pending: false, errorMessage: payload.message}, state),
  [actions.password.open]: state =>
    setPath(['open'], true, state)
  ,
  [actions.password.cancel]: state =>
    assignPath([],
      {
        open: false,
        oldPassword: '',
        newPassword: '',
        newPasswordConfirm: ''
      }, state)
  ,
  [actions.password.changing]: (state, {payload}) =>
    setPath([...payload.path], payload.value, state),
}, initialState);
