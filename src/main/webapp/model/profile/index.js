'use strict';
import {createActions, handleActions} from 'redux-actions';
import cookie from 'react-cookies';
import {
  getOwnProfile,
  changeProfilePicture,
  login as loginApiCall,
  createAccount as createAccountApiCall,
  getAllUsers as getAllUsersApiCall,
  passwordForgotten as passwordForgottenApiCall,
  resetPassword as resetPasswordApiCall,
} from '../../service/profile';
import {updatePreference as updatePreferenceApiCall} from '../../service/preferences';
import {
  actions as drawerActions
} from './../drawer';
import {setPath, assignPath, viewPath} from '../../utils/RamdaUtils';
import init from './../init.js';
import {showNotification} from "../notification";

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
  showLogin: true,
  loginRef: undefined,
  shouldScrollToLogin: false,
  login: {
    pending: false,
    error: undefined,
    data: {
      email: "",
      password: ""
    }
  },
  passwordForgotten: {
    show: false,
    data: {
      email: undefined
    }
  },
  resetPassword: {
    show: false,
    data: {
      password: undefined,
      matchingPassword: undefined
    }
  },
  createAccount: {
    data: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      matchingPassword: "",
      acceptAgb: false
    }
  },
  updatePreference: {
    pending: false,
    error: undefined
  }
};

export const actions = createActions({
  SHOW_LOGIN: undefined,
  SHOW_REGISTRATION: undefined,
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
  PASSWORD_FORGOTTEN: {
    SHOW: undefined,
    HIDE: undefined,
    PENDING: undefined,
    SUCCESS: message => message,
    ERROR: error => error,
    DATA_CHANGED: (id, value) => ({id: id, value: value}),
  },
  RESET_PASSWORD: {
    SHOW: undefined,
    HIDE: undefined,
    PENDING: undefined,
    SUCCESS: message => message,
    ERROR: error => error,
    DATA_CHANGED: (id, value) => ({id: id, value: value}),
  },
  SET_LOGIN_REF: ref => ref,
  SHOULD_SCROLL_TO_LOGIN: shouldScroll => shouldScroll,
  CREATE_ACCOUNT: {
    PENDING: undefined,
    SUCCESS: profile => profile,
    ERROR: error => error,
    DATA_CHANGED: (id, value) => ({id: id, value: value}),
  },
  UPDATE_PREFERENCE: {
    SAVE: {
      PENDING: undefined,
      SUCCESS: answer => answer,
      ERROR: error => error
    }
  }
});

export const setLoginRef = (ref) => {
  return (dispatch, getState) => {
    dispatch(actions.setLoginRef(ref));
    if (getState().profile.shouldScrollToLogin) {
      const loginRef = getState().profile.loginRef;
      loginRef.scrollIntoView({behaviour: 'smooth', block: 'start'});
      dispatch(actions.shouldScrollToLogin(false));
    }
  }
};

export const scrollToLogin = router => {
  return (dispatch, getState) => {
    const loginRef = getState().profile.loginRef;
    if (router.history.location.pathname === '/' && !!loginRef) {
      loginRef.scrollIntoView({behaviour: 'smooth', block: 'start'});
    } else {
      dispatch(actions.shouldScrollToLogin(true));
      router.history.push('/');
    }
  }
};

export const showLogin = () =>
  dispatch => dispatch(actions.showLogin());

export const showRegistration = () =>
  dispatch => dispatch(actions.showRegistration());

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
      .then(answer => {
        dispatch(actions.createAccount.success());
        dispatch(showNotification(answer.message, "success"));
        dispatch(actions.showLogin());
      })
      .catch(error => dispatch(actions.createAccount.error(error)));
  };

export const createAccountDataChanged = (id, value) =>
  dispatch => dispatch(actions.createAccount.dataChanged(id, value));

export const showPasswordForgotten = () =>
  dispatch => dispatch(actions.passwordForgotten.show());

export const hidePasswordForgotten = () =>
  dispatch => dispatch(actions.passwordForgotten.hide());

export const passwordForgotten = (data) =>
  dispatch => {
    dispatch(actions.passwordForgotten.pending());
    return passwordForgottenApiCall(data)
      .then(() => {
        dispatch(actions.passwordForgotten.success());
        dispatch(showNotification("Wir haben dir eine Mail geschickt.", "success"));
      })
      .catch(error => dispatch(actions.passwordForgotten.error(error)));
  };

export const passwordForgottenDataChanged = (id, value) =>
  dispatch => dispatch(actions.passwordForgotten.dataChanged(id, value));

