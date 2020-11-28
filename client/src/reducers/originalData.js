import {
  SET_ORIGINAL_DATA,
  SET_SCHEMA_NAME,
  CLEAR_ORIGINAL_DATA,
} from '../actions/ActionTypes';

const initialState = {
  data: [],
  name: '',
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
    default:
      return state;
  }
}
