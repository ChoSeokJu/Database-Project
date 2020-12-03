import { SET_TASK_DATA, CLEAR_TASK_DATA } from '../actions/ActionTypes';

const initialState = {
  data: [],
  taskName: '',
  minPeriod: '',
  passCriteria: '',
  description: '',
};

export const SET_TASK_NAME = 'SET_TASK_NAME';
export const SET_MIN_PERIOD = 'SET_MIN_PERIOD';
export const SET_PASS_CRITERIA = 'SET_PASS_CRITERIA';
export const SET_DESCRIPTION = 'SET_DESCRIPTION';

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
    default:
      return state;
  }
}
