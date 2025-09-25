import React from 'react';
import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import {
  FaShoppingCart,
  FaUser,
  FaCalendarAlt,
  FaEye,
  FaPrint,
  FaDownload,
  FaSearch,
  FaPlus,
} from 'react-icons/fa';
import Pagination from '../components/Pagination.jsx';
import NewPedidoForm from '../components/NewPedidoForm.jsx';

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [search, setSearch] = useState('');
  const [estadoPedido, setEstadoPedido] = useState('todos');
  const [estado, setEstado] = useState('todos');

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('crear'); // 'crear', 'editar', 'ver'
  const [selectedPedido, setSelectedPedido] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState(null);

  const [showClientModal, setShowClientModal] = useState(false);
  const [clienteInfo, setClienteInfo] = useState(null);

  const [formData, setFormData] = useState({
    numeroPedido: '',
    idCliente: '',
    estadoPedido: 'pendiente',
    estadoPago: 'pendiente',
    total: '',
    fechaEntrega: '',
    observaciones: '',
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Fetch pedidos desde la API
  const fetchPedidos = useCallback(
    async (page = 1) => {
      try {
        const response = await api.get('/pedidos', {
          params: {
            page,
            limit: 10,
            search,
            estadoPedido: estadoPedido === 'todos' ? 'all' : estadoPedido,
            activo:
              estado === 'todos' ? 'all' : estado === 'activo' ? true : false,
          },
        });

        if (response && response.data) {
          setPedidos(response.data.data || []);
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
        console.error('Error al cargar pedidos:', error?.response || error);
        toast.error('No se pudieron cargar los pedidos');
      }
    },
    [search, estadoPedido, estado]
  );

  useEffect(() => {
    fetchPedidos(pagination.currentPage);
  }, [fetchPedidos, pagination.currentPage]);

  const openForm = (mode, pedido = null) => {
    setFormMode(mode);
    setSelectedPedido(pedido);

    if (pedido) {
      setFormData({
        numeroPedido: pedido.numeroPedido || '',
        idCliente: pedido.idCliente || '',
        estadoPedido: pedido.estadoPedido || 'pendiente',
        estadoPago: pedido.estadoPago || 'pendiente',
        total: pedido.total || '',
        fechaEntrega: pedido.fechaEntrega
          ? pedido.fechaEntrega.split('T')[0]
          : '',
        observaciones: pedido.observaciones || '',
      });
    } else {
      setFormData({
        numeroPedido: '',
        idCliente: '',
        estadoPedido: 'pendiente',
        estadoPago: 'pendiente',
        total: '',
        fechaEntrega: '',
        observaciones: '',
      });
    }

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedPedido(null);
  };

  const openConfirm = (type, pedido) => {
    setSelectedPedido(pedido);
    setConfirmType(type);
    setShowConfirm(true);
  };

  const closeConfirm = () => {
    setSelectedPedido(null);
    setShowConfirm(false);
  };

  const showClientInfo = async (clienteId) => {
    try {
      const response = await api.get(`/clientes/${clienteId}`);
      setClienteInfo(response.data.data);
      setShowClientModal(true);
    } catch (error) {
      console.log(error);

      toast.error('Error al obtener información del cliente');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formMode === 'editar') {
      setConfirmType('editar');
      setShowConfirm(true);
    } else if (formMode === 'crear') {
      crearPedido();
    }
  };

  const crearPedido = async () => {
    try {
      const response = await api.post('/pedidos', formData);
      toast.success(response.data.message || 'Pedido creado exitosamente');
      fetchPedidos();
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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getEstadoPedidoColor = (estadoPedido) => {
    switch (estadoPedido) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'en_proceso':
        return 'bg-blue-100 text-blue-800';
      case 'terminado':
        return 'bg-green-100 text-green-800';
      case 'entregado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoPagoColor = (estadoPago) => {
    switch (estadoPago) {
      case 'pendiente':
        return 'bg-red-100 text-red-800';
      case 'pagado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const imprimirPedido = (pedido) => {
    const contenido = `
    <h2>Pedido #${pedido.numeroPedido}</h2>
    <p>Cliente: ${pedido.Cliente?.nombre || '-'} ${
      pedido.Cliente?.apellido || ''
    }</p>
    <p>Fecha: ${formatDate(pedido.fechaPedido)}</p>
    <p>Total: $${pedido.total}</p>
    <p>Estado Pedido: ${pedido.estadoPedido}</p>
    <p>Estado Pago: ${pedido.estadoPago}</p>
    <h3>Productos:</h3>
    <ul>
      ${pedido.productos
        ?.map(
          (prod) =>
            `<li>${prod.nombre} - ${prod.cantidad} x $${prod.precio} = $${prod.subtotal}</li>`
        )
        .join('')}
    </ul>
    <p>Observaciones: ${pedido.observaciones || '-'}</p>
  `;
    const ventana = window.open('', '', 'width=800,height=600');
    ventana.document.write(contenido);
    ventana.document.close();
    ventana.print();
  };

  const descargarArchivos = async (archivoId) => {
    try {
      const response = await api.get(`/archivos/${archivoId}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `archivo-${archivoId}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Archivo descargado exitosamente');
    } catch (error) {
      console.error(error);
      toast.error('Error al descargar archivo');
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Gestión de Pedidos</h2>
          <p className='text-gray-500 text-sm'>
            Administra los pedidos de la imprenta
          </p>
        </div>

        {/* Toolbar */}
        <div className='flex gap-2 items-center'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Buscar pedido...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='border border-gray-300 rounded text-sm px-3 py-1 focus:outline-none focus:ring focus:border-blue-300'
            />
            <FaSearch className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
          </div>
          <select
            value={estadoPedido}
            onChange={(e) => setEstadoPedido(e.target.value)}
            className='border border-gray-300 rounded text-sm px-3 py-1 focus:outline-none focus:ring focus:border-blue-300'>
            <option value='todos'>Todos los estados de pedido</option>
            <option value='pendiente'>Pendiente</option>
            <option value='en_proceso'>En Proceso</option>
            <option value='terminado'>Terminado</option>
            <option value='entregado'>Entregado</option>
          </select>
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
            Nuevo Pedido
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className='overflow-x-auto bg-white rounded shadow'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='bg-[#e8e9ea] px-4 py-2 !text-center text-xs font-medium text-gray-700 uppercase'>
                Número
              </th>
              <th className='bg-[#e8e9ea] px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase'>
                Cliente
              </th>
              <th className='bg-[#e8e9ea] px-4 py-2 !text-center text-xs font-medium text-gray-700 uppercase'>
                Fecha
              </th>
              <th className='bg-[#e8e9ea] px-4 py-2 !text-center text-xs font-medium text-gray-700 uppercase'>
                Estado Pedido
              </th>
              <th className='bg-[#e8e9ea] px-4 py-2 !text-center text-xs font-medium text-gray-700 uppercase'>
                Estado Pago
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
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td className='px-4 py-2 !text-center'>{p.numeroPedido}</td>
                <td className='px-4 py-2'>
                  <button
                    onClick={() => showClientInfo(p.idCliente)}
                    className='text-blue-600 hover:text-blue-800 underline'>
                    {p.Cliente
                      ? `${p.Cliente.nombre} ${p.Cliente.apellido}`
                      : 'Cliente no encontrado'}
                  </button>
                </td>
                <td className='px-4 py-2'>{formatDate(p.fechaPedido)}</td>
                <td className='px-4 py-2 !text-center'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getEstadoPedidoColor(
                      p.estadoPedido
                    )}`}>
                    {p.estadoPedido?.replace('_', ' ') || 'pendiente'}
                  </span>
                </td>
                <td className='px-4 py-2 !text-center'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getEstadoPagoColor(
                      p.estadoPago
                    )}`}>
                    {p.estadoPago || 'pendiente'}
                  </span>
                </td>
                <td className='px-4 py-2 !text-center'>
                  {p.activo ? 'Activo' : 'Inactivo'}
                </td>
                <td className='px-4 py-2 !text-center'>
                  <button
                    onClick={() => openForm('ver', p)}
                    className='px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm mr-1'>
                    👁
                  </button>
                  <button
                    onClick={() => openForm('editar', p)}
                    className='px-2 py-1 bg-blue-200 rounded hover:bg-blue-300 text-sm mr-1'>
                    ✏
                  </button>
                  <button
                    onClick={() => openConfirm('eliminar', p)}
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
        onPageChange={(page) => fetchPedidos(page)}
      />
      {showForm && (
        <>
          {formMode === 'crear' ? (
            // Nuevo Pedido
            <NewPedidoForm
              onClose={() => setShowForm(false)}
              onCreated={() => {
                fetchPedidos();
                setShowForm(false);
              }}
            />
          ) : formMode === 'ver' && selectedPedido ? (
            // Ver Pedido
            <div className='fixed inset-0 flex items-center justify-center bg-black/70 z-50'>
              <div className='bg-white p-6 rounded shadow w-[600px] max-h-[80vh] overflow-y-auto'>
                <h3 className='bg-red-600 text-white text-sm font-bold mb-4 text-center p-2 rounded uppercase'>
                  Ver Pedido
                </h3>

                <div className='space-y-4'>
                  <p>
                    <strong>Número Pedido:</strong>{' '}
                    {selectedPedido.numeroPedido}
                  </p>
                  <p>
                    <strong>Fecha:</strong>{' '}
                    {formatDate(selectedPedido.fechaPedido)}
                  </p>
                  <p>
                    <strong>Cliente:</strong>{' '}
                    {selectedPedido.Cliente
                      ? `${selectedPedido.Cliente.nombre} ${selectedPedido.Cliente.apellido}`
                      : 'Cliente no encontrado'}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {selectedPedido.telefono || '-'}
                  </p>
                  <p>
                    <strong>Total:</strong> ${selectedPedido.total}
                  </p>
                  <p>
                    <strong>Método de Pago:</strong>{' '}
                    {selectedPedido.metodo_pago || '-'}
                  </p>
                  <p>
                    <strong>Estado de Pago:</strong> {selectedPedido.estadoPago}
                  </p>

                  <div>
                    <strong>Productos:</strong>
                    <ul className='list-disc pl-6'>
                      {selectedPedido.productos?.map((prod, i) => (
                        <li key={i}>
                          {prod.nombre} - {prod.cantidad} x ${prod.precio} = $
                          {prod.subtotal}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <strong>Archivos:</strong>
                    <ul className='list-disc pl-6'>
                      {selectedPedido.archivos?.map((archivo, i) => (
                        <li key={i}>
                          <a
                            href='#'
                            onClick={(e) => {
                              e.preventDefault();
                              descargarArchivos(archivo.id);
                            }}
                            className='text-blue-600 underline hover:text-blue-800'>
                            {archivo.nombre}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className='flex justify-end space-x-2 mt-4'>
                    <button
                      onClick={() => imprimirPedido(selectedPedido)}
                      className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
                      Imprimir Pedido
                    </button>
                    <button
                      onClick={() => setShowForm(false)}
                      className='bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700'>
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : formMode === 'editar' && selectedPedido ? (
            // Editar Pedido
            <div className='fixed inset-0 flex items-center justify-center bg-black/70 z-50'>
              <div className='bg-white p-6 rounded shadow w-[600px] max-h-[80vh] overflow-y-auto'>
                <h3 className='bg-red-600 text-white text-sm font-bold mb-4 text-center p-2 rounded uppercase'>
                  Editar Pedido
                </h3>
                <form
                  onSubmit={handleSubmit}
                  className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium'>Cliente</label>
                    <input
                      type='text'
                      value={formData.cliente || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, cliente: e.target.value })
                      }
                      className='w-full border px-2 py-1 rounded'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium'>
                      Teléfono
                    </label>
                    <input
                      type='text'
                      value={formData.telefono || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, telefono: e.target.value })
                      }
                      className='w-full border px-2 py-1 rounded'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium'>
                      Estado de Pago
                    </label>
                    <select
                      value={formData.estado_pago || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          estado_pago: e.target.value,
                        })
                      }
                      className='w-full border px-2 py-1 rounded'>
                      <option value='pendiente'>Pendiente</option>
                      <option value='abonado'>Abonado</option>
                      <option value='entrega'>Entrega</option>
                      <option value='aprobado'>Aprobado</option>
                    </select>
                  </div>
                  <div className='flex justify-end space-x-2'>
                    <button
                      type='button'
                      onClick={() => setShowForm(false)}
                      className='bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700'>
                      Cancelar
                    </button>
                    <button
                      type='submit'
                      className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
        </>
      )}

      {/* Modal Confirm */}
      {showConfirm && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/70'>
          <div className='bg-white p-6 rounded shadow w-80 text-center'>
            <h3 className='text-lg font-bold mb-4'>
              {confirmType === 'eliminar'
                ? 'Eliminar Pedido'
                : 'Confirmar cambios'}
            </h3>
            <p className='mb-4'>
              {confirmType === 'eliminar'
                ? `¿Estás seguro de eliminar el pedido "${selectedPedido?.numeroPedido}"?`
                : '¿Está seguro que desea modificar este pedido?'}
            </p>
            <div className='flex justify-around mt-4'>
              <button
                className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors'
                onClick={async () => {
                  if (confirmType === 'eliminar') {
                    try {
                      await api.delete(`/pedidos/${selectedPedido.id}`, {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            'accessToken'
                          )}`,
                        },
                      });
                      toast.success('Pedido eliminado exitosamente');
                      fetchPedidos();
                      setShowConfirm(false);
                      setSelectedPedido(null);
                    } catch (error) {
                      toast.error(
                        error.response?.data?.message || 'Error al eliminar'
                      );
                    }
                  } else if (confirmType === 'editar') {
                    try {
                      const res = await api.put(
                        `/pedidos/${selectedPedido.id}`,
                        formData,
                        {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                              'accessToken'
                            )}`,
                          },
                        }
                      );
                      toast.success(res.data.message);
                      fetchPedidos();
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

      {/* Modal Cliente Info */}
      {showClientModal && clienteInfo && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/70'>
          <div className='bg-white p-6 rounded shadow w-96'>
            <h3 className='bg-red-600 text-white text-sm font-bold mb-4 text-center p-2 rounded uppercase'>
              Información del Cliente
            </h3>
            <div className='space-y-3'>
              <div>
                <strong>Nombre:</strong> {clienteInfo.nombre}{' '}
                {clienteInfo.apellido}
              </div>
              <div>
                <strong>Email:</strong> {clienteInfo.email}
              </div>
              <div>
                <strong>Teléfono:</strong> {clienteInfo.telefono}
              </div>
              <div>
                <strong>Fecha de Registro:</strong>{' '}
                {formatDate(clienteInfo.fechaRegistro)}
              </div>
            </div>
            <div className='flex justify-center mt-4'>
              <button
                onClick={() => setShowClientModal(false)}
                className='bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700'>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
