import {
  SET_TASK_DATA,
  CLEAR_TASK_DATA,
  SET_TASK_NAME,
  SET_MIN_PERIOD,
  SET_PASS_CRITERIA,
  SET_DESCRIPTION,
  SET_TABLE_NAME,
} from './ActionTypes';

export const setTaskData = (data) => ({
  type: SET_TASK_DATA,
  payload: data,
});

export const clearTaskData = () => ({
  type: CLEAR_TASK_DATA,
});

export const setTaskName = (taskName) => ({
  type: SET_TASK_NAME,
  payload: taskName,
});

export const setMinPeriod = (period) => ({
  type: SET_MIN_PERIOD,
  payload: period,
});

export const setPassCriteria = (criteria) => ({
  type: SET_PASS_CRITERIA,
  payload: criteria,
});

export const setDescription = (description) => ({
  type: SET_DESCRIPTION,
  payload: description,
});

export const setTableName = (tableName) => ({
  type: SET_TABLE_NAME,
  payload: tableName,
});
