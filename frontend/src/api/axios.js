import axios from 'axios';
import { refreshAccessToken } from '../utils/auth.js';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('admin_user');
  const user = raw ? JSON.parse(raw) : null;
  const token = user?.accessToken || null;

  if (token) config.headers.Authorization = `Bearer ${token}`;

  //console.log(config.headers.Authorization);

  return config;
});

// Response interceptor para manejar 401 y refrescar token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        error.config.headers['Authorization'] = `Bearer ${newToken}`;
        return api.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
