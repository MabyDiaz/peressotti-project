import { Link } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material';
import Rating from '@mui/material/Rating';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useCupon } from '../hooks/useCupon.js';
import { getImageUrl } from '../utils/getImageUrl.js';

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

const ProductCard = ({ producto, rating, onRatingChange }) => {
  const { cupon } = useCupon();

  const calcularPrecioConDescuento = (precio, descuento) => {
    return (precio * (1 - descuento / 100)).toFixed(2);
  };

  const mostrarPrecio = () => {
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

  return (
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
      {/* Chip Cupón */}
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

      {/* Chip Oferta */}
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
          image={getImageUrl(producto.imagen)}
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
            value={rating ?? producto.estrellas ?? 0}
            precision={0.5}
            onChange={(event, newValue) => {
              onRatingChange(producto.id, newValue);
            }}
            size='small'
            sx={{ mt: 1 }}
          />
        </Box>

        {mostrarPrecio()}
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
  );
};

export default ProductCard;
