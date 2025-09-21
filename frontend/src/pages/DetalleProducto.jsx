import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCupon } from '../hooks/useCupon.js';
import { useCarrito } from '../hooks/useCarrito.js';
import api from '../api/axios';
import { FaArrowLeft, FaMinus, FaPlus, FaCartShopping } from 'react-icons/fa6';
import ProductCard from '../components/ProductCard.jsx';
import FormPersonalizacion from '../components/FormPersonalizacion.jsx';

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarProducto } = useCarrito();
  const { cupon } = useCupon();
  const [openModal, setOpenModal] = useState(false);
  const [producto, setProducto] = useState(null);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensajeCarrito, setMensajeCarrito] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');

  const calcularPrecioConDescuento = (precio, descuento) =>
    parseFloat((precio * (1 - descuento / 100)).toFixed(2));

  const obtenerPrecioFinal = () => {
    if (!producto) return 0;
    if (cupon?.porcentajeDescuento > 0)
      return calcularPrecioConDescuento(
        producto.precio,
        cupon.porcentajeDescuento
      );
    if (producto.descuento > 0)
      return calcularPrecioConDescuento(producto.precio, producto.descuento);
    return producto.precio;
  };

  const aumentarCantidad = () => setCantidad((prev) => prev + 1);
  const disminuirCantidad = () =>
    setCantidad((prev) => (prev > 1 ? prev - 1 : 1));

  const agregarAlCarrito = () => {
    const precioFinal = obtenerPrecioFinal();
    const total = precioFinal * cantidad;
    agregarProducto(
      { id: producto.id, nombre: producto.nombre, precio: precioFinal },
      cantidad
    );
    setMensajeCarrito(
      `${cantidad} ${
        producto.nombre
      }(s) agregado(s) al carrito por $${total.toFixed(2)}`
    );
    setTimeout(() => setMensajeCarrito(''), 4000);
  };

  const fetchMensajes = useCallback(async () => {
    try {
      const res = await api.get(`/productos/${id}/mensajes`);
      setMensajes(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) return;
    try {
      await api.post(`/productos/${id}/mensajes`, { texto: nuevoMensaje });
      await fetchMensajes();
      setNuevoMensaje('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRatingChange = (idProducto, nuevoRating) => {
    setProductosRelacionados((prev) =>
      prev.map((p) =>
        p.id === idProducto ? { ...p, estrellas: nuevoRating } : p
      )
    );
  };

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: productoRes } = await api.get(`/productos/${id}`);
        setProducto(productoRes.data);

        try {
          const relacionadosRes = await api.get(
            `/productos/categoria/${productoRes.data.idCategoria}`
          );
          const relacionadosArray =
            relacionadosRes?.data?.data || relacionadosRes?.data || [];
          const relacionados = relacionadosArray
            .filter((p) => p.id !== parseInt(id))
            .slice(0, 4);
          setProductosRelacionados(relacionados);
        } catch (err) {
          console.error('Error al cargar productos relacionados:', err);
          setProductosRelacionados([]);
        }
      } catch (err) {
        console.error(err);
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
    fetchMensajes();
  }, [id, fetchMensajes]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600'></div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div
          className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'
          role='alert'>
          <strong className='font-bold'>Error: </strong>
          <span className='block sm:inline'>
            {error || 'Producto no encontrado'}
          </span>
        </div>
        <button
          onClick={() => navigate(-1)}
          className='mt-4 bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded transition-colors duration-200'>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <button
        onClick={() => navigate(-1)}
        className='mb-6 flex items-center text-gray-600 hover:text-red-600 transition-colors duration-200'>
        <FaArrowLeft className='mr-2' />
        Volver
      </button>
      <div className='max-w-5xl mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Imagen */}
          <div className='bg-white rounded-lg shadow-md overflow-hidden'>
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className='w-full h-105 object-cover'
            />
          </div>

          {/* Detalles */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h1 className='text-2xl font-bold text-gray-800 mb-2'>
              {producto.nombre}
            </h1>
            <p className='text-gray-600 mb-4'>{producto.descripcion}</p>

            {producto?.Categoria?.nombre && (
              <span className='inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded mb-4'>
                {producto.Categoria.nombre}
              </span>
            )}

            {/* Precio */}
            <div className='mb-4'>
              {producto.descuento > 0 && (
                <p className='text-gray-500 line-through'>
                  ${producto.precio.toFixed(2)}
                </p>
              )}
              <p className='text-3xl font-bold text-red-600'>
                ${obtenerPrecioFinal().toFixed(2)}
                {cupon
                  ? ` (${cupon.porcentajeDescuento}% OFF cupón)`
                  : producto.descuento > 0
                  ? ` (${producto.descuento}% OFF)`
                  : ''}
              </p>
            </div>

            <hr className='my-4' />

            {/* Cantidad */}
            <div className='flex items-center mb-4'>
              <label className='text-sm font-medium text-gray-700 mr-4'>
                Cantidad:
              </label>
              <button
                onClick={disminuirCantidad}
                disabled={cantidad <= 1}
                className='bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-l transition-colors duration-200 disabled:opacity-50'>
                <FaMinus />
              </button>
              <span className='bg-white border-t border-b border-gray-300 py-1 px-4 text-gray-700'>
                {cantidad}
              </span>
              <button
                onClick={aumentarCantidad}
                className='bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-r transition-colors duration-200'>
                <FaPlus />
              </button>
            </div>

            {/* Total */}
            <p className='text-xl font-bold text-gray-800 mb-4'>
              Total: ${(obtenerPrecioFinal() * cantidad).toFixed(2)}
            </p>

            {/* Botón */}
            {producto.esPersonalizable ? (
              <>
                <button
                  onClick={() => setOpenModal(true)}
                  className='w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition-colors duration-200'>
                  Personalizar Producto
                </button>
                <p className='text-gray-500 text-sm mt-2'>
                  Para poder agregar el producto al carrito, te pedimos
                  completar el formulario.
                </p>
              </>
            ) : (
              <button
                onClick={agregarAlCarrito}
                className='w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded flex items-center justify-center transition-colors duration-200'>
                <FaCartShopping className='mr-2' />
                Agregar al Carrito
              </button>
            )}

            {mensajeCarrito && (
              <p className='text-green-600 text-sm mt-2'>✅ {mensajeCarrito}</p>
            )}
          </div>
        </div>

        {/* Productos Relacionados */}
        <div className='mt-12'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6'>
            Productos Relacionados
          </h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
            {productosRelacionados.map((rel) => (
              <div
                key={rel.id}
                className='flex justify-center'>
                <ProductCard
                  producto={rel}
                  rating={rel.estrellas}
                  onRatingChange={handleRatingChange}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mensajes del producto */}
        <div className='mt-12'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6'>
            Mensajes del producto
          </h2>
          {mensajes.length === 0 ? (
            <p className='text-gray-500'>
              Aún no hay mensajes para este producto.
            </p>
          ) : (
            <ul className='list-disc list-inside mb-6'>
              {mensajes.map((msg) => (
                <li
                  key={msg.id}
                  className='text-gray-700'>
                  {msg.texto}
                </li>
              ))}
            </ul>
          )}

          <h3 className='text-lg font-bold text-gray-800 mb-2'>
            Agregar nuevo mensaje
          </h3>
          <textarea
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            placeholder='Escribí tu mensaje...'
            rows={4}
            className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
          />
          <button
            onClick={enviarMensaje}
            className='mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200'>
            Enviar Mensaje
          </button>
        </div>

        {/* Modal de personalización */}
        <FormPersonalizacion
          open={openModal}
          onClose={() => setOpenModal(false)}
          product={producto}
          onSubmit={async (customData) => {
            agregarProducto({ ...producto, customData }, cantidad);
            setOpenModal(false);
            setMensajeCarrito(
              `${cantidad} ${producto.nombre}(s) agregado(s) al carrito`
            );
            setTimeout(() => setMensajeCarrito(''), 4000);
          }}
        />
      </div>
    </div>
  );
};

export default DetalleProducto;
