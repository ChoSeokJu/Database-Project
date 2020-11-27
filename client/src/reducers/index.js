import { combineReducers } from 'redux';
import authentication from './authentication';
import message from './message';
import taskData from './taskData';

export default combineReducers({
  authentication,
  message,
  taskData,
});
