import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCupon } from '../hooks/useCupon.js';
import api from '../api/axios';
import { Typography, Box } from '@mui/material';
import ProductCard from './ProductCard.jsx';


const ListaProductos = ({ idCategoria = null }) => {
  const [productos, setProductos] = useState([]);
  const [ratings, setRatings] = useState({});

  const { cupon } = useCupon();

  const handleRatingChange = (id, newValue) => {
    setRatings((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  };

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        let response;
        if (idCategoria) {
          // Si hay categoriaId, filtrar por categoría
          response = await api.get(`/productos/categoria/${idCategoria}`);
        } else {
          // Si no hay categoriaId, obtener todos los productos
          response = await api.get('/productos');
        }
        setProductos(response.data.data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    fetchProductos();
  }, [idCategoria]);

  if (productos.length === 0) {
    return (
      <Typography
        align='center'
        mt={4}>
        {idCategoria
          ? 'No hay productos en esta categoría'
          : 'No hay productos disponibles'}
      </Typography>
    );
  }

  console.log('Estado del cupón en ListaProductos:', cupon);

  return (
    <Box className='px-30 py-10 pb-10'>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 justify-center '>
        {productos.map((producto) => (
          <div
            key={producto.id}
            className='flex justify-center mb-10'>
            <ProductCard
              producto={producto}
              rating={ratings[producto.id]}
              onRatingChange={handleRatingChange}
              cupon={cupon}
            />
          </div>
        ))}
      </div>
    </Box>
  );
};

export default ListaProductos;
