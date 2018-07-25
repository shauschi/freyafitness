'use strict';
import {createActions, handleActions} from 'redux-actions';
import {assignPath} from '../../utils/RamdaUtils';

const initialState = {
  show: false,
  variant: 'info',
  message: '',
  autoHideDuration: 5500
};

export const actions = createActions({
  NOTIFICATION: {
    SHOW: data => ({message: data.message, variant: data.variant, autoHideDuration: data.autoHideDuration}),
    HIDE: undefined
  }
});

export const showStickyNotification = (message, variant) =>
  dispatch => dispatch(actions.notification.show({message: message, variant: variant, autoHideDuration: undefined}));

export const showNotification = (message, variant) =>
  dispatch => dispatch(actions.notification.show({message: message, variant: variant, autoHideDuration: 1500}));

export const hideNotification = () =>
  dispatch => dispatch(actions.notification.hide());

export default handleActions({
  [actions.notification.show]: (state, {payload}) =>
    assignPath([], {show: true, variant: payload.variant, message: payload.message, autoHideDuration: payload.autoHideDuration}, state),
  [actions.notification.hide]: state =>
    assignPath([], {show: false, message: ''}, state),
}, initialState);
