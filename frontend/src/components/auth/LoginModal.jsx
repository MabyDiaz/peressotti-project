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
    <div className='fixed inset-0 flex items-center justify-center bg-black/70'>
      <div className='bg-white p-6 rounded shadow w-96'>
        <h2 className='bg-red-600 text-white text-sm font-bold mb-4 text-center p-2 rounded uppercase'>
          Iniciar sesión
        </h2>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4'>
          {/* Email */}
          <div className='row flex items-center border border-gray-800 rounded px-3 py-2 gap-2'>
            <FaUser className='text-gray-600' />
            <input
              type='email'
              name='email'
              placeholder='Correo electrónico'
              value={formData.email}
              onChange={handleChange}
              required
              className='flex-1 outline-none  placeholder-gray-400'
            />
          </div>
          {/* Contraseña */}
          <div className='row flex items-center border border-gray-800 rounded px-3 py-2 gap-2'>
            <FaLock className='text-gray-600' />
            <input
              type='password'
              name='contrasena'
              placeholder='Contraseña'
              value={formData.contrasena}
              onChange={handleChange}
              required
              className='flex-1   placeholder-gray-400'
            />
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
          {/* Link para login */}
          <div className='signup-link text-center text-gray-800 text-sm mt-2'>
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
        {/* Botón de cerrar */}

        {/* <button
          onClick={onClose}
          className='btn btn-danger mt-4 w-full'>
          Cerrar
        </button> */}
      </div>
    </div>
  );
};

export default LoginModal;
