import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/getImageUrl.js';
import Pagination from '../components/Pagination.jsx';
import { FaSearch, FaPlus } from 'react-icons/fa';

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
    // new files (File objects)
    imagenes: [],
    // existing filenames (strings con path /uploads/xxx)
    imagenesExistentes: [],
    // principal: si es una existente -> string '/uploads/xxx'
    // si es una nueva -> usamos imagenPrincipalIsNew=true e imagenPrincipalIndex (index en imagenes)
    imagenPrincipal: '',
    imagenPrincipalIsNew: false,
    imagenPrincipalIndex: null,
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
        imagenes: [], // archivos nuevos
        imagenesExistentes: producto.imagenes || [], // strings guardadas en DB
        imagenPrincipal:
          producto.imagenPrincipal ||
          producto.imagen ||
          producto.imagenes?.[0] ||
          '',
        imagenPrincipalIsNew: false,
        imagenPrincipalIndex: null,
        oferta: producto.oferta || false,
        descuento: producto.descuento || 0,
        esPersonalizable: producto.esPersonalizable || false,
        idCategoria: producto.idCategoria || '',
      });
    } else {
      // crear nuevo
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        imagenes: [],
        imagenesExistentes: [],
        imagenPrincipal: '',
        imagenPrincipalIsNew: false,
        imagenPrincipalIndex: null,
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

      if (formMode === 'editar') {
        // enviar las imágenes existentes que quiero conservar
        data.append(
          'keepImagenes',
          JSON.stringify(formData.imagenesExistentes || [])
        );
      }

      // indicar cuál será la imagen principal:
      if (formData.imagenPrincipalIsNew) {
        // principal es una de las nuevas seleccionadas (index)
        data.append('imagenPrincipalIsNew', 'true');
        data.append(
          'imagenPrincipalIndex',
          String(formData.imagenPrincipalIndex ?? 0)
        );
      } else if (formData.imagenPrincipal) {
        // principal es una existente (string)
        data.append('imagenPrincipal', formData.imagenPrincipal);
      }

      // agregar archivos nuevos
      if (formData.imagenes && formData.imagenes.length > 0) {
        for (let file of formData.imagenes) {
          data.append('imagenes', file);
        }
      }

      if (formMode === 'crear') {
        await api.post('/productos', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Producto creado');
      } else {
        await api.put(`/productos/${selectedProducto.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Producto actualizado');
      }

      fetchProductos();
      closeForm();
    } catch (error) {
      console.error(error);
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
              placeholder='Buscar...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring focus:border-blue-300'
            />
            <FaSearch className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
          </div>
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
            className='flex items-center gap-2 bg-red-600 text-white text-sm px-4 py-1 rounded hover:bg-red-700'>
            <FaPlus className='text-white text-xs' />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className='overflow-x-auto bg-white rounded shadow'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-0.5 py-1 text-left text-xs font-medium text-gray-700 uppercase max-w-[100px] whitespace-normal overflow-hidden'>
                Nombre
              </th>
              <th className='px-0.5 py-1 !text-center text-xs font-medium text-gray-700 uppercase max-w-[180px] whitespace-normal overflow-hidden'>
                Descripción
              </th>
              <th className='px-0.5 py-1 !text-center text-xs font-medium text-gray-700 uppercase'>
                Precio
              </th>
              <th className='px-0.5 py-1 !text-center text-xs font-medium text-gray-700 uppercase'>
                Imagen
              </th>
              <th className='px-0.5 py-1 !text-center text-xs font-medium text-gray-700 uppercase'>
                Oferta
              </th>
              <th className='px-0.5 py-1 !text-center text-xs font-medium text-gray-700 uppercase'>
                Descuento
              </th>
              <th className='px-0.5 py-1 !text-center text-xs font-medium text-gray-700 uppercase'>
                Personalizable
              </th>
              <th className='px-0.5 py-1 !text-center text-xs font-medium text-gray-700 uppercase'>
                Estado
              </th>
              <th className='px-0.5 py-1 !text-center text-xs font-medium text-gray-700 uppercase max-w-[100px]'>
                Categoría
              </th>
              <th className='px-0.5 py-1 !text-center text-xs font-medium text-gray-700 uppercase'>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 text-xs'>
            {productos.map((prod) => {
              return (
                <tr key={prod.id}>
                  <td className='px-0.5 py-1 max-w-[100px] whitespace-normal overflow-hidden'>
                    {prod.nombre}
                  </td>
                  <td className='px-0.5 py-1 max-w-[180px] whitespace-normal overflow-hidden'>
                    {prod.descripcion}
                  </td>
                  <td className='px-0.5 py-1 !text-center'>
                    ${prod.precio.toFixed(2)}
                  </td>
                  <td className='px-0.5 py-1 !text-center'>
                    {prod.imagenPrincipal && (
                      <img
                        src={getImageUrl(prod.imagenPrincipal)}
                        alt={prod.nombre}
                        className='w-12 h-12 object-cover rounded'
                      />
                    )}
                  </td>
                  <td className='px-0.5 py-1 !text-center'>
                    {prod.oferta ? 'Sí' : 'No'}
                  </td>
                  <td className='px-0.5 py-1 !text-center'>
                    {prod.descuento}%
                  </td>
                  <td className='px-0.5 py-1 !text-center'>
                    {prod.esPersonalizable ? 'Sí' : 'No'}
                  </td>
                  <td className='px-0.5 py-1 !text-center'>
                    {prod.activo ? 'Activo' : 'Inactivo'}
                  </td>
                  <td className='px-0.5 py-1 !text-center max-w-[100px]'>
                    {prod.Categorium?.nombre || 'N/A'}
                  </td>
                  <td className='px-0.5 py-1 !text-center'>
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
                  name='imagenes'
                  multiple
                  accept='image/*'
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setFormData((prev) => {
                      // si no hay imagen principal seleccionada, tomar la primera nueva como principal por default
                      let newPrincipalIsNew = prev.imagenPrincipalIsNew;
                      let newPrincipalIndex = prev.imagenPrincipalIndex;
                      if (!prev.imagenPrincipal && files.length > 0) {
                        newPrincipalIsNew = true;
                        newPrincipalIndex = 0;
                      }
                      return {
                        ...prev,
                        imagenes: files,
                        imagenPrincipalIsNew: newPrincipalIsNew,
                        imagenPrincipalIndex: newPrincipalIndex,
                      };
                    });
                  }}
                />

                {/* Preview de todas las nuevas imágenes seleccionadas */}
                {formData.imagenes && formData.imagenes.length > 0 && (
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {Array.from(formData.imagenes).map((file, idx) => (
                      <img
                        key={idx}
                        src={URL.createObjectURL(file)}
                        alt={`preview-${idx}`}
                        className='w-15 h-15 object-cover rounded'
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Preview nuevas */}
              {formData.imagenes.length > 0 && (
                <div className='flex gap-2 flex-wrap'>
                  {formData.imagenes.map((file, idx) => (
                    <div
                      key={idx}
                      className='relative text-xs'>
                      <img
                        src={URL.createObjectURL(file)}
                        className='w-15 h-15 object-cover rounded'
                        alt={file.name}
                      />
                      <div className='flex gap-1 mt-1'>
                        <button
                          type='button'
                          onClick={() => {
                            setFormData((prev) => {
                              const newFiles = prev.imagenes.filter(
                                (_, i) => i !== idx
                              );
                              // si se borró la que era principal, resetear principal a primera nueva o a existing
                              let newPrincipalIsNew = prev.imagenPrincipalIsNew;
                              let newPrincipalIndex = prev.imagenPrincipalIndex;
                              if (
                                prev.imagenPrincipalIsNew &&
                                prev.imagenPrincipalIndex === idx
                              ) {
                                if (newFiles.length > 0) {
                                  newPrincipalIndex = 0;
                                  newPrincipalIsNew = true;
                                } else {
                                  newPrincipalIsNew = false;
                                  newPrincipalIndex = null;
                                }
                              } else if (
                                prev.imagenPrincipalIsNew &&
                                prev.imagenPrincipalIndex > idx
                              ) {
                                newPrincipalIndex =
                                  prev.imagenPrincipalIndex - 1;
                              }
                              return {
                                ...prev,
                                imagenes: newFiles,
                                imagenPrincipalIsNew: newPrincipalIsNew,
                                imagenPrincipalIndex: newPrincipalIndex,
                              };
                            });
                          }}
                          className='px-1 bg-red-500 text-white rounded'>
                          x
                        </button>

                        <button
                          type='button'
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              imagenPrincipalIsNew: true,
                              imagenPrincipalIndex: idx,
                              imagenPrincipal: '',
                            }));
                          }}
                          className={`px-1 rounded ${
                            formData.imagenPrincipalIsNew &&
                            formData.imagenPrincipalIndex === idx
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-200'
                          }`}>
                          {formData.imagenPrincipalIsNew &&
                          formData.imagenPrincipalIndex === idx
                            ? 'Principal'
                            : 'Hacer principal'}
                        </button>
                      </div>
                      <div className='text-[10px] truncate w-20'>
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {formMode === 'editar' &&
                formData.imagenesExistentes.length > 0 && (
                  <div>
                    <h4 className='font-semibold mb-2'>Imágenes actuales</h4>
                    <div className='flex flex-wrap gap-4'>
                      {formData.imagenesExistentes.map((img, idx) => (
                        <div
                          key={idx}
                          className='flex flex-col items-center text-xs'>
                          <img
                            src={getImageUrl(img)}
                            alt={`img-${idx}`}
                            className='w-15 h-15 object-cover rounded border'
                          />
                          <div className='flex gap-1 mt-1'>
                            <button
                              type='button'
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  imagenPrincipalIsNew: false,
                                  imagenPrincipal: img,
                                  imagenPrincipalIndex: null,
                                }));
                              }}
                              className={`px-2 py-1 rounded ${
                                formData.imagenPrincipal === img &&
                                !formData.imagenPrincipalIsNew
                                  ? 'bg-red-600 text-white'
                                  : 'bg-gray-200'
                              }`}>
                              {formData.imagenPrincipal === img &&
                              !formData.imagenPrincipalIsNew
                                ? 'Principal'
                                : 'Hacer principal'}
                            </button>

                            <button
                              type='button'
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  imagenesExistentes:
                                    prev.imagenesExistentes.filter(
                                      (x) => x !== img
                                    ),
                                }));
                              }}
                              className='px-2 py-1 bg-red-500 text-white rounded'>
                              x
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                      await fetchProductos(pagination.currentPage);
                      setShowConfirm(false);
                      setSelectedProducto(null);
                      toast.success('Producto desactivado exitosamente');
                    } catch (error) {
                      console.error(error);
                      toast.error(
                        error.response?.data?.message ||
                          'Error al desactivar producto'
                      );
                    }
                  } else if (confirmType === 'editar') {
                    try {
                      await api.put(
                        `/productos/${selectedProducto.id}`,
                        formData
                      );
                      await fetchProductos(pagination.currentPage);
                      setShowConfirm(false);
                      closeForm();
                    } catch (error) {
                      console.error(error);
                      toast.error(
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
