'use strict';
import {createActions, handleActions} from 'redux-actions';
import cookie from 'react-cookies';
import {
  getOwnProfile,
  changeProfilePicture,
  login as loginApiCall,
  createAccount as createAccountApiCall,
  getAllUsers as getAllUsersApiCall
} from '../../service/profile';
import {
  actions as drawerActions
} from './../drawer';
import {setPath, assignPath} from '../../utils/RamdaUtils';
import init from './../init.js';

const initialState = {
  pending: false,
  user: undefined,
  users: {
    lastUpdate: undefined,
    pending: false,
    data: []
  },
  picture: {
    dialog: {
      open: false
    },
    temp: {
      dataUrl: undefined,
      file: undefined
    },
    pending: false,
    errorMessage: undefined
  },
  loginRef: undefined,
  login: {
    pending: false,
    error: undefined,
    data: {
      email: undefined,
      password: undefined
    }
  },
  createAccount: {
    data: {
      firstname: undefined,
      lastname: undefined,
      email: undefined,
      password: undefined,
      matchingPassword: undefined
    }
  }
};

export const actions = createActions({
  PROFILE: {
    LOAD: {
      PENDING: undefined,
      SUCCESS: profile => profile,
      ERROR: error => error
    },
    ON_PROFILE_DETAILS_CHANGE: (path, value) => ({path: path, value: value}),
    PICTURE: {
      RESET: undefined,
      DIALOG: {
        OPEN: undefined,
        CLOSE: undefined
      },
      CHANGE_TEMP: temp => temp,
      SAVE: {
        PENDING: undefined,
        SUCCESS: undefined,
        ERROR: error => error
      }
    }
  },
  USERS: {
    PENDING: undefined,
    UPDATED: timestamp => timestamp,
    ERROR: error => error,
    SUCCESS: users => users
  },
  LOGIN: {
    PENDING: undefined,
    ERROR: error => error,
    SUCCESS: undefined,
    DATA_CHANGED: (id, value) => ({id: id, value: value}),
  },
  LOGOUT: {
    SUCCESS: undefined,
    ERROR: error => error,
  },
  SET_LOGIN_REF: ref => ref,
  CREATE_ACCOUNT: {
    PENDING: undefined,
    SUCCESS: profile => profile,
    ERROR: error => error,
    DATA_CHANGED: (id, value) => ({id: id, value: value}),
  }
});

export const setLoginRef = (ref) => {
  return dispatch => dispatch(actions.setLoginRef(ref));
};

export const scrollToLogin = () => {
  return (dispatch, getState) => {
    const loginRef = getState().profile.loginRef;
    loginRef.scrollIntoView({behaviour: 'smooth', block: 'start'});
  }
};

export const login = loginData =>
  dispatch => {
    dispatch(actions.login.pending());
    return loginApiCall(loginData)
      .then(() => {
        dispatch(actions.login.success());
        init(dispatch);
    })
      .catch(() => dispatch(actions.login.error("Ungültige Kombination aus E-Mail und Passwort")));
  };

export const loginDataChanged = (id, value) =>
  dispatch => dispatch(actions.login.dataChanged(id, value));

export const createAccount = (createData) =>
  dispatch => {
    dispatch(actions.createAccount.pending());
    return createAccountApiCall(createData)
      .then(profile => {
        dispatch(actions.createAccount.success());
        dispatch(actions.profile.load.success(profile));
      })
      .catch(error => dispatch(actions.createAccount.error(error)));
  };

export const createAccountDataChanged = (id, value) =>
  dispatch => dispatch(actions.createAccount.dataChanged(id, value));

export const logout = () => {
  return dispatch => {
    cookie.save('tokenData', undefined, {path: '/'});
    dispatch(drawerActions.closeDrawer());
    dispatch(actions.logout.success());
  }
};

export const updateUsers = () => {
  return (dispatch, getState) => {
    if (getState().profile.users.lastUpdate) {
      return; // TODO update every other call/day
    }
    dispatch(actions.users.updated('foo'));
    dispatch(actions.users.pending());
    getAllUsersApiCall()
      .then(users => dispatch(actions.users.success(users)))
      .catch(error => dispatch(actions.users.error(error)));
  };
};

