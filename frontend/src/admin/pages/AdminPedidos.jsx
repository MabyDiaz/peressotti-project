// import React from 'react';
// import { useEffect, useState, useCallback } from 'react';
// import api from '../../api/axios';
// import { toast } from 'react-toastify';
// import { FaTag, FaBarcode, FaPercent } from 'react-icons/fa';
// import Pagination from '../components/Pagination.jsx';

// export default function AdminPedidos() {
//   const [cupones, setCupones] = useState([]);
//   const [search, setSearch] = useState('');
//   const [estado, setEstado] = useState('todos');

//   const [showForm, setShowForm] = useState(false);
//   const [formMode, setFormMode] = useState('crear'); // 'crear', 'editar', 'ver'
//   const [selectedPedido, setSelectedPedido] = useState(null);

//   const [showConfirm, setShowConfirm] = useState(false);
//   const [confirmType, setConfirmType] = useState(null);

//   const [formData, setFormData] = useState({
//     numero: '',
//     fecha: '',
//     estadoPedido: '',
//     estadoPago: '',
//     total: '',
//   });

//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalItems: 0,
//     itemsPerPage: 10,
//   });

//   // Fetch cupones desde la API
//   const fetchCupones = useCallback(
//     async (page = 1) => {
//       try {
//         const response = await api.get('/cupones', {
//           params: {
//             page,
//             limit: 10,
//             search,
//             activo:
//               estado === 'todos' ? 'all' : estado === 'activo' ? true : false,
//           },
//         });

//         // Solo si response existe
//         if (response && response.data) {
//           setCupones(response.data.data || []);
//           setPagination(
//             response.data.pagination || {
//               currentPage: 1,
//               totalPages: 1,
//               totalItems: 0,
//               itemsPerPage: 10,
//             }
//           );
//         }
//       } catch (error) {
//         console.error(
//           'Error al cargar cupones de descuento:',
//           error?.response || error
//         );
//         toast.error('No se pudieron cargar los cupones de descuento');
//       }
//     },
//     [search, estado]
//   );

//   useEffect(() => {
//     fetchCupones(pagination.currentPage);
//   }, [fetchCupones, pagination.currentPage]);

//   const openForm = (mode, cupon = null) => {
//     setFormMode(mode);
//     setSelectedCupon(cupon);

//     if (cupon) {
//       // editar o ver: llenar con datos existentes
//       setFormData({
//         nombreCupon: cupon.nombreCupon || '',
//         codigoCupon: cupon.codigoCupon || '',
//         porcentajeDescuento: cupon.porcentajeDescuento || '',
//       });
//     } else {
//       // crear: limpiar
//       setFormData({
//         nombreCupon: '',
//         codigoCupon: '',
//         porcentajeDescuento: '',
//       });
//     }

//     setShowForm(true);
//   };

//   const closeForm = () => {
//     setShowForm(false);
//     setSelectedCupon(null);
//   };

//   const openConfirm = (type, admin) => {
//     setSelectedCupon(admin);
//     setConfirmType(type); // 'eliminar' o 'editar'
//     setShowConfirm(true);
//   };

//   const closeConfirm = () => {
//     setSelectedCupon(null);
//     setShowConfirm(false);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (formMode === 'editar') {
//       setConfirmType('editar');
//       setShowConfirm(true);
//     } else if (formMode === 'crear') {
//       crearCupon();
//     }
//   };

//   const crearCupon = async () => {
//     try {
//       const response = await api.post('/cupones', formData);
//       toast.success(response.data.message || 'Cupon de Descuento creado');
//       fetchCupones();
//       closeForm();
//     } catch (error) {
//       const data = error.response?.data;
//       if (data?.details) {
//         data.details.forEach((e) => toast.error(`${e.param}: ${e.msg}`));
//       } else {
//         toast.error(data?.message || 'Error desconocido');
//       }
//     }
//   };

//   return (
//     <div className='space-y-6'>
//       {/* Header */}
//       <div className='flex items-center justify-between'>
//         <div>
//           <h2 className='text-2xl font-bold'>
//             Gestión de Cupones de Descuento
//           </h2>
//           <p className='text-gray-500 text-sm'>
//             Administra los cupones de descuento
//           </p>
//         </div>

