import axios from 'axios';
import { getNewToken, logout } from './authApi';

const BASE_URL = 'http://localhost:8000';

const axiosConfig = {
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const api = axios.create(axiosConfig);

export const authenticatedApi = axios.create(axiosConfig);

authenticatedApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (e) => Promise.reject(e)
);

authenticatedApi.interceptors.response.use(
  (res) => res,
  async (e) => {
    const oldRes = e.config;

    if (e.response.status === 401 && !oldRes._retry) {
      oldRes._retry = true;

      try {
        const newToken = await getNewToken();
        oldRes.headers.Authorization = `Bearer ${newToken}`;
        return axios(oldRes);
      } catch (error) {
        logout();
      }
    }

    return Promise.reject(e);
  }
);
