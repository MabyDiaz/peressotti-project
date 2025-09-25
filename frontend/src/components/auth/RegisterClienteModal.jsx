import { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa6';
import api from '../../api/axios.js';
import { toast } from 'react-toastify';

const RegisterClienteModal = ({ open, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    contrasena: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', formData);
      toast.success(res.data.message || '¡Registro exitoso!');
      setFormData({
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        contrasena: '',
      });

      onClose();
      onSwitchToLogin();
    } catch (error) {
      console.log(
        'Error registro cliente:',
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || 'Error desconocido');
    }
  };

  if (!open) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/70'>
      <div className='bg-white p-6 rounded shadow w-96'>
        <h3 className='bg-red-600 text-white text-sm font-bold mb-4 text-center p-2 rounded uppercase'>
          Registrarse
        </h3>

        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4'>
          {/* Nombre */}
          <div className='row flex items-center px-3 py-2 gap-2 rounded-md bg-gray-100 shadow-sm border border-gray-300 focus:outline-none text-sm'>
            <FaUser className='text-gray-600' />
            <input
              type='text'
              name='nombre'
              placeholder='Nombre'
              value={formData.nombre}
              onChange={handleChange}
              required
              className='flex-1 text-gray-700 border-none focus:outline-none focus:ring-0 text-sm placeholder-gray-400 '
            />
          </div>

          {/* Apellido */}
          <div className='row flex items-center px-3 py-2 gap-2 rounded-md bg-gray-100 shadow-sm border border-gray-300 focus:outline-none text-sm'>
            <FaUser className='text-gray-600' />
            <input
              type='text'
              name='apellido'
              placeholder='Apellido'
              value={formData.apellido}
              onChange={handleChange}
              required
              className='flex-1 text-gray-700 border-none focus:outline-none focus:ring-0 text-sm placeholder-gray-400'
            />
          </div>

          {/* Teléfono */}
          <div className='row flex items-center px-3 py-2 gap-2 rounded-md bg-gray-100 shadow-sm border border-gray-300 focus:outline-none text-sm'>
            <FaPhone className='text-gray-600' />
            <input
              type='text'
              name='telefono'
              placeholder='Teléfono'
              value={formData.telefono}
              onChange={handleChange}
              required
              className='flex-1 text-gray-700 border-none focus:outline-none focus:ring-0 text-sm placeholder-gray-400'
            />
          </div>

          {/* Email */}
          <div className='row flex items-center px-3 py-2 gap-2 rounded-md bg-gray-100 shadow-sm border border-gray-300 focus:outline-none text-sm'>
            <FaEnvelope className='text-gray-600' />
            <input
              type='email'
              name='email'
              placeholder='Correo electrónico'
              value={formData.email}
              onChange={handleChange}
              required
              className='flex-1 text-gray-700 border-none focus:outline-none focus:ring-0 text-sm placeholder-gray-400'
            />
          </div>

          {/* Contraseña */}
          <div className='row flex items-center px-3 py-2 gap-2 rounded-md bg-gray-100 shadow-sm border border-gray-300 focus:outline-none text-sm'>
            <FaLock className='text-gray-600' />
            <input
              type='password'
              name='contrasena'
              placeholder='Contraseña'
              value={formData.contrasena}
              onChange={handleChange}
              required
              className='flex-1 text-gray-700 border-none focus:outline-none focus:ring-0 text-sm placeholder-gray-400'
            />
          </div>

          {/* Botones */}
          <div className='flex justify-between mt-2'>
            <button
              type='submit'
              className='bg-red-600 hover:bg-red-700 text-white text-xs uppercase font-bold p-2 rounded transition-colors duration-200 w-1/2 mr-2'>
              Registrarse
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
            ¿Ya tenés cuenta?{' '}
            <a
              href='#'
              className='text-red-600 font-semibold hover:underline'
              onClick={() => {
                onClose();
                onSwitchToLogin();
              }}>
              Iniciar sesión
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterClienteModal;
