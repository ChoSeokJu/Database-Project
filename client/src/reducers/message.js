import {
  SET_MESSAGE,
  CLEAR_MESSAGE,
  OPEN_ALERT,
  CLOSE_ALERT,
  SET_ALERT_TYPE,
  OPEN_DIALOG,
  CLOSE_DIALOG,
} from '../actions/ActionTypes';

const initialState = {
  openAlert: false,
  openDialog: false,
  type: 'success',
  message: '',
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_MESSAGE:
      return { ...state, message: payload };

    case CLEAR_MESSAGE:
      return { ...state, message: '' };

    case OPEN_ALERT:
      return { ...state, openAlert: true };

    case OPEN_DIALOG:
      return { ...state, openDialog: true };

    case CLOSE_ALERT:
      return { ...state, openAlert: false };

    case CLOSE_DIALOG:
      return { ...state, openDialog: false };

    case SET_ALERT_TYPE:
      return { ...state, type: payload };
    default:
      return state;
  }
}
