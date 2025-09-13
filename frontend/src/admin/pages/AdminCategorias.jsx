import { useEffect, useState, useCallback } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import Pagination from '../components/Pagination.jsx';

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('todos');

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('crear'); // 'crear', 'editar', 'ver'
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState(null); // 'eliminar' o 'editar'

  const [formData, setFormData] = useState({
    nombre: '',
    imagenFile: null, // archivo seleccionado
    preview: '', // URL para preview
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Fetch categorías
  const fetchCategorias = useCallback(
    async (page = 1) => {
      try {
        const res = await axios.get('/categorias', {
          params: {
            page,
            search,
            activo:
              estado === 'todos' ? 'all' : estado === 'activo' ? true : false,
          },
        });
        setCategorias(res.data.data);
        setPagination(
          res.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 10,
          }
        );
      } catch (err) {
        console.error(err);
      }
    },
    [search, estado]
  );

  useEffect(() => {
    fetchCategorias(pagination.currentPage);
  }, [fetchCategorias, pagination.currentPage]);

  const openForm = (mode, categoria = null) => {
    setFormMode(mode);
    setSelectedCategoria(categoria);

    if (categoria) {
      setFormData({
        nombre: categoria.nombre || '',
        imagenFile: null,
        preview: categoria.imagenURL || '',
      });
    } else {
      setFormData({ nombre: '', imagenFile: null, preview: '' });
    }

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedCategoria(null);
    setFormData({ nombre: '', imagenFile: null, preview: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append('nombre', formData.nombre);
      if (formData.imagenFile) {
        payload.append('imagenURL', formData.imagenFile);
      }

      let res;
      if (formMode === 'crear') {
        res = await axios.post('/categorias', payload);
      } else if (formMode === 'editar') {
        res = await axios.put(`/categorias/${selectedCategoria.id}`, payload);
      }

      toast.success(res.data.message);
      fetchCategorias();
      closeForm();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error desconocido');
    }
  };

  const openConfirm = (categoria = null, tipo) => {
    setSelectedCategoria(categoria); // si aplica
    setConfirmType(tipo);
    setShowConfirm(true);
  };

  const closeConfirm = () => {
    setSelectedCategoria(null);
    setShowConfirm(false);
  };

  const handleDeleteCategoria = async (id) => {
    try {
      const res = await axios.delete(`/categorias/${id}`);
      toast.success(res.data.message);
      fetchCategorias();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error desconocido');
    }
  };
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Gestión de Categorías</h2>
          <p className='text-gray-500 text-sm'>
            Administra las categorías de productos
          </p>
        </div>

        {/* Toolbar */}
        <div className='flex gap-2 items-center'>
          <input
            type='text'
            placeholder='Buscar...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='border border-gray-300 rounded text-sm px-3 py-1 focus:outline-none focus:ring focus:border-blue-300'
          />
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
            className='bg-red-600 text-white text-sm px-4 py-1 rounded hover:bg-red-700'>
            Nueva Categoría
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className='overflow-x-auto bg-white rounded shadow'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='bg-[#e8e9ea] px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase'>
                ID
              </th>
              <th className='bg-[#e8e9ea] px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase'>
                Nombre
              </th>
              <th className='bg-[#e8e9ea] px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase'>
                Imagen
              </th>
              <th className='bg-[#e8e9ea] px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase'>
                Estado
              </th>
              <th className='bg-[#e8e9ea] px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase'>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 text-xs'>
            {categorias.map((cat) => (
              <tr key={cat.id}>
                <td className='px-4 py-2'>{cat.id}</td>
                <td className='px-4 py-2'>{cat.nombre}</td>
                <td className='px-4 py-2'>
                  {cat.imagenURL && (
                    <img
                      src={cat.imagenURL}
                      alt={cat.nombre}
                      className='w-12 h-12 object-cover rounded'
                    />
                  )}
                </td>
                <td className='px-4 py-2'>
                  {cat.activo ? 'Activo' : 'Inactivo'}
                </td>
                <td className='px-4 py-2 text-center'>
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
                    className='px-2 py-1 bg-red-200 rounded hover:bg-red-300 text-xs'>
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
        onPageChange={(page) => fetchCategorias(page)}
      />

      {/* Modal Form */}
      {showForm && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/70 z-50'>
          <div className='bg-white p-6 rounded shadow w-96'>
            <h3 className='bg-red-600 text-white text-sm font-bold mb-4 text-center p-2 rounded uppercase'>
              {formMode === 'crear'
                ? 'Registrar Categoría'
                : formMode === 'editar'
                ? 'Editar Categoría'
                : 'Ver Categoría'}
            </h3>

            <form className='flex flex-col gap-4'>
              {/* Nombre */}
              <div className='flex flex-col gap-4'>
                {/* Nombre */}
                <div className='flex flex-col'>
                  <input
                    type='text'
                    name='imagen'
                    placeholder='Nombre'
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    disabled={formMode === 'ver'}
                    required
                    className='border border-gray-300 rounded px-3 py-2 outline-none'
                  />
                </div>

                {/* Upload */}
                {formMode !== 'ver' && (
                  <div className='flex flex-col'>
                    <label className='text-xs font-semibold mb-1'>Imagen</label>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFormData({
                            ...formData,
                            imagenFile: file,
                            preview: URL.createObjectURL(file),
                          });
                        }
                      }}
                      className='border border-gray-300 rounded px-3 py-1'
                    />
                  </div>
                )}

                {/* Preview */}
                {formData.preview && (
                  <img
                    src={formData.preview}
                    alt='preview'
                    className='w-24 h-24 object-cover rounded mt-2'
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
                    type='button'
                    onClick={handleSubmit}
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

      {/* Modal Confirm */}
      {/* Modal Confirm */}
      {showConfirm && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/70'>
          <div className='bg-white p-6 rounded shadow w-80 text-center'>
            <h3 className='text-lg font-bold mb-4'>
              {confirmType === 'eliminar'
                ? 'Eliminar Categoría'
                : 'Confirmar cambios'}
            </h3>
            <p className='mb-4'>
              {confirmType === 'eliminar'
                ? `¿Está seguro de eliminar la categoría "${selectedCategoria?.nombre}"?`
                : '¿Está seguro de modificar esta categoría?'}
            </p>
            <div className='flex justify-around mt-4'>
              <button
                className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors'
                onClick={async () => {
                  if (confirmType === 'eliminar') {
                    await handleDeleteCategoria(selectedCategoria.id); // <-- acá
                    closeConfirm(); // cerramos el modal
                  }
                }}>
                Eliminar
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
