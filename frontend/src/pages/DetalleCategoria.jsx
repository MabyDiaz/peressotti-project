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
import { FaArrowLeft } from 'react-icons/fa6';

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
    <Box className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <Button
          variant='contained'
          onClick={() => navigate(-1)}
          sx={{
            backgroundColor: '#6b7280',
            color: 'white',
            px: 4,
            py: 1.5,
            fontWeight: 'bold',
            textTransform: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: '#4b5563',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
            },
            transition: 'all 0.3s ease',
          }}
          startIcon={<FaArrowLeft />}>
          Volver
        </Button>

        <Button
          variant='contained'
          onClick={() => navigate('/productos')}
          sx={{
            backgroundColor: '#DC2626',
            color: 'white',
            px: 4,
            py: 1.5,
            fontWeight: 'bold',
            textTransform: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: '#B91C1C',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
            },
            transition: 'all 0.3s ease',
          }}>
          Ver todos los productos
        </Button>
      </div>

      {/* Título de la categoría */}
      <Typography
        variant='h4'
        gutterBottom
        align='center'
        sx={{
          fontWeight: 'bold',
          mb: 3,
          color: '#1F2937',
        }}>
        {categoria.nombre}
      </Typography>

      {/* Contenido principal */}
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
