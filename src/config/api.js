
import axios from 'axios';
const DEPLOYED='https://pear-poised-hen.cyclic.app/'
const LOCALHOST='http://49.206.253.146:2109/'

export const API_BASE_URL = LOCALHOST;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// const token = localStorage.getItem('jwt');
const wt=localStorage.getItem("wt");
const wtt=localStorage.getItem("wtt");
api.defaults.headers.common['wt'] = `${wt}`;
api.defaults.headers.common['wtt'] = `${wtt}`;
// api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

api.defaults.headers.post['Content-Type'] = 'application/json';

export default api;
