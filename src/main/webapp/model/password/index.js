import {createActions, handleActions} from 'redux-actions';
import {getOwnProfile} from '../../service/profile';
import {setPath, assignPath} from "../../utils/RamdaUtils.jsx";

const initialState = {
  pending: false,
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

export const changePassword = (oldPassword, newPassword, newPasswordConfirm) => {
  if (newPassword !== newPasswordConfirm) {
    return dispatch => dispatch(
      actions.password.error({message: 'Die beiden neuen Passwörter stimmen nicht überein.'}));
  } else {
    return dispatch => dispatch(
      actions.password.error({message: 'TODO: Noch nicht implementiert.'}));
  }

  /*
  const oldPasswordHashed = oldPassword;
  const newPasswordHashed = newPassword;
  const newPasswordConfirmHashed = newPasswordConfirm;

  return dispatch => {
    dispatch(actions.password.change.pending());
    return getOwnProfile(oldPasswordHashed, newPasswordHashed, newPasswordConfirmHashed)
      .then(profile => dispatch(actions.password.change.success(profile)))
      .catch(error => dispatch(actions.password.change.error(error)))
  }
  */
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
  [actions.password.change.success]: (state, {payload}) =>
    assignPath([], {pending: false, data: payload, errorMessage: null}, state),
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
