import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCupon } from '../hooks/useCupon.js';
import api from '../api/axios.js';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Rating,
  CardActions,
  Chip,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

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

  // Función para calcular precio con descuento
  const calcularPrecioConDescuento = (precio, descuento) => {
    return (precio * (1 - descuento / 100)).toFixed(2);
  };

  // Función para mostrar el precio correcto
  const mostrarPrecio = (producto) => {
    // Prioridad: cupón sobre descuento del producto
    if (cupon && cupon.porcentajeDescuento > 0) {
      return (
        <Box>
          <Typography
            variant='body2'
            sx={{
              fontSize: '0.8rem',
              textDecoration: 'line-through',
              color: 'text.secondary',
            }}>
            ${producto.precio.toFixed(2)}
          </Typography>
          <Typography
            variant='body1'
            fontWeight='bold'
            sx={{ color: '#2b7fff', fontSize: '1rem' }}>
            $
            {calcularPrecioConDescuento(
              producto.precio,
              cupon.porcentajeDescuento
            )}
            <Typography
              component='span'
              sx={{ color: 'green', fontSize: '0.8rem', ml: 1 }}>
              ({cupon.porcentajeDescuento}% OFF cupón)
            </Typography>
          </Typography>
        </Box>
      );
    }

    if (producto.descuento > 0) {
      return (
        <Box>
          <Typography
            variant='body2'
            sx={{
              fontSize: '0.8rem',
              textDecoration: 'line-through',
              color: 'text.secondary',
            }}>
            ${producto.precio.toFixed(2)}
          </Typography>
          <Typography
            variant='body1'
            fontWeight='bold'
            sx={{ color: '#ff5722', fontSize: '1rem' }}>
            ${calcularPrecioConDescuento(producto.precio, producto.descuento)}
            <Typography
              component='span'
              sx={{ color: 'green', fontSize: '0.8rem', ml: 1 }}>
              ({producto.descuento}% OFF)
            </Typography>
          </Typography>
        </Box>
      );
    }

    return (
      <Typography
        variant='body1'
        fontWeight='bold'
        sx={{ fontSize: '0.95rem' }}>
        ${producto.precio.toFixed(2)}
      </Typography>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Limpiar estados al inicio
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

    // Solo ejecutar si tenemos un ID válido
    if (id) {
      fetchData();
    }
  }, [id]); // Dependencia en 'id' para re-ejecutar cuando cambie

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
          {productos.map((prod) => (
            <Grid
              item
              key={prod.id}
              xs={12}
              sm={6}
              md={3}>
              <Card
                sx={{
                  maxWidth: 260,
                  mx: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: 6,
                  },
                  position: 'relative',
                }}>
                {/* Mostrar chip de cupón si está activo */}
                {cupon && cupon.porcentajeDescuento > 0 && (
                  <Chip
                    icon={<LocalOfferIcon fontSize='small' />}
                    label={`Cupón ${cupon.porcentajeDescuento}% OFF`}
                    size='small'
                    color='primary'
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 1,
                      fontWeight: 'bold',
                      backgroundColor: '#2b7fff',
                      color: 'white',
                    }}
                  />
                )}

                {/* Mostrar chip de oferta solo si NO hay cupón activo Y el producto tiene descuento > 0 */}
                {(!cupon || cupon.porcentajeDescuento === 0) &&
                  prod.descuento > 0 && (
                    <Chip
                      icon={<LocalOfferIcon fontSize='small' />}
                      label='Oferta!'
                      size='small'
                      color='error'
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 1,
                        fontWeight: 'bold',
                      }}
                    />
                  )}

                <Link to={`/producto/${prod.id}`}>
                  <CardMedia
                    component='img'
                    image={prod.imagen}
                    alt={prod.nombre}
                    sx={{
                      height: 240,
                      objectFit: 'cover',
                    }}
                  />
                </Link>

                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    py: 1.5,
                    px: 2,
                  }}>
                  <Box>
                    <Typography
                      variant='h6'
                      component={Link}
                      to={`/producto/${prod.id}`}
                      sx={{
                        fontSize: '1rem',
                        mb: 0.5,
                        textDecoration: 'none',
                        color: 'inherit',
                      }}>
                      {prod.nombre}
                    </Typography>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{ fontSize: '0.8rem' }}>
                      {prod.descripcion}
                    </Typography>

                    <Rating
                      name={`rating-${prod.id}`}
                      value={ratings[prod.id] ?? prod.estrellas ?? 0}
                      precision={0.5}
                      onChange={(event, newValue) => {
                        handleRatingChange(prod.id, newValue);
                      }}
                      size='small'
                      sx={{ mt: 1 }}
                    />
                  </Box>

                  <Box sx={{ mt: 1 }}>{mostrarPrecio(prod)}</Box>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    component={Link}
                    to={`/producto/${prod.id}`}
                    variant='contained'
                    fullWidth
                    size='small'
                    startIcon={<ShoppingCartIcon />}
                    color='secondary'
                    sx={{
                      backgroundColor: '#2b7fff',
                      '&:hover': {
                        backgroundColor: '#ffffff',
                        border: '1px solid #2b7fff',
                        color: '#2b7fff',
                      },
                    }}>
                    Ver Producto
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default DetalleCategoria;