export const fetchOwnProfile = (filterOptions) =>
  dispatch => {
    dispatch(actions.profile.load.pending());
    return getOwnProfile(filterOptions)
      .then(profile => dispatch(actions.profile.load.success(profile)))
      .catch(error => dispatch(actions.profile.load.error(error)))
  };

export const onProfileDetailsChange = (path, value) => {
  return dispatch => dispatch(actions.profile.onProfileDetailsChange(path, value));
};

export const openProfilePictureChangeDialog = () => {
  return dispatch => {
    dispatch(actions.profile.picture.reset());
    dispatch(actions.profile.picture.dialog.open());
  }
};

export const closeProfilePictureChangeDialog = () => {
  return dispatch => dispatch(actions.profile.picture.dialog.close());
};

export const changeTempProfilePicture = temp => {
  return dispatch => dispatch(actions.profile.picture.changeTemp(temp));
};

export const saveProfilePicture = file => {
  return dispatch => {
    dispatch(actions.profile.picture.save.pending());
    return changeProfilePicture(file)
      .then(() => {
        dispatch(actions.profile.picture.save.success());
        dispatch(actions.profile.picture.dialog.close());
      })
      .catch(error => dispatch(actions.profile.picture.save.error(error)))
  }
};

export default handleActions({
  [actions.login.pending]: state => assignPath(['login'], {pending: true, error: undefined}, state),
  [actions.login.success]: state => assignPath(['login'], {pending: false, error: undefined}, state),
  [actions.login.error]: (state, {payload}) => assignPath(['login'], {pending: false, error: payload}, state),
  [actions.logout.success]: state =>
    assignPath([], {user: undefined, error: undefined}, state),
  [actions.logout.error]: (state, {payload}) => setPath(['error'], payload, state),

  [actions.profile.load.pending]: state => setPath(['pending'], true, state),
  [actions.profile.load.success]: (state, {payload}) =>
    assignPath([], {pending: false, user: payload, errorMessage: null}, state),
  [actions.profile.load.error]: (state, {payload}) =>
    assignPath([], {pending: false, errorMessage: payload.message}, state),
  [actions.profile.onProfileDetailsChange]: (state, {payload}) =>
    setPath(['user', ...payload.path], payload.value, state),

  [actions.profile.picture.reset]: state =>
    setPath(['picture'], initialState.picture, state),
  [actions.profile.picture.dialog.open]: state =>
    setPath(['picture', 'dialog', 'open'], true, state),
  [actions.profile.picture.dialog.close]: state =>
    setPath(['picture', 'dialog', 'open'], false, state),
  [actions.profile.picture.changeTemp]: (state, {payload}) =>
    setPath(['picture', 'temp'], payload, state),
  [actions.profile.picture.save.pending]: state =>
    setPath(['picture', 'pending'], true, state),
  [actions.profile.picture.save.success]: state =>
    assignPath(['picture'], {pending: false, errorMessage: undefined}, state),
  [actions.profile.picture.save.error]: (state, {payload}) =>
    setPath(['picture', 'errorMessage'], payload.message, state),
  [actions.setLoginRef]: (state, {payload}) =>
    setPath(['loginRef'], payload, state),

  [actions.login.dataChanged]: (state, {payload}) =>
    setPath(['login', 'data', payload.id], payload.value, state),
  [actions.createAccount.dataChanged]: (state, {payload}) =>
    setPath(['createAccount', 'data', payload.id], payload.value, state),
  [actions.createAccount.pending]: state =>
    assignPath(['createAccount'], {pending: true, error: undefined}, state),
  [actions.createAccount.success]: state =>
    assignPath(['createAccount'], {pending: false, error: undefined}, state),
  [actions.createAccount.error]: (state, {payload}) =>
    assignPath(['createAccount'], {pending: false, error: payload}, state),

  [actions.users.pending]: state =>
    assignPath(['users'], {pending: true, error: undefined}, state),
  [actions.users.updated]: (state, {payload}) =>
    assignPath(['users'], {lastUpdate: payload}, state),
  [actions.users.success]: (state, {payload}) =>
    assignPath(['users'], {pending: false, data: payload, error: undefined}, state),
  [actions.users.error]: state =>
    assignPath(['users'], {pending: false, error: error}, state),
}, initialState);
