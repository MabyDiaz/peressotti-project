import { useState, useEffect } from 'react';
import { FaUser, FaLock } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth.js';
import api from '../../api/axios.js';

const LoginModal = ({
  open,
  onClose,
  onSwitchToRegister,
  onOpenForgotPassword,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    contrasena: '',
  });

  const { login, setUser } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await login(formData, '/auth/loginCliente');
      if (success) {
        setFormData({ email: '', contrasena: '' });
        onClose();
      }
    } catch (error) {
      console.log('Error login:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error desconocido');
    }
  };

  // === Google Sign-In ===
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            // Enviar token al backend
            await api.post(
              '/auth/google',
              { token: response.credential },
              { withCredentials: true }
            );

            // Obtener perfil del backend
            const perfil = await api.get('/auth/perfil', {
              withCredentials: true,
            });

            // Actualizar contexto Auth si existe
            if (setUser) {
              setUser(perfil.data.data);
            }

            toast.success('¡Inicio de sesión con Google exitoso!');
            onClose();
          } catch (err) {
            console.error('Error en login con Google:', err);
            toast.error('Error al iniciar sesión con Google');
          }
        },
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
    }
  }, [onClose, setUser]);

  if (!open) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/70'>
      <div className='bg-white p-6 rounded shadow w-96'>
        <h2 className='bg-red-600 text-white text-sm font-bold mb-4 text-center p-2 rounded uppercase'>
          Iniciar sesión
        </h2>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4'>
          {/* Email */}
          <div className='row flex items-center px-3 py-2 gap-2 rounded-md bg-gray-100 shadow-sm border border-gray-300 text-sm'>
            <FaUser className='text-gray-600' />
            <input
              type='email'
              name='email'
              placeholder='Correo electrónico'
              value={formData.email}
              onChange={handleChange}
              required
              className='flex-1 text-gray-700 border-none focus:outline-none placeholder-gray-400'
            />
          </div>

          {/* Contraseña + enlace "¿Olvidaste tu contraseña?" */}
          <div className='flex flex-col gap-1'>
            <div className='row flex items-center px-3 py-2 gap-2 rounded-md bg-gray-100 shadow-sm border border-gray-300 text-sm'>
              <FaLock className='text-gray-600' />
              <input
                type='password'
                name='contrasena'
                placeholder='Contraseña'
                value={formData.contrasena}
                onChange={handleChange}
                required
                className='flex-1 text-gray-700 border-none focus:outline-none placeholder-gray-400'
              />
            </div>
            <button
              type='button'
              onClick={() => {
                onClose();
                onOpenForgotPassword?.();
              }}
              className='self-end text-xs text-red-600 hover:underline mr-2'>
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <div className='flex justify-between mt-2'>
            <button
              type='submit'
              className='bg-red-600 hover:bg-red-700 text-white text-xs uppercase font-bold p-2 rounded transition-colors duration-200 w-1/2 mr-2'>
              Iniciar sesión
            </button>
            <button
              type='button'
              onClick={onClose}
              className='bg-gray-600 text-xs hover:bg-gray-700 text-white font-bold uppercase p-2 rounded transition-colors duration-200 w-1/2 ml-2'>
              Cerrar
            </button>
          </div>

          {/* Botón de Google */}
          <div
            id='googleSignInDiv'
            className='mt-4'></div>

          {/* Link para registro */}
          <div className='signup-link text-center text-gray-800 text-xs mt-2'>
            ¿No tenés cuenta?{' '}
            <a
              href='#'
              className='text-red-600 font-semibold hover:underline'
              onClick={() => {
                onClose();
                onSwitchToRegister();
              }}>
              Registrate
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
