import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCupon } from '../hooks/useCupon.js';
import api from '../api/axios.js';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import ProductCard from '../components/ProductCard.jsx';

const DetalleCategoria = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState({});

  const { cupon } = useCupon();

  const handleRatingChange = (productId, newValue) => {
    setRatings((prev) => ({
      ...prev,
      [productId]: newValue,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setCategoria(null);
        setProductos([]);

        console.log(`Cargando productos para categoría ID: ${id}`);

        const [categoriaRes, productosRes] = await Promise.all([
          api.get(`/categorias/${id}`),
          api.get(`/categorias/${id}/productos`),
        ]);
        const categoriaData = categoriaRes.data.data;
        const productosData = productosRes.data.data;

        setCategoria(categoriaData);
        setProductos(productosData);
      } catch (err) {
        console.error('Error completo:', err);
        setError(
          err.response?.data?.message ||
            'Error al cargar los datos. Verifica la consola.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        textAlign='center'
        mt={4}>
        <Alert severity='error'>{error}</Alert>
        <Button
          variant='outlined'
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}>
          Volver al inicio
        </Button>
      </Box>
    );
  }

  if (!categoria) {
    return (
      <Box
        textAlign='center'
        mt={4}>
        <Typography
          variant='h5'
          color='error'>
          Categoría no encontrada
        </Typography>
        <Button
          variant='outlined'
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}>
          Volver al inicio
        </Button>
      </Box>
    );
  }

  return (
    <Box className='p-6'>
      <Typography
        variant='h4'
        gutterBottom
        align='center'
        sx={{ fontWeight: 'bold', mb: 3 }}>
        {categoria.nombre}
      </Typography>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button
          variant='outlined'
          onClick={() => navigate('/productos')}
          sx={{
            mr: 2,
            color: '#2b7fff',
            borderColor: '#2b7fff',
            '&:hover': {
              backgroundColor: '#2b7fff',
              color: 'white',
            },
          }}>
          Ver todos los productos
        </Button>
        <Button
          variant='outlined'
          onClick={() => navigate(-1)}
          sx={{
            color: '#666',
            borderColor: '#666',
            '&:hover': {
              backgroundColor: '#666',
              color: 'white',
            },
          }}>
          Volver
        </Button>
      </Box>
      {productos.length === 0 ? (
        <Box
          textAlign='center'
          mt={4}>
          <Typography
            variant='h6'
            color='text.secondary'>
            No hay productos en esta categoría
          </Typography>
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ mt: 1 }}>
            Explora otras categorías o vuelve más tarde
          </Typography>
        </Box>
      ) : (
        <Grid
          container
          spacing={4}
          mt={2}
          justifyContent='center'>
          {productos.map((producto) => (
            <Grid
              item
              key={producto.id}
              xs={12}
              sm={6}
              md={3}>
              <div className='flex justify-center'>
                <ProductCard
                  producto={producto}
                  rating={ratings[producto.id] ?? producto.estrellas ?? 0}
                  onRatingChange={(newValue) =>
                    handleRatingChange(producto.id, newValue)
                  }
                  cupon={cupon}
                />
              </div>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default DetalleCategoria;
