import { Link } from 'react-router-dom';
import {
  FaEye,
  FaStar,
  FaStarHalfStroke,
  FaRegStar,
  FaTag,
} from 'react-icons/fa6';
import { useCupon } from '../hooks/useCupon.js';
import { getImageUrl } from '../utils/getImageUrl.js';

const ProductCard = ({ producto, rating, onRatingChange }) => {
  const { cupon } = useCupon();

  const calcularPrecioConDescuento = (precio, descuento) => {
    return (precio * (1 - descuento / 100)).toFixed(2);
  };

  const renderStars = (value) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => onRatingChange(producto.id, i)}
          className='cursor-pointer'>
          {i <= value ? (
            <FaStar className='text-yellow-500' />
          ) : i - 0.5 === value ? (
            <FaStarHalfStroke className='text-yellow-500' />
          ) : (
            <FaRegStar className='text-yellow-500' />
          )}
        </span>
      );
    }
    return stars;
  };

  const mostrarPrecio = () => {
    if (cupon && cupon.porcentajeDescuento > 0) {
      return (
        <div className='mt-1 space-y-0.5'>
          <p className='text-xs text-gray-500 line-through'>
            ${producto.precio.toFixed(2)}
          </p>
          <p className='text-sm font-bold text-blue-600'>
            $
            {calcularPrecioConDescuento(
              producto.precio,
              cupon.porcentajeDescuento
            )}
            <span className='text-green-600 text-xs ml-1'>
              ({cupon.porcentajeDescuento}% OFF cupón)
            </span>
          </p>
        </div>
      );
    }

    if (producto.descuento > 0) {
      return (
        <div className='mt-1 space-y-0.5'>
          <p className='text-xs text-gray-500 line-through'>
            ${producto.precio.toFixed(2)}
          </p>
          <p className='text-sm font-bold text-red-600'>
            ${calcularPrecioConDescuento(producto.precio, producto.descuento)}
            <span className='text-green-600 text-xs ml-1'>
              ({producto.descuento}% OFF)
            </span>
          </p>
        </div>
      );
    }

    return (
      <p className='mt-1 text-sm font-bold text-gray-800'>
        ${producto.precio.toFixed(2)}
      </p>
    );
  };

  return (
    <div className='bg-white rounded shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-105 max-w-[220px] mx-auto'>
      {/* Chip Cupón */}
      {cupon && cupon.porcentajeDescuento > 0 && (
        <div className='absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 z-10'>
          <FaTag size={10} />
          {cupon.porcentajeDescuento}% OFF
        </div>
      )}

      {/* Chip Oferta */}
      {(!cupon || cupon.porcentajeDescuento === 0) &&
        producto.descuento > 0 && (
          <div className='absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 z-10 shadow-md'>
            <FaTag size={10} />
            Oferta!
          </div>
        )}

      <Link to={`/productos/${producto.id}`}>
        <img
          src={getImageUrl(producto.imagenPrincipal) || null}
          alt={producto.nombre}
          className='w-full h-32 object-cover'
        />
      </Link>

      <div className='p-3 flex flex-col justify-between flex-grow'>
        <div>
          <Link
            to={`/productos/${producto.id}`}
            className='font-bold text-sm text-gray-800 hover:text-red-600 line-clamp-2'>
            {producto.nombre}
          </Link>
          <p className='text-xs text-gray-600 mt-1 line-clamp-2'>
            {producto.descripcion}
          </p>

          <div className='flex mt-2'>
            {renderStars(rating ?? producto.estrellas ?? 0)}
          </div>
        </div>

        {mostrarPrecio()}

        <Link
          to={`/producto/${producto.id}`}
          className='mt-3 w-full bg-[#e7000b] hover:bg-red-700 text-white text-xs font-bold py-2 px-3 rounded flex items-center justify-center transition-colors duration-200'>
          <FaEye
            size={14}
            className='mr-1'
          />
          Ver Detalle
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
