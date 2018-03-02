import {createActions, handleActions} from 'redux-actions';
import {getOwnProfile, changeProfilePicture} from '../../service/profile';
import {setPath, assignPath} from "../../utils/RamdaUtils";

const initialState = {
  pending: false,
  data: {
    adress: {}
  }, // empty profile
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
  }
});

export const fetchOwnProfile = (filterOptions) => {
  return dispatch => {
    dispatch(actions.profile.load.pending());
    return getOwnProfile(filterOptions)
      .then(profile => dispatch(actions.profile.load.success(profile)))
      .catch(error => dispatch(actions.profile.load.error(error)))
  }
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
  [actions.profile.load.pending]: state => setPath(['pending'], true, state),
  [actions.profile.load.success]: (state, {payload}) =>
    assignPath([], {pending: false, data: payload, errorMessage: null}, state),
  [actions.profile.load.error]: (state, {payload}) =>
    assignPath([], {pending: false, errorMessage: payload.message}, state),
  [actions.profile.onProfileDetailsChange]: (state, {payload}) =>
    setPath(['data', ...payload.path], payload.value, state),

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
}, initialState);
