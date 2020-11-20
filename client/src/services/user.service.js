import axios from 'axios';
import authHeader from './auth-header';

const API_URL = '/api/user/';

const getEvalBoard = () =>
  axios.get(`${API_URL}eval`, { headers: authHeader() });

const getSubmitBoard = () =>
  axios.get(`${API_URL}submit`, { headers: authHeader() });

const getAdminBoard = () =>
  axios.get(`${API_URL}admin`, { headers: authHeader() });

export default {
  getEvalBoard,
  getSubmitBoard,
  getAdminBoard,
};
