import { useState, useEffect } from 'react';
import { useCupon } from '../hooks/useCupon.js';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Chip,
  Alert,
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const EntradaCupon = () => {
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('info'); // 'success', 'error', 'info'
  const { cupon, aplicarCupon, quitarCupon } = useCupon();

  const handleAplicar = async () => {
    if (!codigo.trim()) {
      setMensaje('Por favor ingresa un código de cupón');
      setTipoMensaje('error');
      return;
    }

    quitarCupon(); // limpia cupón actual

    const exito = await aplicarCupon(codigo.trim().toUpperCase());
    if (exito) {
      setMensaje('Cupón aplicado con éxito');
      setTipoMensaje('success');
      setCodigo('');
    } else {
      setMensaje('Cupón inválido o expirado');
      setTipoMensaje('error');
    }
  };

  // const handleQuitar = () => {
  //   quitarCupon();
  //   setMensaje('Cupón removido correctamente');
  //   setTipoMensaje('info');
  //   setCodigo('');
  // };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAplicar();
    }
  };

  // Limpiar mensaje automáticamente después de 5 segundos
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje('');
        setTipoMensaje('info');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 4,
        backgroundColor: '#f8f9fa',
      }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant='h6'
          sx={{
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            fontWeight: 'bold',
          }}>
          <LocalOfferIcon color='primary' />
          ¿Tienes un cupón de descuento?
        </Typography>

        {cupon ? (
          <Box sx={{ mb: 2 }}>
            <Chip
              icon={<CheckCircleIcon />}
              label={`${cupon.nombreCupon} - ${cupon.porcentajeDescuento}% OFF aplicado`}
              color='success'
              variant='filled'
              sx={{ mb: 2, fontSize: '0.9rem', py: 2 }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
            <TextField
              label='Código de Cupón'
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              size='small'
              placeholder='Ej: DESCUENTO10'
              sx={{ minWidth: 200 }}
              InputProps={{
                style: { textTransform: 'uppercase' },
              }}
            />
            <Button
              variant='contained'
              onClick={handleAplicar}
              disabled={!codigo.trim()}
              sx={{
                backgroundColor: '#2b7fff',
                '&:hover': {
                  backgroundColor: '#1e5bb8',
                },
              }}>
              Aplicar Cupón
            </Button>
          </Box>
        )}

        {mensaje && (
          <Alert
            severity={tipoMensaje}
            sx={{ mt: 2, maxWidth: 500, mx: 'auto' }}
            onClose={() => setMensaje('')}>
            {mensaje}
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default EntradaCupon;
