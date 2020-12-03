import {
  SET_ORIGINAL_DATA,
  SET_SCHEMA_NAME,
  CLEAR_ORIGINAL_DATA,
  SET_COLUMNS,
} from '../actions/ActionTypes';

const initialState = {
  data: [],
  name: '',
  columns: { '': '없음' },
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_ORIGINAL_DATA:
      return {
        ...state,
        data: payload,
      };
    case SET_SCHEMA_NAME:
      return {
        ...state,
        name: payload,
      };
    case CLEAR_ORIGINAL_DATA:
      return initialState;
    case SET_COLUMNS:
      return {
        ...state,
        columns: payload,
      };
    default:
      return state;
  }
}
