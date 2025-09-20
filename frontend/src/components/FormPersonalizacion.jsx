import { useState, useEffect } from 'react';
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaUpload,
  FaXmark,
  FaCalendar,
  FaCartShopping,
} from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { Typography } from '@mui/material';

const FormPersonalizacion = ({ open, onClose, product, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombreCliente: '',
    telefonoCliente: '',
    comentarios: '',
    archivos: [],
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error al escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
      'application/postscript',
      'image/vnd.adobe.photoshop',
    ];
    const validFiles = files.filter((file) => allowedTypes.includes(file.type));

    if (validFiles.length !== files.length) {
      toast.warn('Formatos permitidos: JPG, PNG, PDF, AI, PSD');
    }

    setFormData((prev) => ({
      ...prev,
      archivos: [...prev.archivos, ...validFiles],
    }));
  };

  const handleRemoveFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      archivos: prev.archivos.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombreCliente.trim())
      newErrors.nombreCliente = 'Nombre requerido';
    if (!formData.telefonoCliente.trim())
      newErrors.telefonoCliente = 'Teléfono requerido';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({
        nombreCliente: '',
        telefonoCliente: '',
        comentarios: '',
        archivos: [],
      });
      onClose();
      toast.success('¡Producto agregado al carrito!');
    } catch (err) {
      console.error('Error al enviar personalización:', err);
      toast.error('Error al agregar al carrito');
    }
  };

  useEffect(() => {
    if (open) {
      setFormData((prev) => ({
        ...prev,
        fechaPersonalizacion: new Date().toISOString(),
      }));
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/70 z-50'>
      <div className='bg-white p-6 rounded shadow-lg w-96 max-w-full mx-4'>
        {/* Título estilo rojo */}
        <h3 className='bg-red-600 text-white text-sm font-bold mb-4 text-center p-2 rounded uppercase'>
          Personalizar Producto
        </h3>

        {/* Nombre del producto */}
        <h4 className='text-lg font-bold text-gray-800 mb-1'>
          {product?.nombre}
        </h4>
        <p className='text-sm text-gray-600 mb-4'>{product?.descripcion}</p>

        {/* Fecha de personalización */}
        {/* <div className='flex items-center px-3 py-2 gap-2 rounded-md bg-gray-100 border border-gray-300 mb-2'>
          <FaCalendar className='text-gray-600' />
          <input
            type='text'
            value={
              formData.fechaPersonalizacion
                ? new Date(formData.fechaPersonalizacion).toLocaleDateString(
                    'es-ES',
                    {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    }
                  )
                : ''
            }
            readOnly
            className='flex-1 text-gray-700 border-none focus:outline-none focus:ring-0 text-sm bg-transparent'
          />
        </div> */}

        <form
          onSubmit={handleSubmit}
          className='space-y-4'>
          {/* Nombre */}
          <div className='flex items-center px-3 py-2 gap-2 rounded-md bg-gray-100 border border-gray-300 focus-within:outline-none transition-all duration-200'>
            <FaUser className='text-gray-600' />
            <input
              type='text'
              name='nombreCliente'
              placeholder='Nombre completo *'
              value={formData.nombreCliente}
              onChange={handleChange}
              required
              className='flex-1 text-gray-700 border-none focus:outline-none focus:ring-0 text-sm placeholder-gray-400'
            />
          </div>
          {errors.nombreCliente && (
            <p className='text-red-500 text-xs ml-1'>
              • {errors.nombreCliente}
            </p>
          )}

          {/* Teléfono */}
          <div className='flex items-center px-3 py-2 gap-2 rounded-md bg-gray-100 border border-gray-300 focus-within:outline-none transition-all duration-200'>
            <FaPhone className='text-gray-600' />
            <input
              type='tel'
              name='telefonoCliente'
              placeholder='Teléfono *'
              value={formData.telefonoCliente}
              onChange={handleChange}
              required
              className='flex-1 text-gray-700 border-none focus:outline-none focus:ring-0 text-sm placeholder-gray-400'
            />
          </div>
          {errors.telefonoCliente && (
            <p className='text-red-500 text-xs ml-1'>
              • {errors.telefonoCliente}
            </p>
          )}

          {/* Comentarios */}
          <div className='flex items-start px-3 py-2 gap-2 rounded-md bg-gray-100 border border-gray-300 focus-within:outline-none transition-all duration-200'>
            <FaEnvelope className='text-gray-600 mt-1' />
            <textarea
              name='comentarios'
              placeholder='Comentarios / instrucciones'
              value={formData.comentarios}
              onChange={handleChange}
              rows={3}
              className='flex-1 text-gray-700 border-none focus:outline-none focus:ring-0 text-sm placeholder-gray-400 resize-none'
            />
          </div>

          {/* Adjuntar archivos */}
          <label
            htmlFor='file-upload'
            className='flex items-center justify-center px-4 py-2 border border-blue-500 text-blue-600 rounded-md cursor-pointer hover:bg-blue-50 transition-colors duration-200 text-sm font-medium'>
            <FaUpload className='mr-2' />
            ADJUNTAR ARCHIVOS
          </label>
          <input
            id='file-upload'
            type='file'
            multiple
            accept='.jpg,.jpeg,.png,.pdf,.ai,.psd'
            onChange={handleFileChange}
            className='hidden'
          />

          {/* Lista de archivos con X */}
          {formData.archivos.length > 0 && (
            <div className='mt-3 space-y-1'>
              <Typography
                variant='body2'
                className='font-medium text-gray-700 text-sm'>
                Archivos adjuntos:
              </Typography>
              {formData.archivos.map((file, idx) => (
                <div
                  key={idx}
                  className='flex items-center justify-between px-3 py-2 bg-gray-50 rounded text-sm text-gray-800'>
                  <span>{file.name}</span>
                  <button
                    type='button'
                    onClick={() => handleRemoveFile(idx)}
                    className='text-red-500 hover:text-red-700 ml-2'>
                    <FaXmark />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Botones */}
          <div className='flex justify-between mt-4'>
            <button
              type='button'
              onClick={onClose}
              className='bg-gray-700 hover:bg-gray-800 text-white text-xs uppercase font-bold p-2 rounded transition-colors duration-200 w-1/2 mr-2'>
              Cancelar
            </button>
            <button
              type='submit'
              className='bg-red-600 hover:bg-red-700 text-white text-xs uppercase font-bold p-2 rounded transition-colors duration-200 w-1/2 ml-2 flex items-center justify-center'>
              <FaCartShopping className='mr-1' />
              Agregar al carrito
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPersonalizacion;
