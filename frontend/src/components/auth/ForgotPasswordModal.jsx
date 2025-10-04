import { useState } from 'react';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import api from '../../api/axios';

const ForgotPasswordModal = ({ open, onClose, onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Por favor ingresa tu email');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      toast.success(
        res.data.message || 'Si el email existe, recibirás un enlace.'
      );
      onClose();
      onBackToLogin();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || 'Error al solicitar restablecimiento'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/70 z-50'>
      <div className='bg-white p-6 rounded shadow w-96'>
        <h3 className='bg-red-600 text-white text-sm font-bold mb-4 text-center p-2 rounded uppercase'>
          ¿Olvidaste tu contraseña?
        </h3>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4'>
          <p className='text-sm text-gray-700 text-center mb-4'>
            Ingresa tu email y te enviaremos un enlace para restablecerla.
          </p>

          <div className='row flex items-center px-3 py-2 gap-2 rounded-md bg-gray-100 shadow-sm border border-gray-300 text-sm'>
            <FaEnvelope className='text-gray-600' />
            <input
              type='email'
              placeholder='Correo electrónico'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='flex-1 text-gray-700 border-none focus:outline-none placeholder-gray-400'
            />
          </div>

          <div className='flex justify-between mt-2'>
            <button
              type='button'
              onClick={() => {
                onClose();
                onBackToLogin();
              }}
              className='bg-gray-600 hover:bg-gray-700 text-white text-xs uppercase font-bold p-2 rounded transition-colors duration-200 w-1/2 mr-2 flex items-center justify-center'>
              <FaArrowLeft className='mr-1' /> Volver
            </button>
            <button
              type='submit'
              disabled={loading}
              className='bg-red-600 hover:bg-red-700 text-white text-xs uppercase font-bold p-2 rounded transition-colors duration-200 w-1/2 ml-2'>
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
