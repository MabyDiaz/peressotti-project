import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCupon } from '../hooks/useCupon.js';
import api from '../api/axios';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Chip,
} from '@mui/material';
import Rating from '@mui/material/Rating';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

// Componentes reutilizables para precios
const PrecioOriginal = ({ precio }) => (
  <Typography
    variant='body1'
    sx={{
      fontSize: '0.8rem',
      textDecoration: 'line-through',
      color: 'text.secondary',
    }}>
    ${precio.toFixed(2)}
  </Typography>
);

const PrecioConDescuento = ({ precio, descuento, esCupon }) => (
  <Typography
    variant='body1'
    fontWeight='bold'
    sx={{ color: esCupon ? '#2b7fff' : '#ff5722', fontSize: '1.1rem' }}>
    ${precio}
    <Typography
      component='span'
      sx={{ color: 'green', fontSize: '0.8rem', ml: 1 }}>
      ({descuento}% OFF{esCupon ? ' cupón' : ''})
    </Typography>
  </Typography>
);

const PrecioNormal = ({ precio }) => (
  <Typography
    variant='body1'
    fontWeight='bold'
    sx={{ mt: 1, fontSize: '0.95rem' }}>
    ${precio.toFixed(2)}
  </Typography>
);

const ProductosDestacados = () => {
  const [productos, setProductos] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(loading);
  console.log(error);

  const { cupon } = useCupon();

  const calcularPrecioConDescuento = (precio, descuento) => {
    return (precio * (1 - descuento / 100)).toFixed(2);
  };

  const mostrarPrecio = (producto) => {
    // Prioridad: cupón sobre descuento del producto
    if (cupon && cupon.porcentajeDescuento > 0) {
      return (
        <Box sx={{ mt: 1 }}>
          <PrecioOriginal precio={producto.precio} />
          <PrecioConDescuento
            precio={calcularPrecioConDescuento(
              producto.precio,
              cupon.porcentajeDescuento
            )}
            descuento={cupon.porcentajeDescuento}
            esCupon={true}
          />
        </Box>
      );
    }

    if (producto.descuento > 0) {
      return (
        <Box sx={{ mt: 1 }}>
          <PrecioOriginal precio={producto.precio} />
          <PrecioConDescuento
            precio={calcularPrecioConDescuento(
              producto.precio,
              producto.descuento
            )}
            descuento={producto.descuento}
            esCupon={false}
          />
        </Box>
      );
    }

    return <PrecioNormal precio={producto.precio} />;
  };

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

      // Adaptar a la nueva estructura del backend
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

  return (
    <Box className='px-6 py-10 pb-10'>
      <Grid
        container
        spacing={4}
        justifyContent='center'>
        {productos.map((producto) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={producto.id}>
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
                producto.descuento > 0 && (
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

              <Link to={`/productos/${producto.id}`}>
                <CardMedia
                  component='img'
                  image={producto.imagen}
                  alt={producto.nombre}
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
                    to={`/productos/${producto.id}`}
                    sx={{
                      fontSize: '1rem',
                      mb: 0.5,
                      textDecoration: 'none',
                      color: 'inherit',
                    }}>
                    {producto.nombre}
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ fontSize: '0.8rem' }}>
                    {producto.descripcion}
                  </Typography>

                  <Rating
                    name={`rating-${producto.id}`}
                    value={ratings[producto.id] ?? producto.estrellas ?? 0}
                    precision={0.5}
                    onChange={(event, newValue) => {
                      handleRatingChange(producto.id, newValue);
                    }}
                    size='small'
                    sx={{ mt: 1 }}
                  />
                </Box>

                {mostrarPrecio(producto)}
              </CardContent>

              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                  component={Link}
                  to={`/producto/${producto.id}`}
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
    </Box>
  );
};

export default ProductosDestacados;