//         {/* Toolbar */}
//         <div className='flex gap-2 items-center'>
//           <input
//             type='text'
//             placeholder='Buscar cupon...'
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className='border border-gray-300 rounded text-sm px-3 py-1 focus:outline-none focus:ring focus:border-blue-300'
//           />
//           <select
//             value={estado}
//             onChange={(e) => setEstado(e.target.value)}
//             className='border border-gray-300 rounded text-sm px-3 py-1 focus:outline-none focus:ring focus:border-blue-300'>
//             <option value='todos'>Todos los estados</option>
//             <option value='activo'>Activo</option>
//             <option value='inactivo'>Inactivo</option>
//           </select>
//           <button
//             onClick={() => openForm('crear')}
//             className='bg-red-600 text-white text-sm px-4 py-1 rounded hover:bg-red-700'>
//             Nuevo Cupon
//           </button>
//         </div>
//       </div>

//       {/* Tabla */}
//       <div className='overflow-x-auto bg-white rounded shadow'>
//         <table className='min-w-full divide-y divide-gray-200'>
//           <thead className='bg-gray-50'>
//             <tr>
//               <th className='bg-[#e8e9ea] px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase'>
//                 ID
//               </th>
//               <th className='bg-[#e8e9ea] px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase'>
//                 Nombre Cupon
//               </th>
//               <th className='bg-[#e8e9ea] px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase'>
//                 Codigo Cupon
//               </th>
//               <th className='bg-[#e8e9ea] px-4 py-2 !text-center text-xs font-medium text-gray-700 uppercase'>
//                 Procentaje de Descuento
//               </th>
//               <th className='bg-[#e8e9ea] px-4 py-2 !text-center text-xs font-medium text-gray-700 uppercase'>
//                 Estado
//               </th>
//               <th className='bg-[#e8e9ea] px-4 py-2 !text-center text-xs font-medium text-gray-700 uppercase'>
//                 Acciones
//               </th>
//             </tr>
//           </thead>
//           <tbody className='divide-y divide-gray-200 text-xs'>
//             {cupones.map((a) => (
//               <tr key={a.id}>
//                 <td className='px-4 py-2'>{a.id}</td>
//                 <td className='px-4 py-2'>{a.nombreCupon}</td>
//                 <td className='px-4 py-2'>{a.codigoCupon}</td>
//                 <td className='px-4 py-2 !text-center'>
//                   {a.porcentajeDescuento}
//                 </td>
//                 <td className='px-4 py-2 !text-center'>
//                   {a.activo ? 'Activo' : 'Inactivo'}
//                 </td>
//                 <td className='px-4 py-2 !text-center'>
//                   <button
//                     onClick={() => openForm('ver', a)}
//                     className='px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm mr-1'>
//                     👁
//                   </button>
//                   <button
//                     onClick={() => openForm('editar', a)}
//                     className='px-2 py-1 bg-blue-200 rounded hover:bg-blue-300 text-sm mr-1'>
//                     ✏
//                   </button>
//                   <button
//                     onClick={() => openConfirm('eliminar', a)}
//                     className='px-2 py-1 bg-red-200 rounded hover:bg-red-300 text-sm'>
//                     🗑
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <Pagination
//         pagination={pagination}
//         onPageChange={(page) => fetchCupones(page)}
//       />

//       {/* Modal Form */}
//       {showForm && (
//         <div className='fixed inset-0 flex items-center justify-center bg-black/70'>
//           <div className='bg-white p-6 rounded shadow w-96'>
//             <h3 className='bg-red-600 text-white text-sm font-bold mb-4 text-center p-2 rounded uppercase'>
//               {formMode === 'crear'
//                 ? 'Crear Cupón de Descuento'
//                 : formMode === 'editar'
//                 ? 'Editar Cupón de Descuento'
//                 : 'Ver Cupón de Descuento'}
//             </h3>

//             <form
//               id='form-admin'
//               onSubmit={handleSubmit}
//               className='flex flex-col gap-4'>
//               {/* Nombre del Cupón */}
//               <div className='row flex items-center border rounded px-3 py-2 gap-2'>
//                 <FaTag />
//                 <input
//                   type='text'
//                   name='nombre'
//                   placeholder='Nombre del cupón'
//                   value={formData.nombreCupon}
//                   onChange={(e) =>
//                     setFormData({ ...formData, nombreCupon: e.target.value })
//                   }
//                   disabled={formMode === 'ver'}
//                   required
//                   className='flex-1 outline-none'
//                 />
//               </div>

