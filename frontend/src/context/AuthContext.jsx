import { useState, useEffect } from 'react';
import api from '../api/axios';
import { AuthContext } from '../hooks/useAuth.js';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar sesión al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/auth/perfil');
        if (res.data.success) {
          setUser(res.data.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.log(err);

        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Login: actualiza el estado global
  const login = (userData) => {
    setUser(userData);
  };

  // Logout: limpia cookies y estado
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Error al cerrar sesión:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('admin_user');
      localStorage.removeItem('cliente_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
