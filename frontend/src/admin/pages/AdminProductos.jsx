import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/getImageUrl.js';
import Pagination from '../components/Pagination.jsx';

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('todos');

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('crear'); // 'crear', 'editar', 'ver'
  const [selectedProducto, setSelectedProducto] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: '',
    oferta: false,
    descuento: 0,
    esPersonalizable: false,
    idCategoria: '',
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
  const fetchProductos = useCallback(
    async (page = 1) => {
      try {
        const response = await api.get('/productos', {
          params: {
            page,
            search,
            activo:
              estado === 'todos' ? 'all' : estado === 'activo' ? true : false,
            idCategoria: categoriaFiltro || undefined,
          },
        });
        setProductos(response.data.data);
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
        toast.error('Error al cargar productos');
      }
    },
    [search, estado, categoriaFiltro]
  );

  // Fetch categorias
  const fetchCategorias = useCallback(async () => {
    try {
      const response = await api.get('/categorias');
      setCategorias(response.data.data);
    } catch (error) {
      console.log(error);
      toast.error('Error al cargar categorías');
    }
  }, []);

  useEffect(() => {
    fetchProductos(pagination.currentPage);
    fetchCategorias();
  }, [fetchProductos, fetchCategorias, pagination.currentPage]);

  // Abrir formulario
  const openForm = (mode, producto = null) => {
    setFormMode(mode);
    setSelectedProducto(producto);

    if (producto) {
      setFormData({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio || '',
        imagen: producto.imagen || '',
        oferta: producto.oferta || false,
        descuento: producto.descuento || 0,
        esPersonalizable: producto.esPersonalizable || false,
        idCategoria: producto.idCategoria || '',
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        imagen: '',
        oferta: false,
        descuento: 0,
        esPersonalizable: false,
        idCategoria: '',
      });
    }

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedProducto(null);
  };

  // Abrir modal de confirmación
  const openConfirm = (producto, tipo) => {
    setSelectedProducto(producto);
    setConfirmType(tipo); // 'eliminar' o 'editar'
    setShowConfirm(true);
  };

  const closeConfirm = () => {
    setSelectedProducto(null);
    setConfirmType('');
    setShowConfirm(false);
  };

  // Guardar producto (crear o editar)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('nombre', formData.nombre);
      data.append('descripcion', formData.descripcion);
      data.append('precio', formData.precio);
      data.append('oferta', formData.oferta ? '1' : '0');
      data.append('descuento', formData.descuento);
      data.append('esPersonalizable', formData.esPersonalizable ? '1' : '0');
      data.append('idCategoria', formData.idCategoria);

      if (formData.imagen instanceof File) {
        data.append('imagen', formData.imagen);
      }

      if (formMode === 'crear') {
        await api.post('/productos', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Producto creado');
      } else if (formMode === 'editar') {
        await api.put(`/productos/${selectedProducto.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Producto actualizado');
      }

      fetchProductos();
      closeForm();
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
          <input
            type='text'
            placeholder='Buscar...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring focus:border-blue-300'
          />
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className='border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring focus:border-blue-300'>
            <option value=''>Todas las categorías</option>
            {categorias.map((cat) => (
              <option
                key={cat.id}
                value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
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
            className='bg-red-600 text-white text-sm px-4 py-1 rounded hover:bg-red-700'>
            Nuevo Producto
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
              <th className='px-0.5 py-1 text-left text-xs font-medium text-gray-700 uppercase max-w-[180px] truncate overflow-hidden'>
                Descripción
              </th>
              <th className='px-0.5 py-1 text-left text-xs font-medium text-gray-700 uppercase'>
                Precio
              </th>
              <th className='px-0.5 py-1 text-left text-xs font-medium text-gray-700 uppercase'>
                Imagen
              </th>
              <th className='px-0.5 py-1 text-left text-xs font-medium text-gray-700 uppercase'>
                Oferta
              </th>
              <th className='px-0.5 py-1 text-left text-xs font-medium text-gray-700 uppercase'>
                Descuento
              </th>
              <th className='px-0.5 py-1 text-left text-xs font-medium text-gray-700 uppercase'>
                Personalizable
              </th>
              <th className='px-0.5 py-1 text-left text-xs font-medium text-gray-700 uppercase'>
                Estado
              </th>
              <th className='px-0.5 py-1 text-left text-xs font-medium text-gray-700 uppercase'>
                Categoría
              </th>
              <th className='px-0.5 py-1 text-center text-xs font-medium text-gray-700 uppercase'>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 text-xs'>
            {productos.map((prod) => {
              console.log(
                'Imagen DB:',
                prod.imagen,
                'URL final:',
                getImageUrl(prod.imagen)
              );

              return (
                <tr key={prod.id}>
                  <td className='px-0.5 py-1'>{prod.id}</td>
                  <td className='px-0.5 py-1 max-w-[80px] truncate overflow-hidden'>
                    {prod.nombre}
                  </td>
                  <td className='px-0.5 py-1 max-w-[180px] truncate overflow-hidden'>
                    {prod.descripcion}
                  </td>
                  <td className='px-0.5 py-1'>${prod.precio.toFixed(2)}</td>
                  <td className='px-0.5 py-1'>
                    {prod.imagen && (
                      <img
                        src={getImageUrl(prod.imagen)}
                        alt={prod.nombre}
                        className='w-12 h-12 object-cover rounded'
                      />
                    )}
                  </td>
                  <td className='px-0.5 py-1'>{prod.oferta ? 'Sí' : 'No'}</td>
                  <td className='px-0.5 py-1'>{prod.descuento}%</td>
                  <td className='px-0.5 py-1'>
                    {prod.esPersonalizable ? 'Sí' : 'No'}
                  </td>
                  <td className='px-0.5 py-1'>
                    {prod.activo ? 'Activo' : 'Inactivo'}
                  </td>
                  <td className='px-0.5 py-1'>
                    {prod.Categorium?.nombre || 'N/A'}
                  </td>
                  <td className='px-0.5 py-1 text-center'>
                    <button
                      onClick={() => openForm('ver', prod)}
                      className='px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs mr-1'>
                      👁
                    </button>
                    <button
                      onClick={() => openForm('editar', prod)}
                      className='px-2 py-1 bg-blue-200 rounded hover:bg-blue-300 text-xs mr-1'>
                      ✏
                    </button>
                    <button
                      onClick={() => openConfirm(prod, 'eliminar')}
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
        onPageChange={(page) => fetchProductos(page)}
      />

      {/* Modal Form */}
      {showForm && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/70'>
          <div className='bg-white p-6 rounded shadow w-96 max-h-[90vh] overflow-y-auto'>
            <h3 className='bg-red-600 text-white text-sm font-bold mb-4 text-center p-2 rounded uppercase'>
              {formMode === 'crear'
                ? 'Crear Producto'
                : formMode === 'editar'
                ? 'Editar Producto'
                : 'Ver Producto'}
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

              {/* Descripción */}
              <div className='row flex text-xs items-center border rounded px-3 py-2 gap-2'>
                <textarea
                  placeholder='Descripción'
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  disabled={formMode === 'ver'}
                  className='flex-1 outline-none'
                />
              </div>

              {/* Precio */}
              <div className='row flex items-center text-xs border rounded px-3 py-2 gap-2'>
                <input
                  type='number'
                  name='precio'
                  placeholder='Precio'
                  value={formData.precio}
                  onChange={(e) =>
                    setFormData({ ...formData, precio: e.target.value })
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

              {/* Descuento */}
              <div className='row flex items-center text-xs border rounded px-3 py-2 gap-2'>
                <input
                  type='number'
                  min='0'
                  max='100'
                  name='descuento'
                  placeholder='Descuento %'
                  value={formData.descuento}
                  onChange={(e) =>
                    setFormData({ ...formData, descuento: e.target.value })
                  }
                  disabled={formMode === 'ver'}
                  className='flex-1 outline-none'
                />
              </div>

              {/* Oferta */}
              <div className='row flex items-center text-xs border rounded px-3 py-2 gap-2'>
                <select
                  value={formData.oferta ? 'true' : 'false'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      oferta: e.target.value === 'true',
                    })
                  }
                  disabled={formMode === 'ver'}
                  className='flex-1 outline-none'>
                  <option value='false'>Sin oferta</option>
                  <option value='true'>En oferta</option>
                </select>
              </div>

              {/* Personalizable */}
              <div className='row flex items-center text-xs border rounded px-3 py-2 gap-2'>
                <select
                  value={formData.esPersonalizable ? 'true' : 'false'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      esPersonalizable: e.target.value === 'true',
                    })
                  }
                  disabled={formMode === 'ver'}
                  className='flex-1 outline-none'>
                  <option value='false'>No personalizable</option>
                  <option value='true'>Personalizable</option>
                </select>
              </div>

              {/* Categoría */}
              <div className='row flex items-center text-xs border rounded px-3 py-2 gap-2'>
                <select
                  value={formData.idCategoria}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      idCategoria: Number(e.target.value),
                    })
                  }
                  disabled={formMode === 'ver'}
                  className='flex-1 outline-none'
                  required>
                  <option value=''>Seleccione una categoría</option>
                  {categorias.map((cat) => (
                    <option
                      key={cat.id}
                      value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
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
                ? 'Eliminar Producto'
                : 'Confirmar cambios'}
            </h3>
            <p className='mb-4'>
              {confirmType === 'eliminar'
                ? `¿Estás seguro de eliminar el producto "${selectedProducto?.nombre}"?`
                : '¿Está seguro que desea modificar este producto?'}
            </p>
            <div className='flex justify-around mt-4'>
              <button
                className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors'
                onClick={async () => {
                  if (confirmType === 'eliminar') {
                    try {
                      await api.delete(`/productos/${selectedProducto.id}`);
                      fetchProductos();
                      setShowConfirm(false);
                      setSelectedProducto(null);
                    } catch (error) {
                      console.error(error);
                      alert(
                        error.response?.data?.message ||
                          'Error al eliminar producto'
                      );
                    }
                  } else if (confirmType === 'editar') {
                    try {
                      await api.put(
                        `/productos/${selectedProducto.id}`,
                        formData
                      );
                      fetchProductos();
                      setShowConfirm(false);
                      closeForm();
                    } catch (error) {
                      console.error(error);
                      alert(
                        error.response?.data?.message ||
                          'Error al actualizar producto'
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
