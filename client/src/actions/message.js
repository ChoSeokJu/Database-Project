import {
  SET_MESSAGE,
  CLEAR_MESSAGE,
  OPEN_ALERT,
  CLOSE_ALERT,
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

export const closeAlert = () => ({
  type: CLOSE_ALERT,
});

export const setAlertType = (messageType) => ({
  type: SET_ALERT_TYPE,
  payload: messageType,
});
