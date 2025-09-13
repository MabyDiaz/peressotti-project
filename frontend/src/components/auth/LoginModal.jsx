import api from '../../api/axios.js';
import { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa6';
import { toast } from 'react-toastify';

const LoginModal = ({ open, onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    contrasena: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/clientes/login', formData);
      console.log('Resultado del login:', res.data);
      // Guardar tokens
      localStorage.setItem('accessToken', res.data.data.accessToken);
      localStorage.setItem('refreshToken', res.data.data.refreshToken);

      //toast.success('¡Inicio de sesión exitoso!');
      toast(res.data.message || 'Login exitoso');
      setFormData({ email: '', contrasena: '' });
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.log('Error login:', error.response?.data || error.message);
      toast(error.response?.data?.message || 'Error desconocido');
    }
  };

  if (!open) return null;

  return (
    <div className='modal-backdrop'>
      <div
        className='modal'
        style={{ maxWidth: '400px' }}>
        <h2
          className='text-xl font-bold mb-4'
          style={{ color: 'var(--dark)', textAlign: 'center' }}>
          Iniciar sesión
        </h2>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4'>
          {/* Email */}
          <div className='row flex items-center border rounded px-3 py-2 gap-2'>
            <FaUser />
            <input
              type='email'
              name='email'
              placeholder='Correo electrónico'
              value={formData.email}
              onChange={handleChange}
              required
              className='flex-1 outline-none'
            />
          </div>
          {/* Contraseña */}
          <div className='row flex items-center border rounded px-3 py-2 gap-2'>
            <FaLock />
            <input
              type='password'
              name='contrasena'
              placeholder='Contraseña'
              value={formData.contrasena}
              onChange={handleChange}
              required
              className='flex-1 outline-none'
            />
          </div>
          {/* Botón */}
          <div className='row button'>
            <input
              type='submit'
              value='Iniciar sesión'
              className='btn btn-primary w-full'
            />
          </div>
          {/* Link para registro */}
          <div className='signup-link text-center text-sm mt-2'>
            ¿No tenés cuenta?{' '}
            <a
              href='#'
              className='text-accent font-semibold hover:underline'
              onClick={() => {
                onClose();
                onSwitchToRegister();
              }}>
              Registrate
            </a>
          </div>
        </form>
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className='btn btn-danger mt-4 w-full'>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
