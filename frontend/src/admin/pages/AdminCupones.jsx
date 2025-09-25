import React from 'react';
import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { FaTag, FaBarcode, FaPercent, FaSearch, FaPlus } from 'react-icons/fa';
import Pagination from '../components/Pagination.jsx';

export default function AdminCupones() {
  const [cupones, setCupones] = useState([]);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('todos');

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('crear'); // 'crear', 'editar', 'ver'
  const [selectedCupon, setSelectedCupon] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState(null);

  const [formData, setFormData] = useState({
    nombreCupon: '',
    codigoCupon: '',
    porcentajeDescuento: '',
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Fetch cupones desde la API
  const fetchCupones = useCallback(
    async (page = 1) => {
      try {
        const response = await api.get('/cupones', {
          params: {
            page,
            limit: 10,
            search,
            activo:
              estado === 'todos' ? 'all' : estado === 'activo' ? true : false,
          },
        });

        // Solo si response existe
        if (response && response.data) {
          setCupones(response.data.data || []);
          setPagination(
            response.data.pagination || {
              currentPage: 1,
              totalPages: 1,
              totalItems: 0,
              itemsPerPage: 10,
            }
          );
        }
      } catch (error) {
        console.error(
          'Error al cargar cupones de descuento:',
          error?.response || error
        );
        toast.error('No se pudieron cargar los cupones de descuento');
      }
    },
    [search, estado]
  );

  useEffect(() => {
    fetchCupones(pagination.currentPage);
  }, [fetchCupones, pagination.currentPage]);

  const openForm = (mode, cupon = null) => {
    setFormMode(mode);
    setSelectedCupon(cupon);

    if (cupon) {
      // editar o ver: llenar con datos existentes
      setFormData({
        nombreCupon: cupon.nombreCupon || '',
        codigoCupon: cupon.codigoCupon || '',
        porcentajeDescuento: cupon.porcentajeDescuento || '',
      });
    } else {
      // crear: limpiar
      setFormData({
        nombreCupon: '',
        codigoCupon: '',
        porcentajeDescuento: '',
      });
    }

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedCupon(null);
  };

  const openConfirm = (type, admin) => {
    setSelectedCupon(admin);
    setConfirmType(type); // 'eliminar' o 'editar'
    setShowConfirm(true);
  };

  const closeConfirm = () => {
    setSelectedCupon(null);
    setShowConfirm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formMode === 'editar') {
      setConfirmType('editar');
      setShowConfirm(true);
    } else if (formMode === 'crear') {
      crearCupon();
    }
  };

  const crearCupon = async () => {
    try {
      const response = await api.post('/cupones', formData);
      toast.success(response.data.message || 'Cupon de Descuento creado');
      fetchCupones();
      closeForm();
    } catch (error) {
      const data = error.response?.data;
      if (data?.details) {
        data.details.forEach((e) => toast.error(`${e.param}: ${e.msg}`));
      } else {
        toast.error(data?.message || 'Error desconocido');
      }
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>
            Gestión de Cupones de Descuento
          </h2>
          <p className='text-gray-500 text-sm'>
            Administra los cupones de descuento
          </p>
        </div>

        {/* Toolbar */}
        <div className='flex gap-2 items-center'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Buscar cupon...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='border border-gray-300 rounded text-sm px-3 py-1 focus:outline-none focus:ring focus:border-blue-300'
            />
            <FaSearch className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
          </div>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className='border border-gray-300 rounded text-sm px-3 py-1 focus:outline-none focus:ring focus:border-blue-300'>
            <option value='todos'>Todos los estados</option>
            <option value='activo'>Activo</option>
            <option value='inactivo'>Inactivo</option>
          </select>
          <button
            onClick={() => openForm('crear')}
            className='flex items-center gap-2 bg-red-600 text-white text-sm px-4 py-1 rounded hover:bg-red-700'>
            <FaPlus className='text-white text-xs' />
            Nuevo Cupon
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className='overflow-x-auto bg-white rounded shadow'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='bg-[#e8e9ea] px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase'>
                Nombre Cupon
              </th>
              <th className='bg-[#e8e9ea] px-4 py-2 !text-center text-xs font-medium text-gray-700 uppercase'>
                Codigo Cupon
              </th>
              <th className='bg-[#e8e9ea] px-4 py-2 !text-center text-xs font-medium text-gray-700 uppercase'>
                Procentaje de Descuento
              </th>
              <th className='bg-[#e8e9ea] px-4 py-2 !text-center text-xs font-medium text-gray-700 uppercase'>
                Estado
              </th>
              <th className='bg-[#e8e9ea] px-4 py-2 !text-center text-xs font-medium text-gray-700 uppercase'>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 text-xs'>
            {cupones.map((a) => (
              <tr key={a.id}>
                <td className='px-4 py-2'>{a.nombreCupon}</td>
                <td className='px-4 py-2 !text-center'>{a.codigoCupon}</td>
                <td className='px-4 py-2 !text-center'>
                  {a.porcentajeDescuento}
                </td>
                <td className='px-4 py-2 !text-center'>
                  {a.activo ? 'Activo' : 'Inactivo'}
                </td>
                <td className='px-4 py-2 !text-center'>
                  <button
                    onClick={() => openForm('ver', a)}
                    className='px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm mr-1'>
                    👁
                  </button>
                  <button
                    onClick={() => openForm('editar', a)}
                    className='px-2 py-1 bg-blue-200 rounded hover:bg-blue-300 text-sm mr-1'>
                    ✏
                  </button>
                  <button
                    onClick={() => openConfirm('eliminar', a)}
                    className='px-2 py-1 bg-red-200 rounded hover:bg-red-300 text-sm'>
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        pagination={pagination}
        onPageChange={(page) => fetchCupones(page)}
      />

      {/* Modal Form */}
      {showForm && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/70'>
          <div className='bg-white p-6 rounded shadow w-96'>
            <h3 className='bg-red-600 text-white text-sm font-bold mb-4 text-center p-2 rounded uppercase'>
              {formMode === 'crear'
                ? 'Crear Cupón de Descuento'
                : formMode === 'editar'
                ? 'Editar Cupón de Descuento'
                : 'Ver Cupón de Descuento'}
            </h3>

            <form
              id='form-admin'
              onSubmit={handleSubmit}
              className='flex flex-col gap-4'>
              {/* Nombre del Cupón */}
              <div className='row flex items-center border rounded px-3 py-2 gap-2'>
                <FaTag />
                <input
                  type='text'
                  name='nombre'
                  placeholder='Nombre del cupón'
                  value={formData.nombreCupon}
                  onChange={(e) =>
                    setFormData({ ...formData, nombreCupon: e.target.value })
                  }
                  disabled={formMode === 'ver'}
                  required
                  className='flex-1 outline-none'
                />
              </div>

              {/* Código del Cupón */}
              <div className='row flex items-center border rounded px-3 py-2 gap-2'>
                <FaBarcode />
                <input
                  type='text'
                  name='codigo'
                  placeholder='Código del cupón'
                  value={formData.codigoCupon}
                  onChange={(e) =>
                    setFormData({ ...formData, codigoCupon: e.target.value })
                  }
                  disabled={formMode === 'ver'}
                  required
                  className='flex-1 outline-none'
                />
              </div>

              {/* Porcentaje de Descuento */}
              <div className='row flex items-center border rounded px-3 py-2 gap-2'>
                <FaPercent />
                <input
                  type='text'
                  name='porcentaje'
                  placeholder='Porcentaje de Descuento'
                  value={formData.porcentajeDescuento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      porcentajeDescuento: e.target.value,
                    })
                  }
                  disabled={formMode === 'ver'}
                  required
                  className='flex-1 outline-none'
                />
              </div>

              {/* Botones */}
              <div
                className={`flex mt-2 ${
                  formMode === 'ver' ? 'justify-center' : 'justify-between'
                }`}>
                {formMode !== 'ver' && (
                  <button
                    type='submit'
                    className='bg-red-600 hover:bg-red-700 text-white text-xs uppercase font-bold p-2 rounded transition-colors duration-200 w-1/2 mr-2'>
                    Guardar
                  </button>
                )}
                <button
                  type='button'
                  onClick={closeForm}
                  className={`bg-gray-600 text-xs hover:bg-gray-700 text-white font-bold uppercase p-2 rounded transition-colors duration-200 ${
                    formMode === 'ver' ? 'w-auto px-4' : 'w-1/2 ml-2'
                  }`}>
                  Cerrar
                </button>
              </div>

              {/* Link login solo en crear */}
              {formMode === 'crear' && (
                <div className='signup-link text-center text-sm mt-2'>
                  ¿Ya tenés cuenta?{' '}
                  <a
                    href='/admin/login'
                    className='text-red-600 text-accent font-semibold hover:underline'
                    onClick={closeForm}>
                    Iniciar sesión
                  </a>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirm */}
      {showConfirm && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/70'>
          <div className='bg-white p-6 rounded shadow w-80 text-center'>
            <h3 className='text-lg font-bold mb-4'>
              {confirmType === 'eliminar'
                ? 'Eliminar Cupón'
                : 'Confirmar cambios'}
            </h3>
            <p className='mb-4'>
              {confirmType === 'eliminar'
                ? `¿Estás seguro de eliminar el cupón "${selectedCupon?.nombreCupon}"?`
                : '¿Está seguro que desea modificar este cupón?'}
            </p>
            <div className='flex justify-around mt-4'>
              <button
                className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors'
                onClick={async () => {
                  if (confirmType === 'eliminar') {
                    try {
                      await api.delete(`/cupones/${selectedCupon.id}`, {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            'accessToken'
                          )}`,
                        },
                      });
                      toast.success('Cupón eliminado exitosamente');
                      fetchCupones();
                      setShowConfirm(false);
                      setSelectedCupon(null);
                    } catch (error) {
                      toast.error(
                        error.response?.data?.message || 'Error al eliminar'
                      );
                    }
                  } else if (confirmType === 'editar') {
                    try {
                      const payload = {
                        nombreCupon: formData.nombreCupon,
                        codigoCupon: formData.codigoCupon,
                        porcentajeDescuento: formData.porcentajeDescuento,
                        email: formData.email,
                      };
                      const res = await api.put(
                        `/cupones/${selectedCupon.id}`,
                        payload,
                        {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                              'accessToken'
                            )}`,
                          },
                        }
                      );
                      toast.success(res.data.message);
                      fetchCupones();
                      setShowConfirm(false);
                      closeForm();
                    } catch (error) {
                      toast.error(
                        error.response?.data?.message || 'Error al actualizar'
                      );
                    }
                  }
                }}>
                {confirmType === 'eliminar' ? 'Eliminar' : 'Aceptar'}
              </button>
              <button
                className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors'
                onClick={closeConfirm}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
