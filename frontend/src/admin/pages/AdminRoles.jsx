import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { FaUser, FaPhone, FaEnvelope, FaLock } from 'react-icons/fa';
import Pagination from '../components/Pagination.jsx';

export default function AdminRoles() {
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('todos');

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('crear'); // 'crear', 'editar', 'ver'
  const [selectedRol, setSelectedRol] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState(null);

  const [formData, setFormData] = useState({
    codigo: '',
    descripcion: '',
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Fetch roles desde la API
  const fetchRoles = useCallback(
    async (page = 1) => {
      try {
        const response = await api.get('/roles', {
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
          setRoles(response.data.data || []);
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
        console.error('Error al cargar roles:', error?.response || error);
        toast.error('No se pudieron cargar los roles');
      }
    },
    [search, estado]
  );

  useEffect(() => {
    fetchRoles(pagination.currentPage);
  }, [fetchRoles, pagination.currentPage]);

  const openForm = (mode, rol = null) => {
    setFormMode(mode);
    setSelectedRol(rol);

    if (rol) {
      // editar o ver: llenar con datos existentes
      setFormData({
        codigo: rol.codigo || '',
        descripcion: rol.descripcion || '',
      });
    } else {
      // crear: limpiar
      setFormData({
        codigo: '',
        descripcion: '',
      });
    }

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedRol(null);
  };

  const openConfirm = (type, rol) => {
    setSelectedRol(rol);
    setConfirmType(type); // 'eliminar' o 'editar'
    setShowConfirm(true);
  };

  const closeConfirm = () => {
    setSelectedRol(null);
    setShowConfirm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formMode === 'editar') {
      setConfirmType('editar');
      setShowConfirm(true);
    } else if (formMode === 'crear') {
      crearRol();
    }
  };

  const crearRol = async () => {
    try {
      const response = await api.post('/roles', formData);
      toast.success(response.data.message || 'Rol creado');
      fetchRoles();
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
          <h2 className='text-2xl font-bold'>Gestión de Roles</h2>
          <p className='text-gray-500 text-sm'>Administra los roles</p>
        </div>

        {/* Toolbar */}
        <div className='flex gap-2 items-center'>
          <input
            type='text'
            placeholder='Buscar rol...'
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
            Nuevo Rol
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
                Codigo
              </th>
              <th className='bg-[#e8e9ea] px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase'>
                Descripcion
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
            {roles.map((a) => (
              <tr key={a.id}>
                <td className='px-4 py-2'>{a.id}</td>
                <td className='px-4 py-2'>{a.codigo}</td>
                <td className='px-4 py-2'>{a.descripcion}</td>
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
        onPageChange={(page) => fetchRoles(page)}
      />

      {/* Modal Form */}
      {showForm && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/70'>
          <div className='bg-white p-6 rounded shadow w-96'>
            <h3 className='bg-red-600 text-white text-sm font-bold mb-4 text-center p-2 rounded uppercase'>
              {formMode === 'crear'
                ? 'Registrar Rol'
                : formMode === 'editar'
                ? 'Editar Rol'
                : 'Ver Rol'}
            </h3>

            <form
              id='form-rol'
              onSubmit={handleSubmit}
              className='flex flex-col gap-4'>
              {/* Nombre */}
              <div className='row flex items-center border rounded px-3 py-2 gap-2'>
                <FaUser />
                <input
                  type='text'
                  name='codigo'
                  placeholder='Código'
                  value={formData.codigo}
                  onChange={(e) =>
                    setFormData({ ...formData, codigo: e.target.value })
                  }
                  disabled={formMode === 'ver'}
                  required
                  className='flex-1 outline-none'
                />
              </div>

              {/* Apellido */}
              <div className='row flex items-center border rounded px-3 py-2 gap-2'>
                <FaUser />
                <input
                  type='text'
                  name='descripcion'
                  placeholder='Descripción'
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
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
                ? 'Eliminar Rol'
                : 'Confirmar cambios'}
            </h3>
            <p className='mb-4'>
              {confirmType === 'eliminar'
                ? `¿Estás seguro de eliminar el rol "${selectedRol?.codigo}"?`
                : '¿Está seguro que desea modificar este rol?'}
            </p>
            <div className='flex justify-around mt-4'>
              <button
                className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors'
                onClick={async () => {
                  if (confirmType === 'eliminar') {
                    try {
                      await api.delete(`/roles/${selectedRol.id}`, {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            'accessToken'
                          )}`,
                        },
                      });
                      toast.success('Rol eliminado exitosamente');
                      fetchRoles();
                      setShowConfirm(false);
                      setSelectedRol(null);
                    } catch (error) {
                      toast.error(
                        error.response?.data?.message || 'Error al eliminar'
                      );
                    }
                  } else if (confirmType === 'editar') {
                    try {
                      const payload = {
                        codigo: formData.codigo,
                        descripcion: formData.descripcion,
                      };
                      const res = await api.put(
                        `/roles/${selectedRol.id}`,
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
                      fetchRoles();
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