export const resetPassword = (data) =>
  dispatch => {
    dispatch(actions.resetPassword.pending());
    return resetPasswordApiCall(data)
      .then(() => {
        dispatch(actions.resetPassword.success());
        dispatch(showNotification("Deine Passwort wurde zurückgesetzt.", "success"));
      })
      .catch(error => dispatch(actions.resetPassword.error(error)));
  };

export const resetPasswordDataChanged = (id, value) =>
  dispatch => dispatch(actions.resetPassword.dataChanged(id, value));

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

export const updatePreference = data =>
  dispatch => {
    dispatch(actions.updatePreference.save.pending());
    return updatePreferenceApiCall(data)
      .then(() => {
        dispatch(actions.updatePreference.save.success(data));
      })
      .catch(error => dispatch(actions.updatePreference.save.error(error.message)));
  };

const updateUserPreferences = (state, preference) => {
  const preferences = viewPath(['user', 'preferences'], state);
  for (const idx in preferences) {
    if (preferences[idx].key === preference.key) {
      preferences[idx] = preference;
      return setPath(['user', 'preferences'], preferences, state);
    }
  }
  preferences.push(preference);
  return setPath(['user', 'preferences'], preferences, state);
};

export default handleActions({
  [actions.showLogin]: state => setPath(['showLogin'], true, state),
  [actions.showRegistration]: state => setPath(['showLogin'], false, state),

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

  // profile picture
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
  [actions.shouldScrollToLogin]: (state, {payload}) =>
    setPath(['shouldScrollToLogin'], payload, state),
  [actions.login.dataChanged]: (state, {payload}) =>
    setPath(['login', 'data', payload.id], payload.value, state),

  // create account
  [actions.createAccount.dataChanged]: (state, {payload}) =>
    setPath(['createAccount', 'data', payload.id], payload.value, state),
  [actions.createAccount.pending]: state =>
    assignPath(['createAccount'], {pending: true, error: undefined}, state),
  [actions.createAccount.success]: state =>
    assignPath(['createAccount'], {pending: false, error: undefined, data: initialState.createAccount.data}, state),
  [actions.createAccount.error]: (state, {payload}) =>
    assignPath(['createAccount'], {pending: false, error: payload.message}, state),

  // password forgotten
  [actions.passwordForgotten.show]: state =>
    setPath(['passwordForgotten', 'show'], true, state),
  [actions.passwordForgotten.hide]: state =>
    setPath(['passwordForgotten', 'show'], false, state),
  [actions.passwordForgotten.dataChanged]: (state, {payload}) =>
    setPath(['passwordForgotten', 'data', payload.id], payload.value, state),
  [actions.passwordForgotten.pending]: state =>
    assignPath(['passwordForgotten'], {pending: true, error: undefined}, state),
  [actions.passwordForgotten.success]: state =>
    assignPath(['passwordForgotten'], {pending: false, error: undefined, show:false}, state),
  [actions.passwordForgotten.error]: (state, {payload}) =>
    assignPath(['passwordForgotten'], {pending: false, error: payload.message}, state),

  // reset password
  [actions.resetPassword.show]: state =>
    setPath(['resetPassword', 'show'], true, state),
  [actions.resetPassword.hide]: state =>
    setPath(['resetPassword', 'show'], false, state),
  [actions.resetPassword.dataChanged]: (state, {payload}) =>
    setPath(['resetPassword', 'data', payload.id], payload.value, state),
  [actions.resetPassword.pending]: state =>
    assignPath(['resetPassword'], {pending: true, error: undefined}, state),
  [actions.resetPassword.success]: state =>
    assignPath(['resetPassword'], {pending: false, error: undefined}, state),
  [actions.resetPassword.error]: (state, {payload}) =>
    assignPath(['resetPassword'], {pending: false, error: payload.message}, state),

  // load users
  [actions.users.pending]: state =>
    assignPath(['users'], {pending: true, error: undefined}, state),
  [actions.users.updated]: (state, {payload}) =>
    assignPath(['users'], {lastUpdate: payload}, state),
  [actions.users.success]: (state, {payload}) =>
    assignPath(['users'], {pending: false, data: payload, error: undefined}, state),
  [actions.users.error]: state =>
    assignPath(['users'], {pending: false, error: error}, state),

  // save preferences
  [actions.updatePreference.save.pending]: state =>
    assignPath(['updatePreference'], {pending: true, error: undefined}, state),
  [actions.updatePreference.save.success]: (state, {payload}) => {
    const updatedState = assignPath(['updatePreference'], {pending: false, error: undefined}, state);
    return updateUserPreferences(state, payload);
  },
  [actions.updatePreference.save.error]: state =>
    assignPath(['updatePreference'], {pending: false, error: error}, state),

}, initialState);
