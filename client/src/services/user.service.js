import axios from 'axios';
import authHeader from './auth-header';

const API_URL = '/api/user/';

const getUser = (url, params = {}) =>
  axios.get(`${API_URL}all${url}`, {
    headers: authHeader(),
    params,
  });

const postUser = (url, data) =>
  axios.post(`${API_URL}all${url}`, data, { headers: authHeader() });
// only for Mypage. Don't use this for other purpose.

const getAdmin = (url, params = {}) =>
  axios.get(`${API_URL}admin${url}`, {
    headers: authHeader(),
    params,
  });

const getAdminBlob = (url, params = {}) =>
  axios.get(`${API_URL}admin${url}`, {
    headers: authHeader(),
    params,
    responseType: 'blob',
  });

const getEval = (url, params = {}) =>
  axios.get(`${API_URL}eval${url}`, {
    headers: authHeader(),
    params,
  });

const getEvalBlob = (url, params = {}) =>
  axios.get(`${API_URL}eval${url}`, {
    headers: authHeader(),
    params,
    responseType: 'blob',
  });

const getSubmit = (url, params = {}) =>
  axios.get(`${API_URL}submit${url}`, {
    headers: authHeader(),
    params,
  });

const postAdmin = (url, data) =>
  axios.post(`${API_URL}admin${url}`, data, { headers: authHeader() });

const postEval = (url, data) =>
  axios.post(`${API_URL}eval${url}`, data, { headers: authHeader() });

const postSubmit = (url, data) =>
  axios.post(`${API_URL}submit${url}`, data, { headers: authHeader() });

export {
  getUser,
  postUser,
  getAdmin,
  getAdminBlob,
  getEval,
  getSubmit,
  postAdmin,
  postEval,
  postSubmit,
  getEvalBlob,
};