//               {/* Código del Cupón */}
//               <div className='row flex items-center border rounded px-3 py-2 gap-2'>
//                 <FaBarcode />
//                 <input
//                   type='text'
//                   name='codigo'
//                   placeholder='Código del cupón'
//                   value={formData.codigoCupon}
//                   onChange={(e) =>
//                     setFormData({ ...formData, codigoCupon: e.target.value })
//                   }
//                   disabled={formMode === 'ver'}
//                   required
//                   className='flex-1 outline-none'
//                 />
//               </div>

//               {/* Porcentaje de Descuento */}
//               <div className='row flex items-center border rounded px-3 py-2 gap-2'>
//                 <FaPercent />
//                 <input
//                   type='text'
//                   name='porcentaje'
//                   placeholder='Porcentaje de Descuento'
//                   value={formData.porcentajeDescuento}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       porcentajeDescuento: e.target.value,
//                     })
//                   }
//                   disabled={formMode === 'ver'}
//                   required
//                   className='flex-1 outline-none'
//                 />
//               </div>

//               {/* Botones */}
//               <div
//                 className={`flex mt-2 ${
//                   formMode === 'ver' ? 'justify-center' : 'justify-between'
//                 }`}>
//                 {formMode !== 'ver' && (
//                   <button
//                     type='submit'
//                     className='bg-red-600 hover:bg-red-700 text-white text-xs uppercase font-bold p-2 rounded transition-colors duration-200 w-1/2 mr-2'>
//                     Guardar
//                   </button>
//                 )}
//                 <button
//                   type='button'
//                   onClick={closeForm}
//                   className={`bg-gray-600 text-xs hover:bg-gray-700 text-white font-bold uppercase p-2 rounded transition-colors duration-200 ${
//                     formMode === 'ver' ? 'w-auto px-4' : 'w-1/2 ml-2'
//                   }`}>
//                   Cerrar
//                 </button>
//               </div>

