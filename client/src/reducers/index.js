import { combineReducers } from 'redux';
import authentication from './authentication';
import message from './message';
import taskData from './taskData';
import originalData from './originalData';

export default combineReducers({
  authentication,
  message,
  taskData,
  originalData,
});
