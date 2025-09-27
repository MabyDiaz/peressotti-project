import { useEffect, useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../hooks/useAuth.js';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/auth/perfil');
        setUser(res.data.data);
      } catch (err) {
        if (err.response?.status === 401) {
          // Usuario no autenticado, sesión no iniciada
          setUser(null);
        } else {
          console.error('Error en checkAuth:', err);
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // 🔹 Login: cliente o admin
  const login = async (credentials, endpoint = '/auth/loginCliente') => {
    try {
      const res = await api.post(endpoint, credentials);
      if (res.data.success) {
        setUser(res.data.data);
        toast.success(res.data.message || 'Login exitoso');
        return true;
      } else {
        toast.error(res.data.message || 'Error de login');
        return false;
      }
    } catch (err) {
      console.error('Error login:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Error desconocido');
      return false;
    }
  };

  // 🔹 Logout
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Error logout:', err.response?.data || err.message);
    } finally {
      setUser(null);
      toast.success('Sesión cerrada');
    }
  };

  const saveUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, loading, saveUser }}>
      {children}
    </AuthContext.Provider>
  );
};
