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
  CardMedia,
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
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import ModalDetallePersonalizacion from './ModalDetallePersonalizacion';
import ModalLoginCliente from '../components/auth/LoginModal.jsx';
import { getImageUrl } from '../utils/getImageUrl.js';

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
  const { user } = useAuth();
  const {
    carrito,
    cantidadTotal,
    subtotal,
    descuentoPorCupon,
    totalCarrito,
    vaciarCarrito,
    eliminarProducto,
    aumentarCantidad,
    disminuirCantidad,
  } = useCarrito();
  const { cupon, aplicarCupon } = useCupon();
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [modalData, setModalData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [compraExitosa, setCompraExitosa] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setCompraExitosa(false);
    }
  }, [open]);

  const handleAplicarCupon = () => {
    if (!user) {
      toast.error('Debes iniciar sesión para aplicar un cupón');
      setLoginModalOpen(true);
      return;
    }

    if (!codigo.trim()) return;

    aplicarCupon(codigo)
      .then(() => {
        toast.success('Cupón aplicado con éxito');
        setCodigo('');
      })
      .catch(() => toast.error('Cupón inválido o expirado'));

    setTimeout(() => setMensaje(''), 3000);
  };

  const handleFinalizarCompra = () => {
    setCompraExitosa(true);
    // vaciarCarrito();
  };

  return (
    <>
      {carrito && carrito.length > 0 ? (
        <Drawer
          anchor='right'
          open={open}
          onClose={onClose}
          PaperProps={{
            sx: {
              width: { xs: '100%', sm: '70%' },
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
              backgroundColor: '#e7000b',
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
              sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Contenido en dos columnas */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 1,
            }}>
            {/* Columna izquierda: productos */}
            <Box
              sx={{
                flex: 2,
                flexDirection: 'column',
                maxHeight: { xs: 'auto', md: '100vh' }, // que no se corte en móviles
                overflowY: { md: 'auto' }, // scroll solo en desktop
              }}>
              <List sx={{ padding: '0px' }}>
                {carrito.map((item) => (
                  <ListItem
                    key={item.id}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      mb: 2,
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      p: 2,
                    }}>
                    {/* FILA SUPERIOR: imagen + nombre */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 1,
                      }}>
                      <CardMedia
                        component='img'
                        image={getImageUrl(item.imagenPrincipal)}
                        alt={item.nombre}
                        sx={{
                          width: 50,
                          height: 50,
                          objectFit: 'cover',
                          borderRadius: 2,
                        }}
                      />
                      <Typography
                        variant='subtitle1'
                        fontWeight='bold'>
                        {item.nombre}
                      </Typography>
                    </Box>

                    {/* FILA INFERIOR: dos columnas */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mt: 1,
                        gap: 2,
                      }}>
                      {/* COLUMNA IZQUIERDA */}
                      <Box sx={{ flex: 1 }}>
                        {/* Botones de cantidad */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 1,
                          }}>
                          <Button
                            size='small'
                            onClick={() => disminuirCantidad(item.id)}
                            sx={{
                              width: 28,
                              height: 28,
                              minWidth: 0,
                              color: '#1F2937',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              backgroundColor: '#f3f4f6',
                              '&:hover': { backgroundColor: '#e5e7eb' },
                            }}>
                            -
                          </Button>
                          <Typography>{item.cantidad}</Typography>
                          <Button
                            size='small'
                            onClick={() => aumentarCantidad(item.id)}
                            sx={{
                              width: 28,
                              height: 28,
                              minWidth: 0,
                              color: '#1F2937',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              backgroundColor: '#f3f4f6',
                              '&:hover': { backgroundColor: '#e5e7eb' },
                            }}>
                            +
                          </Button>
                        </Box>

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

                      {/* COLUMNA DERECHA */}
                      <Box sx={{ textAlign: 'right', minWidth: 120 }}>
                        <Typography
                          variant='body2'
                          color='text.secondary'>
                          Precio unitario: ${item.precio}
                        </Typography>
                        <Typography
                          variant='subtitle2'
                          fontWeight='bold'
                          color='#e7000b'
                          sx={{ mt: 0.5 }}>
                          Total: ${item.precio * item.cantidad}
                        </Typography>
                        <IconButton
                          color='error'
                          size='small'
                          sx={{ mt: 1 }}
                          onClick={() => eliminarProducto(item.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
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
                height: { xs: 'auto', md: '100vh' },
                mt: { xs: 2, md: 0 },
              }}>
              <Box sx={{ overflowY: 'auto', flexGrow: 1, mb: 2 }}>
                <Typography
                  variant='h6'
                  fontWeight='bold'
                  gutterBottom>
                  Resumen de la compra
                </Typography>

                {/* Encabezado de columnas */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                    px: 1,
                    py: 1,
                    backgroundColor: '#f3f4f6',
                    borderRadius: '6px',
                    borderBottom: '2px solid #e5e7eb',
                  }}>
                  <Typography
                    sx={{
                      flex: 1,
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      textAlign: 'left',
                      textTransform: 'uppercase',
                      color: '#374151',
                    }}>
                    Cant.
                  </Typography>
                  <Typography
                    sx={{
                      flex: 3,
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      textAlign: 'left',
                      textTransform: 'uppercase',
                      color: '#374151',
                    }}>
                    Nombre
                  </Typography>
                  <Typography
                    sx={{
                      flex: 1,
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      color: '#374151',
                    }}>
                    Precio
                  </Typography>
                </Box>

                {carrito.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                      px: 1,
                      alignItems: 'center',
                    }}>
                    {/* Columna Cantidad */}
                    <Typography
                      sx={{ flex: 1, fontSize: '0.9rem', textAlign: 'left' }}>
                      {item.cantidad}
                    </Typography>

                    {/* Columna Nombre */}
                    <Typography
                      sx={{ flex: 3, fontSize: '0.9rem', textAlign: 'left' }}>
                      {item.nombre}
                    </Typography>

                    {/* Columna Precio Total */}
                    <Typography
                      sx={{
                        flex: 1,
                        textAlign: 'right',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                      }}>
                      ${(item.precio * item.cantidad).toFixed(2)}
                    </Typography>
                  </Box>
                ))}

                <Divider sx={{ my: 1 }} />

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                    px: 1,
                  }}>
                  <Typography
                    sx={{
                      fontSize: '0.95rem',
                      color: '#e7000b',
                      fontWeight: 'bold',
                    }}>
                    Subtotal:
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.95rem',
                      color: '#e7000b',
                      fontWeight: 'bold',
                    }}>
                    ${subtotal.toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              {/* Cupón */}
              <Box
                sx={{
                  mb: 2,
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'stretch', md: 'center' },
                  gap: { xs: 1, md: 1.5 },
                }}>
                <TextField
                  size='small'
                  placeholder='Código de cupón'
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  sx={{
                    flex: 1,
                    '& .MuiInputBase-root': {
                      height: { xs: 36, sm: 40, md: 42 },
                    },
                    '& input::placeholder': {
                      fontSize: { xs: '0.75rem', sm: '0.85rem' },
                    },
                  }}
                />
                <Button
                  onClick={handleAplicarCupon}
                  variant='contained'
                  size='small'
                  sx={{
                    textTransform: 'capitalize',
                    height: { xs: 36, sm: 40, md: 42 },
                    flexGrow: 0,
                    minWidth: { xs: 80, sm: 100, md: 110 },
                    px: { xs: 1, sm: 2 },
                    fontSize: { xs: '0.75rem', sm: '0.85rem' },
                    backgroundColor: '#e7000b',
                    alignSelf: { xs: 'stretch', md: 'flex-end' },
                    '&:hover': { backgroundColor: '#B91C1C' },
                  }}>
                  Aplicar
                </Button>
                {mensaje && (
                  <Alert
                    severity={mensaje.includes('éxito') ? 'success' : 'error'}
                    sx={{
                      mt: { xs: 1, md: 0 },
                      fontSize: '0.8rem',
                      flexBasis: '100%',
                    }}>
                    {mensaje}
                  </Alert>
                )}
              </Box>

              <Divider sx={{ my: 1 }} />

              {cupon && descuentoPorCupon > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    px: 1,
                    mb: 1,
                  }}>
                  <Typography
                    sx={{
                      fontSize: '0.9rem',
                      color: '#16a34a',
                      fontWeight: 'bold',
                    }}>
                    Descuento ({cupon.nombreCupon} - {cupon.porcentajeDescuento}
                    %)
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.9rem',
                      color: '#16a34a',
                      fontWeight: 'bold',
                    }}>
                    -${descuentoPorCupon.toFixed(2)}
                  </Typography>
                </Box>
              )}

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
                  color='#e7000b'>
                  ${totalCarrito.toFixed(2)}
                </Typography>
              </Box>

              {/* Botones */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  fullWidth
                  onClick={onClose}
                  variant='outlined'
                  sx={{
                    whiteSpace: 'nowrap',
                    fontSize: { xs: '0.75rem', sm: '0.9rem' },
                    px: { xs: 1, sm: 2 },
                    py: { xs: 0.5, sm: 1 },
                    borderColor: '#e7000b',
                    color: '#e7000b',
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
                    whiteSpace: 'nowrap',
                    fontSize: { xs: '0.75rem', sm: '0.9rem' },
                    px: { xs: 1, sm: 2 },
                    py: { xs: 0.5, sm: 1 },
                    backgroundColor: '#e7000b',
                    '&:hover': { backgroundColor: '#B91C1C' },
                    fontWeight: 'bold',
                    textTransform: 'none',
                  }}>
                  Finalizar Compra
                </Button>
              </Box>
            </Box>
          </Box>
        </Drawer>
      ) : (
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
                backgroundColor: '#e7000b',
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
              <ShoppingCartIcon
                sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }}
              />
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
                  backgroundColor: '#e7000b',
                  '&:hover': { backgroundColor: '#4B5563' },
                }}
                onClick={onClose}>
                Seguir comprando
              </Button>
            </Box>
          </Box>
        </Drawer>
      )}

      <Dialog
        open={compraExitosa}
        onClose={() => setCompraExitosa(false)}
        PaperProps={{
          sx: {
            maxWidth: 400,
            width: '90%',
            borderRadius: 3,
            maxHeight: 250,
            height: 'auto',
            p: 1,
          },
        }}>
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            bgcolor: '#e7000b',
            color: '#fff',
            fontSize: '1.1rem',
            pb: 1,
            mb: 2,
          }}>
          ¡Gracias por tu compra!
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', p: '0px 24px 10px' }}>
          <Typography
            variant='h6'
            sx={{
              color: '#e7000b',
              fontWeight: 'bold',
              fontSize: '1rem',
            }}>
            Nos comunicaremos a la brevedad
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 1 }}>
          <Button
            variant='contained'
            size='small'
            sx={{
              backgroundColor: '#e7000b',
              '&:hover': { backgroundColor: '#B91C1C' },
              fontSize: '0.8rem',
              py: 0.5,
              px: 2,
            }}
            onClick={() => {
              vaciarCarrito();
              setCompraExitosa(false);
              onClose();
              navigate('/');
            }}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de personalización */}
      <ModalDetallePersonalizacion
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        customData={modalData}
      />

      <ModalLoginCliente
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        sx={{ zIndex: 3000 }}
      />
    </>
  );
};

export default Carrito;
