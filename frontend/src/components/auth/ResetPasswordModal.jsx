import { useState, useEffect } from 'react';
import { FaLock, FaArrowLeft } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPasswordModal = ({ open, onClose }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const t = searchParams.get('token');
    if (t) {
      setToken(t);
    } else {
      toast.error('Enlace inválido');
      onClose();
    }
  }, [searchParams, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', {
        token,
        newPassword: password,
      });
      toast.success(res.data.message || 'Contraseña actualizada correctamente');
      onClose();
      navigate('/'); // o a login
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || 'Error al restablecer la contraseña'
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
          Nueva Contraseña
        </h3>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4'>
          <div className='row flex items-center px-3 py-2 gap-2 rounded-md bg-gray-100 shadow-sm border border-gray-300 text-sm'>
            <FaLock className='text-gray-600' />
            <input
              type='password'
              placeholder='Nueva contraseña'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='flex-1 text-gray-700 border-none focus:outline-none placeholder-gray-400'
            />
          </div>
          <div className='row flex items-center px-3 py-2 gap-2 rounded-md bg-gray-100 shadow-sm border border-gray-300 text-sm'>
            <FaLock className='text-gray-600' />
            <input
              type='password'
              placeholder='Confirmar contraseña'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='flex-1 text-gray-700 border-none focus:outline-none placeholder-gray-400'
            />
          </div>

          <div className='flex justify-between mt-2'>
            <button
              type='button'
              onClick={() => {
                onClose();
                navigate('/');
              }}
              className='bg-gray-600 hover:bg-gray-700 text-white text-xs uppercase font-bold p-2 rounded transition-colors duration-200 w-1/2 mr-2 flex items-center justify-center'>
              <FaArrowLeft className='mr-1' /> Cancelar
            </button>
            <button
              type='submit'
              disabled={loading}
              className='bg-red-600 hover:bg-red-700 text-white text-xs uppercase font-bold p-2 rounded transition-colors duration-200 w-1/2 ml-2'>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
