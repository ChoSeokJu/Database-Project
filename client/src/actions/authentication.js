/* eslint-disable no-use-before-define */
import axios from 'axios';
import {
  AUTH_REGISTER,
  AUTH_REGISTER_SUCCESS,
  AUTH_REGISTER_FAILURE,
} from './ActionTypes';

export function registerRequest(req) {
  return (dispatch) => {
    dispatch(register());

    return axios
      .post('/api/account/signup', req)
      .then(() => {
        dispatch(registerSuccess());
      })
      .catch((error) => {
        dispatch(registerFailure(error.response.data.code));
      });
  };
}

export function register() {
  return {
    type: AUTH_REGISTER,
  };
}

export function registerSuccess() {
  return {
    type: AUTH_REGISTER_SUCCESS,
  };
}

export function registerFailure(error) {
  return {
    type: AUTH_REGISTER_FAILURE,
    error,
  };
}
