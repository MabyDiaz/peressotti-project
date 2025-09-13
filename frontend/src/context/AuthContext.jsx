import React, { useState } from 'react';
import { AuthContext } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { setExternalLogout } from '../utils/logoutManager';

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('admin_user');
    return raw ? JSON.parse(raw) : null;
  });

  const saveUser = (data) => {
    localStorage.setItem('admin_user', JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    // Eliminar todo del localStorage
    localStorage.removeItem('admin_user');
    localStorage.removeItem('cliente_user');
    localStorage.removeItem('refresh_token');

    // Limpiar estado
    setUser(null);

    // Redirigir según la ruta actual
    if (window.location.pathname.startsWith('/admin')) {
      navigate('/admin/login');
  } else {
    navigate('/');
  }
  };

  setExternalLogout(logout);

  return (
    <AuthContext.Provider value={{ user, saveUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
