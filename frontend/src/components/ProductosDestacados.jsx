import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Box, Typography } from '@mui/material';
import ProductCard from './ProductCard';

const ProductosDestacados = () => {
  const [productos, setProductos] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleRatingChange = (id, newValue) => {
    setRatings((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  };

  useEffect(() => {
    const fetchProductosDestacados = async () => {
      try {
        setLoading(true);
        const response = await api.get('/productos/destacados');
        const productosArray = response.data?.data || [];
        const productosConOferta = productosArray.filter(
          (producto) => producto.descuento > 0
        );
        setProductos(productosConOferta);
      } catch (error) {
        console.error('Error al cargar productos destacados:', error);
        setError('Error al cargar productos destacados');
      } finally {
        setLoading(false);
      }
    };

    fetchProductosDestacados();
  }, []);

  if (productos.length === 0) {
    return (
      <Typography
        align='center'
        mt={4}>
        No hay productos destacados disponibles
      </Typography>
    );
  }

  if (loading) {
    return (
      <Typography
        align='center'
        mt={4}>
        Cargando productos destacados...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography
        align='center'
        mt={4}
        color='error'>
        {error}
      </Typography>
    );
  }

  return (
    <Box className='px-20 py-10 pb-6'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-1  lg:px-12 justify-center'>
        {productos.map((producto) => (
          <div
            key={producto.id}
            className='flex justify-center'>
            <ProductCard
              producto={producto}
              rating={ratings[producto.id]}
              onRatingChange={handleRatingChange}
            />
          </div>
        ))}
      </div>
    </Box>
  );
};

export default ProductosDestacados;
