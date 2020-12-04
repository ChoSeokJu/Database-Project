import {
  SET_TASK_DATA,
  CLEAR_TASK_DATA,
  SET_TASK_NAME,
  SET_MIN_PERIOD,
  SET_PASS_CRITERIA,
  SET_DESCRIPTION,
  SET_TABLE_NAME,
} from '../actions/ActionTypes';

const initialState = {
  data: [],
  taskName: '',
  minPeriod: '',
  passCriteria: '',
  description: '',
  tableName: '',
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_TASK_DATA:
      return {
        ...state,
        data: payload,
      };
    case CLEAR_TASK_DATA:
      return initialState;
    case SET_TASK_NAME:
      return {
        ...state,
        taskName: payload,
      };
    case SET_MIN_PERIOD:
      return {
        ...state,
        minPeriod: payload,
      };
    case SET_PASS_CRITERIA:
      return {
        ...state,
        passCriteria: payload,
      };
    case SET_DESCRIPTION:
      return {
        ...state,
        description: payload,
      };
    case SET_TABLE_NAME:
      return {
        ...state,
        tableName: payload,
      };
    default:
      return state;
  }
}
