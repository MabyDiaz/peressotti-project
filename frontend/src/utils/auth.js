import api from '../api/axios.js';
import { getLogout } from './logoutManager';

// Función para refrescar token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    const response = await api.post('/refresh', { token: refreshToken });
    const { accessToken } = response.data.data;

    const rawUser = localStorage.getItem('admin_user');
    const user = rawUser ? JSON.parse(rawUser) : {};
    user.accessToken = accessToken;
    localStorage.setItem('admin_user', JSON.stringify(user));

    return accessToken;
  } catch (err) {
    console.log('Error refrescando token', err);

    const logoutFn = getLogout();
if (logoutFn) logoutFn();
    return null;
  }
};
