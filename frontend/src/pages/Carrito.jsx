import {
  Box,
  Typography,
  Button,
  Grid,
  Divider,
  IconButton,
  TextField,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCarrito } from '../hooks/useCarrito';
import { useCupon } from '../hooks/useCupon';
import { useState } from 'react';

import ModalDetallePersonalizacion from '../components/ModalDetallePersonalizacion';

const Carrito = () => {
  const {
    carrito,
    eliminarProducto,
    incrementarCantidad,
    decrementarCantidad,
    totalCarrito,
    cantidadTotal,
    vaciarCarrito,
  } = useCarrito();

  const { cupon, aplicarCupon } = useCupon();
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [modalData, setModalData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const handleAplicarCupon = () => {
    if (!codigo.trim()) return;
    aplicarCupon(codigo)
      .then(() => {
        setMensaje('Cupón aplicado con éxito');
        setCodigo('');
      })
      .catch(() => setMensaje('Cupón inválido o expirado'));
    setTimeout(() => setMensaje(''), 3000);
  };

  const obtenerDescuento = () =>
    cupon?.porcentajeDescuento > 0
      ? (totalCarrito * cupon.porcentajeDescuento) / 100
      : 0;
  const totalConDescuento = totalCarrito - obtenerDescuento();

  const handleFinalizarCompra = () => {
    setToastOpen(true);
    vaciarCarrito();
    // Aquí podrías agregar lógica para enviar pedido al backend
  };

  if (!carrito || carrito.length === 0) {
    return (
      <Box
        textAlign='center'
        mt={4}>
        <ShoppingCartIcon sx={{ fontSize: 64, color: '#ccc' }} />
        <Typography
          variant='h5'
          color='text.secondary'>
          Tu carrito está vacío
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
        <Typography variant='h4'>Carrito de compras</Typography>
      </Box>

      <Grid
        container
        spacing={8}
        justifyContent='center'
        sx={{ p: 4, width: '95%', maxWidth: 'none', mx: 'auto' }}>
        {/* Lista de productos */}
        <Grid
          item
          xs={12}
          md={8}>
          {carrito.map((item) => (
            <Paper
              key={item.id}
              sx={{ p: 2, mb: 2, display: 'flex', gap: 2 }}>
              {/* Imagen */}
              {item.imagen && (
                <Box
                  component='img'
                  src={item.imagen}
                  alt={item.nombre}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: 1,
                  }}
                />
              )}

              <Box sx={{ flexGrow: 1 }}>
                <Typography variant='h6'>{item.nombre}</Typography>
                <Typography variant='body2'>
                  Precio unitario: ${item.precio.toFixed(2)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <IconButton
                    onClick={() => decrementarCantidad(item.id)}
                    size='small'>
                    <RemoveIcon />
                  </IconButton>
                  <Typography sx={{ mx: 1 }}>{item.cantidad}</Typography>
                  <IconButton
                    onClick={() => incrementarCantidad(item.id)}
                    size='small'>
                    <AddIcon />
                  </IconButton>
                </Box>

                {/* Producto personalizable */}
                {item.customData && (
                  <Box
                    sx={{
                      mt: 1,
                      p: 1,
                      backgroundColor: '#f0f4ff',
                      borderRadius: 1,
                    }}>
                    <Typography
                      variant='subtitle2'
                      fontWeight='bold'
                      color='primary'>
                      Personalizado
                    </Typography>
                    <Typography variant='body2'>
                      Archivos: {item.customData.archivos?.length || 0}
                    </Typography>
                    <Typography variant='body2'>
                      Fecha:{' '}
                      {new Date(
                        item.customData.fechaPersonalizacion
                      ).toLocaleDateString()}
                    </Typography>
                    <Button
                      size='small'
                      onClick={() => {
                        setModalData(item.customData);
                        setModalOpen(true);
                      }}>
                      Ver detalles
                    </Button>
                  </Box>
                )}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                }}>
                <Typography fontWeight='bold'>
                  ${(item.precio * item.cantidad).toFixed(2)}
                </Typography>
                <IconButton
                  onClick={() => eliminarProducto(item.id)}
                  color='error'>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Grid>

        {/* Resumen */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{ position: 'sticky', top: 24, alignSelf: 'flex-start' }}>
          <Paper sx={{ p: 2 }}>
            <Typography
              variant='h5'
              gutterBottom>
              Resumen
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography>Productos: {cantidadTotal}</Typography>
            <Typography>Subtotal: ${totalCarrito.toFixed(2)}</Typography>

            {/* Cupón */}
            {cupon && cupon.porcentajeDescuento > 0 ? (
              <Typography color='success.main'>
                Cupón aplicado: {cupon.codigo} (-{cupon.porcentajeDescuento}%)
              </Typography>
            ) : (
              <>
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <TextField
                    label='Código de cupón'
                    size='small'
                    fullWidth
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                  />
                  <Button
                    onClick={handleAplicarCupon}
                    variant='contained'
                    sx={{ backgroundColor: '#2b7fff' }}>
                    Aplicar
                  </Button>
                </Box>
                {mensaje && (
                  <Alert
                    severity={mensaje.includes('éxito') ? 'success' : 'error'}
                    sx={{ mt: 1 }}>
                    {mensaje}
                  </Alert>
                )}
              </>
            )}

            <Divider sx={{ my: 2 }} />
            <Typography variant='h6'>
              Total final: ${totalConDescuento.toFixed(2)}
            </Typography>
            <Button
              variant='contained'
              color='primary'
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleFinalizarCompra}>
              Finalizar Compra
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal para detalles de personalización */}
      <ModalDetallePersonalizacion
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        customData={modalData}
      />

      {/* Toast de compra exitosa */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert
          onClose={() => setToastOpen(false)}
          severity='success'
          sx={{ width: '100%' }}>
          ¡Gracias por tu compra! Nos comunicaremos a la brevedad.
          {/* Primero diseñamos, te mostramos, y luego imprimimos. */}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Carrito;