//               {/* Link login solo en crear */}
//               {formMode === 'crear' && (
//                 <div className='signup-link text-center text-sm mt-2'>
//                   ¿Ya tenés cuenta?{' '}
//                   <a
//                     href='/admin/login'
//                     className='text-red-600 text-accent font-semibold hover:underline'
//                     onClick={closeForm}>
//                     Iniciar sesión
//                   </a>
//                 </div>
//               )}
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Modal Confirm */}
//       {showConfirm && (
//         <div className='fixed inset-0 flex items-center justify-center bg-black/70'>
//           <div className='bg-white p-6 rounded shadow w-80 text-center'>
//             <h3 className='text-lg font-bold mb-4'>
//               {confirmType === 'eliminar'
//                 ? 'Eliminar Cupón'
//                 : 'Confirmar cambios'}
//             </h3>
//             <p className='mb-4'>
//               {confirmType === 'eliminar'
//                 ? `¿Estás seguro de eliminar el cupón "${selectedCupon?.nombreCupon}"?`
//                 : '¿Está seguro que desea modificar este cupón?'}
//             </p>
//             <div className='flex justify-around mt-4'>
//               <button
//                 className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors'
//                 onClick={async () => {
//                   if (confirmType === 'eliminar') {
//                     try {
//                       await api.delete(`/cupones/${selectedCupon.id}`, {
//                         headers: {
//                           Authorization: `Bearer ${localStorage.getItem(
//                             'accessToken'
//                           )}`,
//                         },
//                       });
//                       toast.success('Cupón eliminado exitosamente');
//                       fetchCupones();
//                       setShowConfirm(false);
//                       setSelectedCupon(null);
//                     } catch (error) {
//                       toast.error(
//                         error.response?.data?.message || 'Error al eliminar'
//                       );
//                     }
//                   } else if (confirmType === 'editar') {
//                     try {
//                       const payload = {
//                         nombreCupon: formData.nombreCupon,
//                         codigoCupon: formData.codigoCupon,
//                         porcentajeDescuento: formData.porcentajeDescuento,
//                         email: formData.email,
//                       };
//                       const res = await api.put(
//                         `/cupones/${selectedCupon.id}`,
//                         payload,
//                         {
//                           headers: {
//                             Authorization: `Bearer ${localStorage.getItem(
//                               'accessToken'
//                             )}`,
//                           },
//                         }
//                       );
//                       toast.success(res.data.message);
//                       fetchCupones();
//                       setShowConfirm(false);
//                       closeForm();
//                     } catch (error) {
//                       toast.error(
//                         error.response?.data?.message || 'Error al actualizar'
//                       );
//                     }
//                   }
//                 }}>
//                 {confirmType === 'eliminar' ? 'Eliminar' : 'Aceptar'}
//               </button>
//               <button
//                 className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors'
//                 onClick={closeConfirm}>
//                 Cancelar
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

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

  const imprimirPedido = () => {
    window.print();
  };

  const descargarArchivos = async (pedidoId) => {
    try {
      const response = await api.get(`/pedidos/${pedidoId}/archivos`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `archivos-pedido-${pedidoId}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Archivos descargados exitosamente');
    } catch (error) {
      console.log(error);

      toast.error('Error al descargar archivos');
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
              <th className='bg-[#e8e9ea] px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase'>
                ID
              </th>
              <th className='bg-[#e8e9ea] px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase'>
                Número
              </th>
              <th className='bg-[#e8e9ea] px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase'>
                Cliente
              </th>
              <th className='bg-[#e8e9ea] px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase'>
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
                <td className='px-4 py-2'>{p.id}</td>
                <td className='px-4 py-2'>{p.numeroPedido}</td>
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

      {/* Modal Form */}
      {showForm && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/70 z-50'>
          <div className='bg-white p-6 rounded shadow w-[600px] max-h-[80vh] overflow-y-auto'>
            <h3 className='bg-red-600 text-white text-sm font-bold mb-4 text-center p-2 rounded uppercase'>
              {formMode === 'crear'
                ? 'Crear Pedido'
                : formMode === 'editar'
                ? 'Editar Pedido'
                : 'Ver Pedido'}
            </h3>

            {formMode === 'ver' && selectedPedido ? (
              // Vista detallada del pedido
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Número de Pedido
                    </label>
                    <div className='p-2 bg-gray-50 rounded'>
                      {selectedPedido.numeroPedido}
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Fecha de Pedido
                    </label>
                    <div className='p-2 bg-gray-50 rounded'>
                      {formatDate(selectedPedido.fechaPedido)}
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Estado del Pedido
                    </label>
                    <div className='p-2 bg-gray-50 rounded'>
                      {selectedPedido.estadoPedido}
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Estado del Pago
                    </label>
                    <div className='p-2 bg-gray-50 rounded'>
                      {selectedPedido.estadoPago}
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Total
                    </label>
                    <div className='p-2 bg-gray-50 rounded'>
                      ${selectedPedido.total}
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Fecha de Entrega
                    </label>
                    <div className='p-2 bg-gray-50 rounded'>
                      {formatDate(selectedPedido.fechaEntrega)}
                    </div>
                  </div>
                </div>

                {/* Información del Cliente */}
                {selectedPedido.Cliente && (
                  <div className='border-t pt-4'>
                    <h4 className='font-semibold text-gray-800 mb-2'>
                      Información del Cliente
                    </h4>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <span className='font-medium'>Nombre:</span>{' '}
                        {selectedPedido.Cliente.nombre}{' '}
                        {selectedPedido.Cliente.apellido}
                      </div>
                      <div>
                        <span className='font-medium'>Email:</span>{' '}
                        {selectedPedido.Cliente.email}
                      </div>
                      <div>
                        <span className='font-medium'>Teléfono:</span>{' '}
                        {selectedPedido.Cliente.telefono}
                      </div>
                    </div>
                  </div>
                )}

                {/* Productos del pedido */}
                {selectedPedido.DetallePedidos &&
                  selectedPedido.DetallePedidos.length > 0 && (
                    <div className='border-t pt-4'>
                      <h4 className='font-semibold text-gray-800 mb-2'>
                        Productos
                      </h4>
                      <div className='space-y-2'>
                        {selectedPedido.DetallePedidos.map((detalle, index) => (
                          <div
                            key={index}
                            className='bg-gray-50 p-2 rounded'>
                            <div className='flex justify-between'>
                              <span>{detalle.Producto?.nombre}</span>
                              <span>Cantidad: {detalle.cantidad}</span>
                              <span>${detalle.precio}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Observaciones */}
                {selectedPedido.observaciones && (
                  <div className='border-t pt-4'>
                    <h4 className='font-semibold text-gray-800 mb-2'>
                      Observaciones
                    </h4>
                    <div className='p-2 bg-gray-50 rounded'>
                      {selectedPedido.observaciones}
                    </div>
                  </div>
                )}

                {/* Botones de acción para vista */}
                <div className='flex justify-center gap-2 mt-6'>
                  <button
                    onClick={imprimirPedido}
                    className='flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'>
                    <FaPrint /> Imprimir Pedido
                  </button>
                  <button
                    onClick={() => descargarArchivos(selectedPedido.id)}
                    className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
                    <FaDownload /> Descargar Archivos
                  </button>
                  <button
                    onClick={closeForm}
                    className='bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700'>
                    Cerrar
                  </button>
                </div>
              </div>
            ) : (
              // Formulario de creación/edición
              <form
                id='form-pedido'
                onSubmit={handleSubmit}
                className='flex flex-col gap-4'>
                <div className='grid grid-cols-2 gap-4'>
                  {/* Número de Pedido */}
                  <div className='row flex items-center border rounded px-3 py-2 gap-2'>
                    <FaShoppingCart />
                    <input
                      type='text'
                      name='numeroPedido'
                      placeholder='Número de pedido'
                      value={formData.numeroPedido}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          numeroPedido: e.target.value,
                        })
                      }
                      disabled={formMode === 'ver'}
                      required
                      className='flex-1 outline-none'
                    />
                  </div>

                  {/* Cliente ID */}
                  <div className='row flex items-center border rounded px-3 py-2 gap-2'>
                    <FaUser />
                    <input
                      type='number'
                      name='idCliente'
                      placeholder='ID del cliente'
                      value={formData.idCliente}
                      onChange={(e) =>
                        setFormData({ ...formData, idCliente: e.target.value })
                      }
                      disabled={formMode === 'ver'}
                      required
                      className='flex-1 outline-none'
                    />
                  </div>

                  {/* Estado del Pedido */}
                  <div className='row flex items-center border rounded px-3 py-2 gap-2'>
                    <select
                      name='estadoPedido'
                      value={formData.estadoPedido}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          estadoPedido: e.target.value,
                        })
                      }
                      disabled={formMode === 'ver'}
                      className='flex-1 outline-none'>
                      <option value='pendiente'>Pendiente</option>
                      <option value='en_proceso'>En Proceso</option>
                      <option value='terminado'>Terminado</option>
                      <option value='entregado'>Entregado</option>
                    </select>
                  </div>

                  {/* Estado del Pago */}
                  <div className='row flex items-center border rounded px-3 py-2 gap-2'>
                    <select
                      name='estadoPago'
                      value={formData.estadoPago}
                      onChange={(e) =>
                        setFormData({ ...formData, estadoPago: e.target.value })
                      }
                      disabled={formMode === 'ver'}
                      className='flex-1 outline-none'>
                      <option value='pendiente'>Pendiente</option>
                      <option value='pagado'>Pagado</option>
                      <option value='cancelado'>Cancelado</option>
                    </select>
                  </div>

                  {/* Total */}
                  <div className='row flex items-center border rounded px-3 py-2 gap-2'>
                    <span>$</span>
                    <input
                      type='number'
                      name='total'
                      placeholder='Total del pedido'
                      value={formData.total}
                      onChange={(e) =>
                        setFormData({ ...formData, total: e.target.value })
                      }
                      disabled={formMode === 'ver'}
                      step='0.01'
                      className='flex-1 outline-none'
                    />
                  </div>

                  {/* Fecha de Entrega */}
                  <div className='row flex items-center border rounded px-3 py-2 gap-2'>
                    <FaCalendarAlt />
                    <input
                      type='date'
                      name='fechaEntrega'
                      value={formData.fechaEntrega}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fechaEntrega: e.target.value,
                        })
                      }
                      disabled={formMode === 'ver'}
                      className='flex-1 outline-none'
                    />
                  </div>
                </div>

                {/* Observaciones */}
                <div className='row flex items-start border rounded px-3 py-2 gap-2'>
                  <textarea
                    name='observaciones'
                    placeholder='Observaciones del pedido'
                    value={formData.observaciones}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        observaciones: e.target.value,
                      })
                    }
                    disabled={formMode === 'ver'}
                    rows='3'
                    className='flex-1 outline-none resize-none'
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
              </form>
            )}
          </div>
        </div>
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
