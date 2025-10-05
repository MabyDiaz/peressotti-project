import api from '../api/axios';
import { useAuth } from '../../hooks/useAuth.js';
import { useCarrito } from '../../hooks/useCarrito.js';
import { Button } from '@mui/material';

const BotonMercadoPago = () => {
  const { carrito } = useCarrito();
  const { user } = useAuth();

  const handlePagar = async () => {
    if (carrito.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    try {
      const items = carrito.map((producto) => ({
        nombre: producto.nombre,
        cantidad: producto.cantidad,
        precio: producto.precio,
      }));

      const { data } = await api.post('/pagos/crear-preferencia', {
        items,
        clienteEmail: user?.email || 'cliente@ejemplo.com',
      });

      window.location.href = data.init_point; // redirige al checkout de Mercado Pago
    } catch (error) {
      console.error('Error iniciando pago:', error);
      alert('Hubo un error al conectar con Mercado Pago.');
    }
  };

  return (
    <Button
      fullWidth
      onClick={handlePagar}
      variant='contained'
      sx={{
        whiteSpace: 'nowrap',
        fontSize: { xs: '0.75rem', sm: '0.9rem' },
        px: { xs: 1, sm: 2 },
        py: { xs: 0.5, sm: 1 },
        backgroundColor: '#009EE3',
        '&:hover': { backgroundColor: '#007EB5' },
        fontWeight: 'bold',
        textTransform: 'none',
      }}>
      💳 Pagar con Mercado Pago
    </Button>
  );
};

export default BotonMercadoPago;
