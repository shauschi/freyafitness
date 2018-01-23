import {createActions, handleActions} from 'redux-actions';
import {getOwnProfile} from '../../service/profile';
import {setPath, assignPath} from "../../utils/RamdaUtils.jsx";

const initialState = {
  oldPassword: undefined,
  newPassword: undefined,
  newPasswordConfirm: undefined
};

export const actions = createActions({
  PASSWORD: {
    CHANGE: {
      PENDING: undefined,
      SUCCESS: undefined,
      ERROR: error => error
    },
    MISSMATCH: undefined, // when newPassword != newPasswordConfirm
    CANGEL_CHANGE: undefined,
    CHANGING: (path, value) => ({path: path, value: value})
  }
});

export const changePassword = (oldPassword, newPassword, newPasswordConfirm) => {
  if (newPassword !== newPasswordConfirm) {
    return dispatch => dispatch(actions.password.missmatch);
  }

  const oldPasswordHashed = oldPassword;
  const newPasswordHashed = newPassword;
  const newPasswordConfirmHashed = newPasswordConfirm;

  return dispatch => {
    dispatch(actions.password.change.pending());
    return getOwnProfile(oldPasswordHashed, newPasswordHashed, newPasswordConfirmHashed)
      .then(profile => dispatch(actions.password.change.success(profile)))
      .catch(error => dispatch(actions.password.change.error(error)))
  }
};

export const onPasswordChange = (path, value) => {
  return dispatch => dispatch(actions.password.changing(path, value));
};

export const onCancelPasswordChange = () => {
  return dispatch => dispatch(actions.password.cancel());
};

export default handleActions({
  [actions.password.change.pending]: state => setPath(['pending'], true, state),
  [actions.password.change.success]: (state, {payload}) =>
    assignPath([], {pending: false, data: payload, errorMessage: null}, state),
  [actions.password.change.error]: (state, {payload}) =>
    assignPath([], {pending: false, errorMessage: payload.message}, state),
  [actions.password.cancelChange]: state =>
    assignPath([],
      {oldPassword: undefined, newPassword: undefined, newPasswordConfirm: undefined}, state)
  ,
  [actions.password.changing]: (state, {payload}) =>
    setPath([...payload.path], payload.value, state),
}, initialState);
