'use strict';
import {createActions, handleActions} from 'redux-actions';
import {assignPath} from "../../utils/RamdaUtils";

const initialState = {
  show: false,
  type: 'normal',
  message: ''
};

export const actions = createActions({
  NOTIFICATION: {
    SHOW: (message, type) => ({message: message, type: type}),
    HIDE: undefined
  }
});

export const showNotification = (message, type) =>
  dispatch => dispatch(actions.notification.show(message, type));

export const hideNotification = () =>
  dispatch => dispatch(actions.notification.hide());

export default handleActions({
  [actions.notification.show]: (state, {payload}) =>
    assignPath([], {show: true, type: payload.type, message: payload.message}, state),
  [actions.notification.hide]: state =>
    assignPath([], {show: false, message: ''}, state),
}, initialState);
