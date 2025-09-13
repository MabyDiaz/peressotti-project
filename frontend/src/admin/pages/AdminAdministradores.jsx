import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { FaUser, FaPhone, FaEnvelope, FaLock } from 'react-icons/fa';

export default function AdminAdministradores() {
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('todos');

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('crear'); // 'crear', 'editar', 'ver'
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    contrasena: '',
  });

  // Fetch administradores desde la API
  const fetchAdmins = useCallback(async () => {
    try {
      const response = await api.get('/administradores', {
        params: {
          search,
          activo:
            estado === 'todos' ? 'all' : estado === 'activo' ? true : false,
        },
      });
      setAdmins(response.data.data);
    } catch (error) {
      console.error('Error al cargar administradores:', error);
      if (error.response?.status === 401) return;
    }
  }, [search, estado]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const openForm = (mode, admin = null) => {
    setFormMode(mode);
    setSelectedAdmin(admin);

    if (admin) {
      // editar o ver: llenar con datos existentes
      setFormData({
        nombre: admin.nombre || '',
        apellido: admin.apellido || '',
        telefono: admin.telefono || '',
        email: admin.email || '',
        contrasena: '',
      });
    } else {
      // crear: limpiar
      setFormData({
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        contrasena: '',
      });
    }

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedAdmin(null);
  };

  const openConfirm = (type, admin) => {
    setSelectedAdmin(admin);
    setConfirmType(type); // 'eliminar' o 'editar'
    setShowConfirm(true);
  };

  const closeConfirm = () => {
    setSelectedAdmin(null);
    setShowConfirm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formMode === 'editar') {
      setConfirmType('editar');
      setShowConfirm(true);
    } else if (formMode === 'crear') {
      crearAdmin();
    }
  };

  const crearAdmin = async () => {
    try {
      const response = await api.post('/administradores', formData);
      toast.success(response.data.message || 'Administrador creado');
      fetchAdmins();
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
          <h2 className='text-2xl font-bold'>Gestión de Administradores</h2>
          <p className='text-gray-500 text-sm'>
            Administra los usuarios administrativos
          </p>
        </div>

        {/* Toolbar */}
        <div className='flex gap-2 items-center'>
          <input
            type='text'
            placeholder='Buscar administrador...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='border border-gray-300 rounded text-sm px-3 py-1 focus:outline-none focus:ring focus:border-blue-300'
          />
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className='border border-gray-300 rounded text-sm px-3 py-1 focus:outline-none focus:ring focus:border-blue-300'>
            <option value='todos'>Todos los estados</option>
            <option value='activos'>Activo</option>
            <option value='inactivos'>Inactivo</option>
          </select>
          <button
            onClick={() => openForm('crear')}
            className='bg-red-600 text-white text-sm px-4 py-1 rounded hover:bg-red-700'>
            Nuevo Administrador
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
                Apellido
              </th>
              <th className='bg-[#e8e9ea] px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase'>
                Teléfono
              </th>
              <th className='bg-[#e8e9ea] px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase'>
                Email
              </th>
              <th className='bg-[#e8e9ea] px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase'>
                Fecha Registro
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
            {admins.map((a) => (
              <tr key={a.id}>
                <td className='px-4 py-2'>{a.id}</td>
                <td className='px-4 py-2'>{a.nombre}</td>
                <td className='px-4 py-2'>{a.apellido}</td>
                <td className='px-4 py-2'>{a.telefono}</td>
                <td className='px-4 py-2'>{a.email}</td>
                <td className='px-4 py-2 text-center'>
                  {a.fechaRegistro
                    ? new Date(a.fechaRegistro).toLocaleDateString()
                    : ''}
                </td>
                <td className='px-4 py-2'>
                  {a.activo ? 'Activo' : 'Inactivo'}
                </td>
                <td className='px-4 py-2 text-center'>
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

      {/* Modal Form */}
      {showForm && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/70'>
          <div className='bg-white p-6 rounded shadow w-96'>
            <h3 className='bg-red-600 text-white text-sm font-bold mb-4 text-center p-2 rounded uppercase'>
              {formMode === 'crear'
                ? 'Registrar Administrador'
                : formMode === 'editar'
                ? 'Editar Administrador'
                : 'Ver Administrador'}
            </h3>

            <form
              id='form-admin'
              onSubmit={(e) => {
                e.preventDefault();
                if (formMode === 'editar') {
                  handleSubmit(e);
                }
              }}
              className='flex flex-col gap-4'>
              {/* Nombre */}
              <div className='row flex items-center border rounded px-3 py-2 gap-2'>
                <FaUser />
                <input
                  type='text'
                  name='nombre'
                  placeholder='Nombre'
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
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
                  name='apellido'
                  placeholder='Apellido'
                  value={formData.apellido}
                  onChange={(e) =>
                    setFormData({ ...formData, apellido: e.target.value })
                  }
                  disabled={formMode === 'ver'}
                  required
                  className='flex-1 outline-none'
                />
              </div>

              {/* Teléfono */}
              <div className='row flex items-center border rounded px-3 py-2 gap-2'>
                <FaPhone />
                <input
                  type='text'
                  name='telefono'
                  placeholder='Teléfono'
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  disabled={formMode === 'ver'}
                  required
                  className='flex-1 outline-none'
                />
              </div>

              {/* Email */}
              <div className='row flex items-center border rounded px-3 py-2 gap-2'>
                <FaEnvelope />
                <input
                  type='email'
                  name='email'
                  placeholder='Correo electrónico'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={formMode === 'ver'}
                  required
                  className='flex-1 outline-none'
                />
              </div>

              {/* Contraseña solo en crear */}
              {formMode === 'crear' && (
                <div className='row flex items-center border rounded px-3 py-2 gap-2'>
                  <FaLock />
                  <input
                    type='password'
                    name='contrasena'
                    placeholder='Contraseña'
                    value={formData.contrasena || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, contrasena: e.target.value })
                    }
                    className='flex-1 outline-none'
                    required
                  />
                </div>
              )}

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
                ? 'Eliminar Administrador'
                : 'Confirmar cambios'}
            </h3>
            <p className='mb-4'>
              {confirmType === 'eliminar'
                ? `¿Estás seguro de eliminar al administrador "${selectedAdmin?.nombre}"?`
                : '¿Está seguro que desea modificar este administrador?'}
            </p>
            <div className='flex justify-around mt-4'>
              <button
                className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors'
                onClick={async () => {
                  if (confirmType === 'eliminar') {
                    try {
                      await api.delete(`/administradores/${selectedAdmin.id}`, {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            'accessToken'
                          )}`,
                        },
                      });
                      toast.success('Administrador eliminado exitosamente');
                      fetchAdmins();
                      setShowConfirm(false);
                      setSelectedAdmin(null);
                    } catch (error) {
                      toast.error(
                        error.response?.data?.message || 'Error al eliminar'
                      );
                    }
                  } else if (confirmType === 'editar') {
                    try {
                      const payload = {
                        nombre: formData.nombre,
                        apellido: formData.apellido,
                        telefono: formData.telefono,
                        email: formData.email,
                      };
                      const res = await api.put(
                        `/administradores/${selectedAdmin.id}`,
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
                      fetchAdmins();
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
