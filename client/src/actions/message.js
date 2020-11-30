import {
  SET_MESSAGE,
  CLEAR_MESSAGE,
  OPEN_ALERT,
  OPEN_DIALOG,
  CLOSE_ALERT,
  CLOSE_DIALOG,
  SET_ALERT_TYPE,
} from './ActionTypes';

export const setMessage = (message) => ({
  type: SET_MESSAGE,
  payload: message,
});

export const clearMessage = () => ({
  type: CLEAR_MESSAGE,
});

export const openAlert = () => ({
  type: OPEN_ALERT,
});

export const openDialog = () => ({
  type: OPEN_DIALOG,
});

export const closeAlert = () => ({
  type: CLOSE_ALERT,
});

export const closeDialog = () => ({
  type: CLOSE_DIALOG,
});

export const setAlertType = (messageType) => ({
  type: SET_ALERT_TYPE,
  payload: messageType,
});
