import axios from 'axios';
import download from 'downloadjs';
import authHeader from './auth-header';

const API_URL = '/api/user/';

const downloadFile = (user, url, params = {}) =>
  axios
    .get(`${API_URL}${user}${url}`, {
      headers: authHeader(),
      params,
      responseType: 'blob',
    })
    .then((blob) => {
      const fileName = blob.headers['content-disposition'].split('"')[1];
      download(blob.data, fileName);
    })
    .catch((error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
    });

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

const downloadAdmin = (url, params = {}) => downloadFile('admin', url, params);

const getEval = (url, params = {}) =>
  axios.get(`${API_URL}eval${url}`, {
    headers: authHeader(),
    params,
  });

const downloadEval = (url, params = {}) => downloadFile('eval', url, params);

const getSubmit = (url, params = {}) =>
  axios.get(`${API_URL}submit${url}`, {
    headers: authHeader(),
    params,
  });

const downloadSubmit = (url, params = {}) =>
  downloadFile('submit', url, params);

const postAdmin = (url, data) =>
  axios.post(`${API_URL}admin${url}`, data, { headers: authHeader() });

const postEval = (url, data) =>
  axios.post(`${API_URL}eval${url}`, data, { headers: authHeader() });

const postSubmit = (url, data) =>
  axios.post(`${API_URL}submit${url}`, data, { headers: authHeader() });

const postSubmitUpload = (url, form) =>
  axios.post(`${API_URL}submit${url}`, form, {
    header: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });

export {
  getUser,
  postUser,
  getAdmin,
  downloadAdmin,
  getEval,
  downloadEval,
  getSubmit,
  downloadSubmit,
  postAdmin,
  postEval,
  postSubmit,
  postSubmitUpload,
};
