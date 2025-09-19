import React, { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { FaPlus, FaTimes, FaFileAlt } from 'react-icons/fa';

// Props opcionales: onClose(), onCreated()
export default function NewPedidoForm({
  onClose = () => {},
  onCreated = () => {},
}) {
  const [loading, setLoading] = useState(false);

  // Cliente
  const [emailCliente, setEmailCliente] = useState('');
  const [cliente, setCliente] = useState({
    id: '',
    nombre: '',
    apellido: '',
    telefono: '',
  });

  // Productos disponibles (traer desde la API)
  const [productos, setProductos] = useState([]);

  // Lineas de pedido
  const [lineas, setLineas] = useState([
    {
      id: Date.now(),
      productoId: '',
      nombre: '',
      descripcion: '',
      precio: 0,
      cantidad: 1,
      subtotal: 0,
    },
  ]);

  // Archivos
  const [archivos, setArchivos] = useState([]); // File[]

  // Datos del pedido
  const [numeroPedido] = useState(generateOrderNumber());
  const [fechaIngreso] = useState(new Date().toISOString().split('T')[0]); // yyyy-mm-dd
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [estado] = useState(true); // siempre activo cuando el admin crea
  const [estadoPedido] = useState('pendiente'); // no editable

  // Pago
  const [metodoPago, setMetodoPago] = useState('efectivo'); // efectivo | transferencia | mercadopago
  const [estadoPago, setEstadoPago] = useState('pendiente'); // pendiente | abonado | entrega | aprobado | rechazado
  const [comprobante, setComprobante] = useState(null);

  // Observaciones y total
  const [observaciones, setObservaciones] = useState('');
  const [total, setTotal] = useState(0);

  async function fetchProductos() {
    try {
      const res = await api.get('/productos?limit=1000');
      setProductos(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('No se pudieron cargar los productos');
    }
  }

  async function buscarClientePorEmail() {
    if (!emailCliente) return;
    try {
      const res = await api.get('/clientes', {
        params: { email: emailCliente },
      });
      // asumo que la API devuelve data: { data: [...] } o data: { data: cliente }
      const maybe = res.data?.data;
      let found = null;
      if (Array.isArray(maybe)) found = maybe[0];
      else found = maybe;
      if (found) {
        setCliente({
          id: found.id,
          nombre: found.nombre,
          apellido: found.apellido,
          telefono: found.telefono,
        });
        toast.success('Cliente cargado');
      } else {
        toast.info(
          'No existe un cliente con ese email. Complete los datos manualmente o cree el cliente'
        );
        setCliente({ id: '', nombre: '', apellido: '', telefono: '' });
      }
    } catch (err) {
      console.error(err);
      toast.error('Error al buscar cliente');
    }
  }

  function handleClienteChange(field, value) {
    setCliente((c) => ({ ...c, [field]: value }));
  }

  function addLinea() {
    setLineas((l) => [
      ...l,
      {
        id: Date.now(),
        productoId: '',
        nombre: '',
        descripcion: '',
        precio: 0,
        cantidad: 1,
        subtotal: 0,
      },
    ]);
  }

  function removeLinea(id) {
    setLineas((l) => l.filter((x) => x.id !== id));
  }

  function handleLineaChange(id, field, value) {
    setLineas((l) =>
      l.map((line) => {
        if (line.id !== id) return line;
        const updated = { ...line, [field]: value };
        // si cambiamos productoId, rellenamos nombre/descripcion/precio desde productos
        if (field === 'productoId') {
          const prod = productos.find((p) => String(p.id) === String(value));
          if (prod) {
            updated.nombre = prod.nombre || '';
            updated.descripcion =
              prod.descripcion || prod.descripcion_corta || '';
            updated.precio = Number(prod.precio || prod.price || 0);
          } else {
            updated.nombre = '';
            updated.descripcion = '';
            updated.precio = 0;
          }
        }
        // recalcular subtotal
        updated.cantidad = Number(updated.cantidad || 0);
        updated.precio = Number(updated.precio || 0);
        updated.subtotal = Number(
          (updated.precio * updated.cantidad).toFixed(2)
        );
        return updated;
      })
    );
  }

  const calculateTotals = useCallback(() => {
    const sum = lineas.reduce((acc, l) => acc + Number(l.subtotal || 0), 0);
    setTotal(Number(sum.toFixed(2)));
  }, [lineas]);

  function handleFilesSelected(e) {
    const files = Array.from(e.target.files || []);
    // aceptar solo tipos permitidos
    const allowed = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const filtered = files.filter((f) => allowed.includes(f.type));
    if (filtered.length !== files.length)
      toast.info('Se ignoraron archivos con formato no permitido');
    setArchivos((a) => [...a, ...filtered]);
    // reset input
    e.target.value = null;
  }

  function removeArchivo(index) {
    setArchivos((a) => a.filter((_, i) => i !== index));
  }

  function handleComprobanteSelected(e) {
    const f = e.target.files[0];
    setComprobante(f || null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // Validaciones básicas
    if (!cliente.nombre || !cliente.apellido || !cliente.telefono) {
      toast.error(
        'Complete los datos del cliente (nombre, apellido y teléfono)'
      );
      return;
    }
    if (lineas.length === 0) {
      toast.error('Agregue al menos un producto');
      return;
    }
    if (lineas.some((l) => !l.productoId || l.cantidad <= 0)) {
      toast.error('Revise que cada línea tenga producto y cantidad mayor a 0');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        numeroPedido,
        fechaIngreso,
        fechaEntrega: fechaEntrega || null,
        idCliente: cliente.id || null,
        cliente: {
          nombre: cliente.nombre,
          apellido: cliente.apellido,
          telefono: cliente.telefono,
          email: emailCliente,
        },
        estado,
        estadoPedido,
        metodoPago,
        estadoPago,
        observaciones,
        total,
        lineas: lineas.map((l) => ({
          productoId: l.productoId,
          nombre: l.nombre,
          descripcion: l.descripcion,
          precio: l.precio,
          cantidad: l.cantidad,
          subtotal: l.subtotal,
        })),
      };

      // Usamos FormData para enviar archivos
      const formData = new FormData();
      formData.append('data', JSON.stringify(payload));
      archivos.forEach((f) => formData.append('archivos', f));
      if (comprobante) formData.append('comprobante', comprobante);

      const res = await api.post('/pedidos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(res.data?.message || 'Pedido creado correctamente');
      onCreated(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Error al crear pedido';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  // cargar productos una sola vez al montar
  useEffect(() => {
    fetchProductos();
  }, []);

  // recalcular total cada vez que cambian las líneas
  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  // resetear estadoPago según método de pago
  useEffect(() => {
    if (metodoPago === 'mercadopago') {
      setEstadoPago('pendiente');
    } else {
      setEstadoPago('pendiente');
    }
  }, [metodoPago]);

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/60 z-50'>
      <div className='bg-white rounded shadow w-[900px] max-h-[90vh] overflow-y-auto p-6'>
        <h3 className='bg-red-600 text-white text-sm font-bold mb-4 text-center p-2 rounded uppercase'>
          Nuevo Pedido
        </h3>
        {/* <form
          onSubmit={handleSubmit}
          className='space-y-4'>
          <div className='grid grid-cols-3 gap-3'>
            <div className='flex flex-col w-[130px]'>
              <label className='text-xs font-medium text-gray-700 mb-1 pl-1'>
                Fecha
              </label>
              <input
                type='date'
                value={fechaIngreso}
                readOnly
                className='
                w-full
                px-3
                py-2      
                rounded-md
                bg-gray-100
                shadow-sm
                border
                border-gray-200
                focus:outline-none     
                text-sm
                '
              />
            </div>

            <div>
              <label className='block text-xs font-medium text-gray-700 pl-1'>
                Número de pedido
              </label>
              <input
                type='text'
                value={numeroPedido}
                readOnly
                className='
                w-full
                px-3
                py-2      
                rounded-md
                bg-gray-100
                shadow-sm
                border
                border-gray-200
                focus:outline-none     
                text-sm
                '
              />
            </div>
          </div> */}

        {/* Cliente */}
        {/* <div className='grid grid-cols-3 gap-3 items-end'>
            <div>
              <label className='block text-xs font-medium text-gray-700'>
                Email (buscar)
              </label>
              <div className='flex items-center gap-2 border rounded px-2 py-1'>
                <input
                  type='email'
                  value={emailCliente}
                  onChange={(e) => setEmailCliente(e.target.value)}
                  onBlur={buscarClientePorEmail}
                  placeholder='email@cliente.com'
                  className='flex-1 outline-none text-sm'
                />
                <button
                  type='button'
                  onClick={buscarClientePorEmail}
                  className='text-sm px-2 py-1 bg-gray-200 rounded'>
                  Buscar
                </button>
              </div>
              <p className='text-xs text-gray-400 mt-1'>
                Si el email existe se completan los datos automáticamente.
              </p>
            </div>
            <div>
              <label className='block text-xs font-medium text-gray-700'>
                Nombre
              </label>
              <input
                type='text'
                value={cliente.nombre}
                onChange={(e) => handleClienteChange('nombre', e.target.value)}
                className='w-full border rounded px-2 py-1 text-sm'
              />
            </div>
            <div>
              <label className='block text-xs font-medium text-gray-700'>
                Apellido
              </label>
              <input
                type='text'
                value={cliente.apellido}
                onChange={(e) =>
                  handleClienteChange('apellido', e.target.value)
                }
                className='w-full border rounded px-2 py-1 text-sm'
              />
            </div>
            <div>
              <label className='block text-xs font-medium text-gray-700'>
                Teléfono
              </label>
              <input
                type='text'
                value={cliente.telefono}
                onChange={(e) =>
                  handleClienteChange('telefono', e.target.value)
                }
                className='w-full border rounded px-2 py-1 text-sm'
              />
            </div>
            <div>
              <label className='block text-xs font-medium text-gray-700'>
                Fecha aproximada de entrega
              </label>
              <input
                type='date'
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
                className='w-full border rounded px-2 py-1 text-sm'
              />
            </div> */}

        {/* Productos */}
        {/* <div className='border-t pt-3'>
              <div className='flex justify-between items-center'>
                <h4 className='font-semibold'>Productos</h4>
                <button
                  type='button'
                  onClick={addLinea}
                  className='flex items-center gap-2 bg-gray-200 px-2 py-1 rounded text-sm'>
                  <FaPlus /> Añadir línea
                </button>
              </div>

              <div className='space-y-2 mt-3'>
                {lineas.map((line) => (
                  <div
                    key={line.id}
                    className='grid grid-cols-6 gap-2 items-center border rounded p-2'>
                    <div className='col-span-2'>
                      <label className='text-xs'>Producto</label>
                      <select
                        value={line.productoId}
                        onChange={(e) =>
                          handleLineaChange(
                            line.id,
                            'productoId',
                            e.target.value
                          )
                        }
                        className='w-full text-sm'>
                        <option value=''>-- Seleccionar producto --</option>
                        {productos.map((p) => (
                          <option
                            key={p.id}
                            value={p.id}>
                            {p.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className='text-xs'>Descripción</label>
                      <input
                        type='text'
                        value={line.descripcion}
                        readOnly
                        className='w-full text-sm bg-gray-50'
                      />
                    </div>
                    <div>
                      <label className='text-xs'>Precio</label>
                      <input
                        type='number'
                        value={line.precio}
                        onChange={(e) =>
                          handleLineaChange(line.id, 'precio', e.target.value)
                        }
                        className='w-full text-sm'
                        step='0.01'
                      />
                    </div>
                    <div>
                      <label className='text-xs'>Cantidad</label>
                      <input
                        type='number'
                        value={line.cantidad}
                        onChange={(e) =>
                          handleLineaChange(line.id, 'cantidad', e.target.value)
                        }
                        className='w-full text-sm'
                        min='1'
                      />
                    </div>
                    <div>
                      <label className='text-xs'>Subtotal</label>
                      <div className='w-full text-sm bg-gray-50 p-2 rounded'>
                        ${line.subtotal}
                      </div>
                    </div>
                    <div className='flex items-center justify-end gap-2'>
                      <button
                        type='button'
                        onClick={() => removeLinea(line.id)}
                        className='p-2 rounded bg-red-100 hover:bg-red-200 text-sm'>
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

        {/* Observaciones */}
        {/* <div className='border-t pt-3'>
              <label className='block text-xs font-medium text-gray-700'>
                Observaciones
              </label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder='Notas o comentarios sobre el pedido'
                className='w-full border rounded px-2 py-1 text-sm'
              />
            </div> */}

        {/* Archivos */}
        {/* <div className='border-t pt-3'>
              <label className='block text-xs font-medium text-gray-700'>
                Archivos del cliente
              </label>
              <input
                type='file'
                multiple
                accept='.jpg,.jpeg,.png,.webp,.pdf,.doc,.docx'
                onChange={handleFilesSelected}
                className='w-full text-sm'
              />
              <div className='mt-2 space-y-1'>
                {archivos.map((f, i) => (
                  <div
                    key={i}
                    className='flex items-center justify-between bg-gray-50 p-2 rounded'>
                    <div className='flex items-center gap-2'>
                      <FaFileAlt />
                      <span className='text-sm'>{f.name}</span>
                    </div>
                    <button
                      type='button'
                      onClick={() => removeArchivo(i)}
                      className='text-red-500 text-sm'>
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label className='block text-xs font-medium text-gray-700'>
                Método de pago
              </label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className='w-full border rounded px-2 py-1 text-sm'>
                <option value='efectivo'>Efectivo</option>
                <option value='transferencia'>Transferencia</option>
                <option value='mercadopago'>MercadoPago (solo sitio)</option>
              </select>
            </div>
            <div>
              <label className='block text-xs font-medium text-gray-700'>
                Estado de pago
              </label>
              <select
                value={estadoPago}
                onChange={(e) => setEstadoPago(e.target.value)}
                className='w-full border rounded px-2 py-1 text-sm'>
                {metodoPago === 'mercadopago' ? (
                  <>
                    <option value='pendiente'>Pendiente</option>
                    <option value='aprobado'>Aprobado</option>
                    <option value='rechazado'>Rechazado</option>
                  </>
                ) : (
                  <>
                    <option value='pendiente'>Pendiente</option>
                    <option value='abonado'>Abonado</option>
                    <option value='entrega'>Entrega</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className='block text-xs font-medium text-gray-700'>
                Comprobante (opcional)
              </label>
              <input
                type='file'
                accept='image/*,.pdf,.doc,.docx'
                onChange={handleComprobanteSelected}
                className='w-full text-sm'
              />
            </div>
          </div>

          <div className='flex items-center justify-between mt-4'>
            <div>
              <button
                type='submit'
                disabled={loading}
                className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm'>
                Guardar
              </button>
              <button
                type='button'
                onClick={onClose}
                className='ml-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm'>
                Cerrar
              </button>
            </div>
            <div className='text-right'>
              <div className='text-xs text-gray-500'>Total</div>
              <div className='text-lg font-bold'>${total}</div>
            </div>
          </div>
        </form> */}

        <form
          onSubmit={handleSubmit}
          className='space-y-4'>
          {/* Fecha y Número de Pedido */}
          <div className='grid grid-cols-3 gap-3'>
            <div className='flex flex-col w-[130px]'>
              <label className='text-xs font-medium text-gray-700 mb-1 pl-1'>
                Fecha
              </label>
              <input
                type='date'
                value={fechaIngreso}
                readOnly
                className='w-full px-3 py-2 rounded-md bg-gray-100 shadow-sm border border-gray-200 focus:outline-none text-sm'
              />
            </div>
            <div>
              <label className='block text-xs font-medium text-gray-700 pl-1'>
                Número de pedido
              </label>
              <input
                type='text'
                value={numeroPedido}
                readOnly
                className='w-full px-3 py-2 rounded-md bg-gray-100 shadow-sm border border-gray-200 focus:outline-none text-sm'
              />
            </div>
          </div>
          {/* Cliente */}
          <div className='grid grid-cols-3 gap-3 items-end'>
            <div>
              {' '}
              {/* Email */}
              <label className='block text-xs font-medium text-gray-700'>
                Email (buscar)
              </label>
              <div className='flex items-center gap-2 border rounded px-2 py-1'>
                <input
                  type='email'
                  value={emailCliente}
                  onChange={(e) => setEmailCliente(e.target.value)}
                  onBlur={buscarClientePorEmail}
                  placeholder='email@cliente.com'
                  className='flex-1 outline-none text-sm'
                />
                <button
                  type='button'
                  onClick={buscarClientePorEmail}
                  className='text-sm px-2 py-1 bg-gray-200 rounded'>
                  Buscar
                </button>
              </div>
              {/* <p className='text-xs text-gray-400 mt-1'>
                Si el email existe se completan los datos automáticamente.
              </p> */}
            </div>
            <div>
              {' '}
              {/* Nombre */}
              <label className='block text-xs font-medium text-gray-700'>
                Nombre
              </label>
              <input
                type='text'
                value={cliente.nombre}
                onChange={(e) => handleClienteChange('nombre', e.target.value)}
                className='w-full border rounded px-2 py-1 text-sm'
              />
            </div>
            <div>
              {' '}
              {/* Apellido */}
              <label className='block text-xs font-medium text-gray-700'>
                Apellido
              </label>
              <input
                type='text'
                value={cliente.apellido}
                onChange={(e) =>
                  handleClienteChange('apellido', e.target.value)
                }
                className='w-full border rounded px-2 py-1 text-sm'
              />
            </div>
            <div>
              {' '}
              {/* Teléfono */}
              <label className='block text-xs font-medium text-gray-700'>
                Teléfono
              </label>
              <input
                type='text'
                value={cliente.telefono}
                onChange={(e) =>
                  handleClienteChange('telefono', e.target.value)
                }
                className='w-full border rounded px-2 py-1 text-sm'
              />
            </div>
            <div>
              {' '}
              {/* Fecha de entrega */}
              <label className='block text-xs font-medium text-gray-700'>
                Fecha aproximada de entrega
              </label>
              <input
                type='date'
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
                className='w-full border rounded px-2 py-1 text-sm'
              />
            </div>
          </div>
          {/* Productos */}
          {/* <div className='border-t pt-3'>
            <div className='flex justify-between items-center'>
              <h4 className='font-semibold'>Productos</h4>
              <button
                type='button'
                onClick={addLinea}
                className='flex items-center gap-2 bg-gray-200 px-2 py-1 rounded text-sm'>
                <FaPlus /> Añadir línea
              </button>
            </div>
            <div className='space-y-2 mt-3'>
              {lineas.map((line) => (
                <div
                  key={line.id}
                  className='grid grid-cols-6 gap-2 items-center border rounded p-2'> */}
          {/* aquí van tus campos de producto como antes */}
          {/* </div>
              ))}
            </div>
          </div> */}
          <div className='border-t pt-3'>
            <div className='flex justify-between items-center'>
              <h4 className='font-semibold'>Productos</h4>
              <button
                type='button'
                onClick={addLinea}
                className='flex items-center gap-2 bg-gray-200 px-2 py-1 rounded text-sm'>
                <FaPlus /> Añadir línea
              </button>
            </div>

            <div className='space-y-2 mt-3'>
              {lineas.map((line) => (
                <div
                  key={line.id}
                  className='grid grid-cols-6 gap-2 items-center border rounded p-2'>
                  <div className='col-span-2'>
                    <label className='text-xs'>Producto</label>
                    <select
                      value={line.productoId}
                      onChange={(e) =>
                        handleLineaChange(line.id, 'productoId', e.target.value)
                      }
                      className='w-full text-sm'>
                      <option value=''>-- Seleccionar producto --</option>
                      {productos.map((p) => (
                        <option
                          key={p.id}
                          value={p.id}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className='text-xs'>Descripción</label>
                    <input
                      type='text'
                      value={line.descripcion}
                      readOnly
                      className='w-full text-sm bg-gray-50'
                    />
                  </div>
                  <div>
                    <label className='text-xs'>Precio</label>
                    <input
                      type='number'
                      value={line.precio}
                      onChange={(e) =>
                        handleLineaChange(line.id, 'precio', e.target.value)
                      }
                      className='w-full text-sm'
                      step='0.01'
                    />
                  </div>
                  <div>
                    <label className='text-xs'>Cantidad</label>
                    <input
                      type='number'
                      value={line.cantidad}
                      onChange={(e) =>
                        handleLineaChange(line.id, 'cantidad', e.target.value)
                      }
                      className='w-full text-sm'
                      min='1'
                    />
                  </div>
                  <div>
                    <label className='text-xs'>Subtotal</label>
                    <div className='w-full text-sm bg-gray-50 p-2 rounded'>
                      ${line.subtotal}
                    </div>
                  </div>
                  <div className='flex items-center justify-end gap-2'>
                    <button
                      type='button'
                      onClick={() => removeLinea(line.id)}
                      className='p-2 rounded bg-red-100 hover:bg-red-200 text-sm'>
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>{' '}
          {/* Observaciones */}
          <div className='border-t pt-3'>
            <label className='block text-xs font-medium text-gray-700'>
              Observaciones
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder='Notas o comentarios sobre el pedido'
              className='w-full border rounded px-2 py-1 text-sm'
            />
          </div>
          {/* Archivos */}
          <div className='border-t pt-3'>
            <label className='block text-xs font-medium text-gray-700'>
              Archivos del cliente
            </label>
            <input
              type='file'
              multiple
              accept='.jpg,.jpeg,.png,.webp,.pdf,.doc,.docx'
              onChange={handleFilesSelected}
              className='w-full text-sm'
            />
            <div className='mt-2 space-y-1'>
              {archivos.map((f, i) => (
                <div
                  key={i}
                  className='flex items-center justify-between bg-gray-50 p-2 rounded'>
                  <div className='flex items-center gap-2'>
                    <FaFileAlt />
                    <span className='text-sm'>{f.name}</span>
                  </div>
                  <button
                    type='button'
                    onClick={() => removeArchivo(i)}
                    className='text-red-500 text-sm'>
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Pago */}
          <div className='border-t pt-3 grid grid-cols-3 gap-3'>
            <div>
              <label className='block text-xs font-medium text-gray-700'>
                Método de pago
              </label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className='w-full border rounded px-2 py-1 text-sm'>
                <option value='efectivo'>Efectivo</option>
                <option value='transferencia'>Transferencia</option>
                <option value='mercadopago'>MercadoPago (solo sitio)</option>
              </select>
            </div>
            <div>
              <label className='block text-xs font-medium text-gray-700'>
                Estado de pago
              </label>
              <select
                value={estadoPago}
                onChange={(e) => setEstadoPago(e.target.value)}
                className='w-full border rounded px-2 py-1 text-sm'>
                {metodoPago === 'mercadopago' ? (
                  <>
                    <option value='pendiente'>Pendiente</option>
                    <option value='aprobado'>Aprobado</option>
                    <option value='rechazado'>Rechazado</option>
                  </>
                ) : (
                  <>
                    <option value='pendiente'>Pendiente</option>
                    <option value='abonado'>Abonado</option>
                    <option value='entrega'>Entrega</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className='block text-xs font-medium text-gray-700'>
                Comprobante (opcional)
              </label>
              <input
                type='file'
                accept='image/*,.pdf,.doc,.docx'
                onChange={handleComprobanteSelected}
                className='w-full text-sm'
              />
            </div>
          </div>
          {/* Botones y total */}
          <div className='flex items-center justify-between mt-4'>
            <div>
              <button
                type='submit'
                disabled={loading}
                className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm'>
                Guardar
              </button>
              <button
                type='button'
                onClick={onClose}
                className='ml-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm'>
                Cerrar
              </button>
            </div>
            <div className='text-right'>
              <div className='text-xs text-gray-500'>Total</div>
              <div className='text-lg font-bold'>${total}</div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helpers
function generateOrderNumber() {
  // Formato: PED-YYYYMMDD-HHMMSS-rand(3)
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const dt = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const tm = `${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  const rand = Math.floor(Math.random() * 900) + 100;
  return `PED-${dt}-${tm}-${rand}`;
}
