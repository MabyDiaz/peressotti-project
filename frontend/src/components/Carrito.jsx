import {
  Box,
  Typography,
  Button,
  Divider,
  IconButton,
  TextField,
  Alert,
  Drawer,
  List,
  ListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useCarrito } from '../hooks/useCarrito';
import { useCupon } from '../hooks/useCupon';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalDetallePersonalizacion from './ModalDetallePersonalizacion';

const Carrito = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return {
    drawerOpen,
    toggleDrawer,
    CarritoDrawer: (
      <CarritoDrawer
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      />
    ),
  };
};

// Componente interno: el Drawer que se desliza
const CarritoDrawer = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { carrito, cantidadTotal, totalCarrito, vaciarCarrito } = useCarrito();
  const { eliminarProducto, incrementarCantidad, decrementarCantidad } =
    useCarrito();
  const { cupon, aplicarCupon } = useCupon();

  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [modalData, setModalData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [compraExitosa, setCompraExitosa] = useState(false);

  useEffect(() => {
    if (open) {
      setCompraExitosa(false); 
    }
  }, [open]);

  const obtenerDescuento = () =>
    cupon?.porcentajeDescuento > 0
      ? (totalCarrito * cupon.porcentajeDescuento) / 100
      : 0;

  const totalConDescuento = totalCarrito - obtenerDescuento();

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

  const handleFinalizarCompra = () => {
    setCompraExitosa(true);
    vaciarCarrito();
    onClose(); 

    // setTimeout(() => {
    //   navigate('/');
    // }, 2500);
  };

  if (!carrito || carrito.length === 0) {
    return (
      <Drawer
        anchor='right'
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: '90%', sm: '400px' },
            p: 3,
            backgroundColor: '#f9fafb',
          },
        }}>
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              backgroundColor: '#DC2626',
              borderRadius: '8px',
            }}>
            <Typography
              variant='h6'
              fontWeight='bold'
              color='#ffff'
              padding='6px 6px 6px 10px'>
              Tu Carrito
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '70vh',
              textAlign: 'center',
            }}>
            <ShoppingCartIcon sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
            <Typography
              variant='h6'
              color='text.secondary'
              fontWeight='bold'>
              Tu carrito está vacío
            </Typography>
            <Button
              variant='contained'
              sx={{
                mt: 3,
                backgroundColor: '#DC2626',
                '&:hover': { backgroundColor: '#4B5563' },
              }}
              onClick={onClose}>
              Seguir comprando
            </Button>
          </Box>
        </Box>
      </Drawer>
    );
  }

  return (
    <>
      <Drawer
        anchor='right'
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: '750px' },
            p: 2,
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
          },
        }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
            backgroundColor: '#DC2626',
            borderRadius: '8px',
          }}>
          <Typography
            variant='h6'
            fontWeight='bold'
            color='#fff'
            padding='6px 6px 6px 10px'>
            Tu Carrito ({cantidadTotal})
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: '#fff',
              fontSize: '10px',
            }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Contenido en dos columnas */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Columna izquierda: productos */}
          <Box sx={{ flex: 2, maxHeight: '100vh', overflowY: 'auto' }}>
            <List>
              {carrito.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    mb: 2,
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant='subtitle1'
                      fontWeight='bold'
                      color='#1F2937'
                      sx={{ mb: 1 }}>
                      {item.nombre}
                    </Typography>

                    {/* Contador */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <IconButton
                        onClick={() => decrementarCantidad(item.id)}
                        size='small'
                        sx={{
                          width: 23,
                          height: 23,
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          backgroundColor: '#f3f4f6',
                          '&:hover': { backgroundColor: '#e5e7eb' },
                        }}>
                        <RemoveIcon fontSize='small' />
                      </IconButton>
                      <Typography
                        sx={{
                          mx: 1,
                          fontWeight: 'bold',
                          minWidth: '18px',
                          textAlign: 'center',
                        }}>
                        {item.cantidad}
                      </Typography>
                      <IconButton
                        onClick={() => incrementarCantidad(item.id)}
                        size='small'
                        sx={{
                          width: 23,
                          height: 23,
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          backgroundColor: '#f3f4f6',
                          '&:hover': { backgroundColor: '#e5e7eb' },
                        }}>
                        <AddIcon fontSize='small' />
                      </IconButton>
                    </Box>

                    {/* Precio */}
                    <Typography
                      variant='body2'
                      color='text.secondary'>
                      Unitario: ${item.precio.toFixed(2)}
                    </Typography>
                    <Typography
                      variant='body1'
                      fontWeight='bold'
                      color='#DC2626'>
                      Total: ${(item.precio * item.cantidad).toFixed(2)}
                    </Typography>

                    {/* Personalización */}
                    {item.customData && (
                      <Box
                        sx={{
                          mt: 1,
                          p: 1,
                          backgroundColor: '#f3f4f6',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                        }}>
                        <Typography
                          variant='caption'
                          fontWeight='bold'
                          color='#374151'
                          sx={{ display: 'block', mb: 0.5 }}>
                          Producto Personalizado
                        </Typography>
                        <Button
                          size='small'
                          variant='outlined'
                          color='inherit'
                          onClick={() => {
                            setModalData(item.customData);
                            setModalOpen(true);
                          }}
                          sx={{
                            textTransform: 'none',
                            mt: 0.5,
                            borderColor: '#9ca3af',
                            color: '#374151',
                          }}>
                          Ver detalles
                        </Button>
                      </Box>
                    )}
                  </Box>

                  {/* Eliminar */}
                  <IconButton
                    edge='end'
                    onClick={() => eliminarProducto(item.id)}
                    sx={{
                      color: '#ef4444',
                      '&:hover': { backgroundColor: '#fee2e2' },
                    }}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Columna derecha: resumen */}
          <Box
            sx={{
              flex: 2,
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              p: 2,
              backgroundColor: '#f9fafb',
              display: 'flex',
              flexDirection: 'column',
              height: '100vh',
            }}>
            {/* Parte superior: contenido scrollable */}
            <Box sx={{ overflowY: 'auto', flexGrow: 1, mb: 2 }}>
              <Typography
                variant='h6'
                fontWeight='bold'
                color='#1F2937'
                gutterBottom>
                Resumen de la compra
              </Typography>

              {/* Lista resumida de productos */}
              {carrito.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}>
                  <Typography variant='body2'>{item.nombre}</Typography>
                  <Typography
                    variant='body2'
                    fontWeight='bold'>
                    ${item.precio.toFixed(2)}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 1 }} />

              {/* Subtotal */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1,
                }}>
                <Typography>Subtotal:</Typography>
                <Typography>${totalCarrito.toFixed(2)}</Typography>
              </Box>
            </Box>

            {/* Cupón */}
            {cupon && cupon.porcentajeDescuento > 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1,
                  p: 1,
                  backgroundColor: '#dcfce7',
                  borderRadius: '4px',
                }}>
                <Typography color='success.main'>
                  Descuento ({cupon.codigo}):
                </Typography>
                <Typography color='success.main'>
                  -${obtenerDescuento().toFixed(2)}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ mb: 2 }}>
                <TextField
                  size='small'
                  placeholder='Código de cupón'
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  sx={{ flexGrow: 1, mr: 1 }}
                />
                <Button
                  onClick={handleAplicarCupon}
                  variant='contained'
                  size='small'
                  sx={{
                    backgroundColor: '#DC2626',
                    '&:hover': { backgroundColor: '#B91C1C' },
                    whiteSpace: 'nowrap',
                  }}>
                  Aplicar
                </Button>
                {mensaje && (
                  <Alert
                    severity={mensaje.includes('éxito') ? 'success' : 'error'}
                    sx={{ mt: 1, fontSize: '0.8rem' }}>
                    {mensaje}
                  </Alert>
                )}
              </Box>
            )}

            <Divider sx={{ my: 1 }} />

            {/* Total */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 2,
              }}>
              <Typography
                variant='h6'
                fontWeight='bold'>
                Total:
              </Typography>
              <Typography
                variant='h6'
                fontWeight='bold'
                color='#DC2626'>
                ${totalConDescuento.toFixed(2)}
              </Typography>
            </Box>

            {/* Parte inferior: botones pegados abajo */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
              }}>
              <Button
                fullWidth
                onClick={onClose}
                variant='outlined'
                sx={{
                  borderColor: '#DC2626',
                  color: '#DC2626',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#fee2e2',
                    borderColor: '#B91C1C',
                  },
                }}>
                Seguir comprando
              </Button>
              <Button
                fullWidth
                variant='contained'
                onClick={handleFinalizarCompra}
                sx={{
                  backgroundColor: '#DC2626',
                  '&:hover': { backgroundColor: '#B91C1C' },
                  fontWeight: 'bold',
                  textTransform: 'none',
                }}>
                Finalizar Compra
              </Button>
            </Box>
          </Box>
        </Box>

        <Dialog
          open={compraExitosa}
          onClose={() => setCompraExitosa(false)}
          fullWidth
          maxWidth='sm'>
          <DialogTitle
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              bgcolor: '#111827',
              color: '#fff',
            }}>
            ¡Gracias por tu compra!
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center', py: 3 }}>
            <Typography
              variant='h6'
              sx={{ color: '#DC2626', fontWeight: 'bold' }}>
              Nos comunicaremos a la brevedad
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
            <Button
              variant='contained'
              sx={{
                backgroundColor: '#DC2626',
                '&:hover': { backgroundColor: '#B91C1C' },
              }}
              onClick={() => {
                setCompraExitosa(false);
                navigate('/');
              }}>
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      </Drawer>

      {/* Modal para detalles de personalización */}
      <ModalDetallePersonalizacion
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        customData={modalData}
      />
    </>
  );
};

export default Carrito;
