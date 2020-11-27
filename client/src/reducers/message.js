import {
  SET_MESSAGE,
  CLEAR_MESSAGE,
  OPEN_ALERT,
  CLOSE_ALERT,
  SET_ALERT_TYPE,
} from '../actions/ActionTypes';

const initialState = {
  open: false,
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
      return { ...state, open: true };

    case CLOSE_ALERT:
      return { ...state, open: false };

    case SET_ALERT_TYPE:
      return { ...state, type: payload };
    default:
      return state;
  }
}
