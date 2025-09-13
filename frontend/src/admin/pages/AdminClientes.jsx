import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { FaUser, FaPhone, FaEnvelope, FaLock } from 'react-icons/fa';
import Pagination from '../components/Pagination.jsx';

export default function AdminClientes() {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('todos');

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('crear'); // 'crear', 'editar', 'ver'
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [confirmType, setConfirmType] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    contrasena: '',
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const nombreInputRef = useRef(null);

  // Fetch clientes desde la API
  const fetchClientes = useCallback(
    async (page = 1) => {
      try {
        const response = await api.get('/clientes', {
          params: {
            page,
            search,
            activo:
              estado === 'todos' ? 'all' : estado === 'activo' ? true : false,
          },
        });
        setClientes(response.data.data);
        setPagination(
          response.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 10,
          }
        );
      } catch (error) {
        console.error('Error al cargar clientes:', error);
        if (error.response?.status === 401) {
          return;
        }
      }
    },
    [search, estado]
  );

  useEffect(() => {
    fetchClientes(pagination.currentPage);
  }, [fetchClientes, pagination.currentPage]);

  const openForm = (mode, cliente = null) => {
    setFormMode(mode);
    setSelectedCliente(cliente);

    if (cliente) {
      // editar o ver: llenar con datos existentes
      setFormData({
        nombre: cliente.nombre || '',
        apellido: cliente.apellido || '',
        telefono: cliente.telefono || '',
        email: cliente.email || '',
        contrasena: '', // si aplica
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

    // opcional: foco en primer input
    setTimeout(() => {
      nombreInputRef.current?.focus();
    }, 0);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedCliente(null);
  };

  const openConfirm = (cliente, tipo) => {
    setSelectedCliente(cliente);
    setConfirmType(tipo);
    setShowConfirm(true);
  };

  const closeConfirm = () => {
    setSelectedCliente(null);
    setShowConfirm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formMode === 'editar') {
      setConfirmType('editar');
      setShowConfirm(true);
    } else if (formMode === 'crear') {
      crearCliente();
    }
  };

  const crearCliente = async () => {
    try {
      const res = await api.post('/auth/clientes/register', formData);
      toast.success(res.data.message || 'Cliente creado exitosamente');
      fetchClientes();
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
          <h2 className='text-2xl font-bold'>Gestión de Clientes</h2>
          <p className='text-gray-500 text-sm'>
            Administra los clientes registrados
          </p>
        </div>

        {/* Toolbar */}
        <div className='flex gap-2 items-center'>
          <input
            type='text'
            placeholder='Buscar cliente...'
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
            Nuevo Cliente
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
            {clientes.map((c) => (
              <tr key={c.id}>
                <td className='px-4 py-2'>{c.id}</td>
                <td className='px-4 py-2'>{c.nombre}</td>
                <td className='px-4 py-2'>{c.apellido}</td>
                <td className='px-4 py-2'>{c.telefono}</td>
                <td className='px-4 py-2'>{c.email}</td>
                <td className='px-4 py-2 text-center'>
                  {c.fechaRegistro
                    ? new Date(c.fechaRegistro).toLocaleDateString()
                    : ''}
                </td>
                <td className='px-4 py-2'>
                  {c.activo ? 'Activo' : 'Inactivo'}
                </td>
                <td className='px-4 py-2 text-center'>
                  <button
                    onClick={() => openForm('ver', c)}
                    className='px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm mr-1'>
                    👁
                  </button>
                  <button
                    onClick={() => openForm('editar', c)}
                    className='px-2 py-1 bg-blue-200 rounded hover:bg-blue-300 text-sm mr-1'>
                    ✏
                  </button>
                  <button
                    onClick={() => openConfirm(c, 'eliminar')}
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
        onPageChange={(page) => fetchClientes(page)}
      />

      {/* Modal Form */}
      {showForm && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/70'>
          <div className='bg-white p-6 rounded shadow w-96'>
            <h3 className='bg-red-600 text-white text-sm font-bold mb-4 text-center p-2 rounded uppercase'>
              {formMode === 'crear'
                ? 'Crear Cliente'
                : formMode === 'editar'
                ? 'Editar Cliente'
                : 'Ver Cliente'}
            </h3>
            <form
              id='form-admin'
              onSubmit={handleSubmit}
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
                ? 'Eliminar Cliente'
                : 'Confirmar cambios'}
            </h3>
            <p className='mb-4'>
              {confirmType === 'eliminar'
                ? `¿Está seguro de eliminar al cliente "${selectedCliente?.nombre}"?`
                : '¿Está seguro de modificar este cliente?'}
            </p>
            <div className='flex justify-around mt-4'>
              <button
                className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors'
                onClick={async () => {
                  if (confirmType === 'eliminar') {
                    try {
                      await api.delete(`/clientes/${selectedCliente.id}`);
                      toast.success('Cliente eliminado exitosamente');
                      fetchClientes();
                      closeConfirm();
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
                        `/clientes/${selectedCliente.id}`,
                        payload
                      );
                      toast.success(res.data.message || 'Cliente actualizado');
                      fetchClientes();
                      closeConfirm();
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
