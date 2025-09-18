import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/getImageUrl.js';
import Pagination from '../components/Pagination.jsx';
import { FaSearch, FaPlus } from 'react-icons/fa';

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('todos');

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('crear'); // 'crear', 'editar', 'ver'
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    imagen: '',
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState(''); // 'eliminar' o 'editar'

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Fetch productos
  const fetchCategorias = useCallback(
    async (page = 1) => {
      try {
        const response = await api.get('/categorias', {
          params: {
            page,
            search,
            activo:
              estado === 'todos' ? 'all' : estado === 'activo' ? true : false,
          },
        });
        setCategorias(response.data.data);
        setPagination(
          response.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 10,
          }
        );
      } catch (error) {
        console.log(error);
        toast.error('Error al cargar categorias');
      }
    },
    [search, estado]
  );

  useEffect(() => {
    fetchCategorias(pagination.currentPage);
  }, [fetchCategorias, pagination.currentPage]);

  // Abrir formulario
  const openForm = (mode, categoria = null) => {
    setFormMode(mode);
    setSelectedCategoria(categoria);

    if (categoria) {
      setFormData({
        nombre: categoria.nombre || '',
        imagen: categoria.imagen || '',
      });
    } else {
      setFormData({
        nombre: '',
        imagen: '',
      });
    }

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedCategoria(null);
  };

  // Abrir modal de confirmación
  const openConfirm = (categoria, tipo) => {
    setSelectedCategoria(categoria);
    setConfirmType(tipo); // 'eliminar' o 'editar'
    setShowConfirm(true);
  };

  const closeConfirm = () => {
    setSelectedCategoria(null);
    setConfirmType('');
    setShowConfirm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('nombre', formData.nombre);

      if (formData.imagen instanceof File) {
        data.append('imagen', formData.imagen);
      }

      if (formMode === 'crear') {
        await api.post('/categorias', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        toast.success('Categoria creada exitosamente');
        fetchCategorias();
        setFormData({ nombre: '', imagen: null });
        closeForm();
      } else if (formMode === 'editar') {
        setConfirmType('editar');
        setShowConfirm(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar');
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Gestión de Productos</h2>
          <p className='text-gray-500 text-sm'>
            Administra los productos de la tienda
          </p>
        </div>

        {/* Toolbar */}
        <div className='flex gap-2 items-center'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Buscar categoria...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring focus:border-blue-300'
            />
            <FaSearch className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
          </div>

          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className='border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring focus:border-blue-300'>
            <option value='todos'>Todos los estados</option>
            <option value='activo'>Activo</option>
            <option value='inactivo'>Inactivo</option>
          </select>

          <button
            onClick={() => openForm('crear')}
            className='flex items-center gap-2 bg-red-600 text-white text-sm px-4 py-1 rounded hover:bg-red-700'>
            <FaPlus className='text-white text-xs' />
            Nueva Categoria
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className='overflow-x-auto bg-white rounded shadow'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-0.5 py-1 text-left text-xs font-medium text-gray-700 uppercase'>
                ID
              </th>
              <th className='px-0.5 py-1 text-left text-xs font-medium text-gray-700 uppercase max-w-[80px] truncate overflow-hidden'>
                Nombre
              </th>

              <th className='px-0.5 py-1 text-left text-xs font-medium text-gray-700 uppercase'>
                Imagen
              </th>

              <th className='px-0.5 py-1 !text-center text-xs font-medium text-gray-700 uppercase'>
                Estado
              </th>

              <th className='px-0.5 py-1 !text-center text-xs font-medium text-gray-700 uppercase'>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 text-xs'>
            {categorias.map((cat) => {
              return (
                <tr key={cat.id}>
                  <td className='px-0.5 py-1'>{cat.id}</td>
                  <td className='px-0.5 py-1 max-w-[80px] truncate overflow-hidden'>
                    {cat.nombre}
                  </td>

                  <td className='px-0.5 py-1'>
                    {cat.imagen && (
                      <img
                        src={getImageUrl(cat.imagen)}
                        alt={cat.nombre}
                        className='w-12 h-12 object-cover rounded'
                      />
                    )}
                  </td>

                  <td className='px-0.5 py-1 !text-center'>
                    {cat.activo ? 'Activo' : 'Inactivo'}
                  </td>

                  <td className='px-0.5 py-1 text-center'>
                    <button
                      onClick={() => openForm('ver', cat)}
                      className='px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs mr-1'>
                      👁
                    </button>
                    <button
                      onClick={() => openForm('editar', cat)}
                      className='px-2 py-1 bg-blue-200 rounded hover:bg-blue-300 text-xs mr-1'>
                      ✏
                    </button>
                    <button
                      onClick={() => openConfirm(cat, 'eliminar')}
                      className='px-2 py-1 bg-red-200 rounded hover:bg-red-300 text-xs mr-1'>
                      🗑
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        pagination={pagination}
        onPageChange={(page) => fetchCategorias(page)}
      />

      {/* Modal Form */}
      {showForm && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/70'>
          <div className='bg-white p-6 rounded shadow w-96 max-h-[90vh] overflow-y-auto'>
            <h3 className='bg-red-600 text-white text-sm font-bold mb-4 text-center p-2 rounded uppercase'>
              {formMode === 'crear'
                ? 'Crear Categoria'
                : formMode === 'editar'
                ? 'Editar Categoria'
                : 'Ver Categoria'}
            </h3>

            <form
              onSubmit={handleSubmit}
              className='flex flex-col gap-4'>
              {/* Nombre */}
              <div className='row flex items-center text-xs border rounded px-3 py-2 gap-2'>
                <input
                  type='text'
                  name='nombre'
                  placeholder='Nombre'
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  disabled={formMode === 'ver'}
                  className='flex-1 outline-none'
                  required
                />
              </div>

              {/* Imagen */}
              <div className='row flex flex-col items-start text-xs border rounded px-3 py-2 gap-2'>
                <input
                  type='file'
                  accept='image/*'
                  onChange={(e) =>
                    setFormData({ ...formData, imagen: e.target.files[0] })
                  }
                  disabled={formMode === 'ver'}
                  className='flex-1 outline-none'
                />
                {formData.imagen && (
                  <img
                    src={
                      formData.imagen instanceof File
                        ? URL.createObjectURL(formData.imagen)
                        : getImageUrl(formData.imagen)
                    }
                    alt='Preview'
                    className='w-20 h-20 object-cover rounded mt-2'
                  />
                )}
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
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmación Productos */}
      {showConfirm && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/70'>
          <div className='bg-white p-6 rounded shadow w-80 text-center'>
            <h3 className='text-lg font-bold mb-4'>
              {confirmType === 'eliminar'
                ? 'Eliminar Categoria'
                : 'Confirmar cambios'}
            </h3>
            <p className='mb-4'>
              {confirmType === 'eliminar'
                ? `¿Estás seguro de eliminar la categoría "${selectedCategoria?.nombre}"?`
                : '¿Está seguro que desea modificar esta categoria?'}
            </p>
            <div className='flex justify-around mt-4'>
              <button
                className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors'
                onClick={async () => {
                  if (confirmType === 'eliminar') {
                    try {
                      await api.delete(`/categorias/${selectedCategoria.id}`);
                      fetchCategorias();
                      setShowConfirm(false);
                      setSelectedCategoria(null);
                    } catch (error) {
                      console.error(error);
                      alert(
                        error.response?.data?.message ||
                          'Error al eliminar categoria'
                      );
                    }
                  } else if (confirmType === 'editar') {
                    try {
                      const data = new FormData();
                      data.append('nombre', formData.nombre);
                      if (formData.imagen instanceof File) {
                        data.append('imagen', formData.imagen);
                      }

                      await api.put(
                        `/categorias/${selectedCategoria.id}`,
                        data,
                        {
                          headers: { 'Content-Type': 'multipart/form-data' },
                        }
                      );

                      toast.success('Categoria actualizada exitosamente');
                      fetchCategorias(); // ✅ ahora sí actualiza
                      setShowConfirm(false);
                      closeForm();
                    } catch (error) {
                      console.error(error);
                      toast.error(
                        error.response?.data?.message ||
                          'Error al actualizar categoria'
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
