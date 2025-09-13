import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', contrasena: '' });
  const [loading, setLoading] = useState(false);
  const { saveUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/admin/login', formData);

      if (res.data.success) {
        const { accessToken, refreshToken, usuario } = res.data.data;

        // Guardar tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // Guardar usuario con roles que vienen del backend
        const userData = {
          email: usuario.email,
          roles: usuario.roles, // <-- array, ej: ['ADMIN'] o ['DISENADOR']
          accessToken,
        };

        localStorage.setItem('admin_user', JSON.stringify(userData));
        saveUser(userData);

        toast.success(res.data.message || 'Inicio de sesión exitoso');

        navigate('/admin'); // Redirige al panel de admin
      } else {
        toast.error('Credenciales incorrectas');
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='bg-white p-6 rounded shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>
        <form
          className='flex flex-col gap-4'
          onSubmit={handleSubmit}>
          <input
            type='email'
            name='email'
            placeholder='Correo electrónico'
            value={formData.email}
            onChange={handleChange}
            required
            className='border px-3 py-2 rounded'
          />
          <input
            type='password'
            name='contrasena'
            placeholder='Contraseña'
            value={formData.contrasena}
            onChange={handleChange}
            required
            className='border px-3 py-2 rounded'
          />
          <button
            type='submit'
            disabled={loading}
            className='bg-red-600 text-white py-2 rounded hover:bg-red-700'>
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
