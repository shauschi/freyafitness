'use strict';
import {createActions, handleActions} from 'redux-actions';
import {assignPath} from "../../utils/RamdaUtils";

const initialState = {
  show: false,
  type: 'normal',
  message: '',
  authHideDuration: 1500
};

export const actions = createActions({
  NOTIFICATION: {
    SHOW: data => ({message: data.message, type: data.type, autoHideDuration: data.autoHideDuration}),
    HIDE: undefined
  }
});

export const showStickyNotification = (message, type) =>
  dispatch => dispatch(actions.notification.show({message: message, type: type, autoHideDuration: undefined}));

export const showNotification = (message, type) =>
  dispatch => dispatch(actions.notification.show({message: message, type: type, autoHideDuration: 1500}));

export const hideNotification = () =>
  dispatch => dispatch(actions.notification.hide());

export default handleActions({
  [actions.notification.show]: (state, {payload}) =>
    assignPath([], {show: true, type: payload.type, message: payload.message}, state),
  [actions.notification.hide]: state =>
    assignPath([], {show: false, message: ''}, state),
}, initialState);
