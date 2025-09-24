// Ver detalle en el Carrito
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Divider,
} from '@mui/material';

const ModalDetallePersonalizacion = ({ open, onClose, customData }) => {
  if (!customData) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='xs'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        },
      }}>
      {/* Título */}
      <DialogTitle
        sx={{
          backgroundColor: '#DC2626',
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
          position: 'relative',
          py: 1.2,
          mb: 1.5,
          fontSize: '1rem',
        }}>
        Detalles de Personalización
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {/* Fecha */}
          <Box>
            <Typography
              variant='subtitle2'
              fontWeight='bold'
              color='#DC2626' // Rojo para el label
              gutterBottom>
              Fecha de personalización:
            </Typography>
            <Typography variant='body1'>
              {new Date(customData.fechaPersonalizacion).toLocaleDateString(
                'es-ES',
                {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }
              )}
            </Typography>
          </Box>

          <Divider sx={{ my: 0.5 }} />

          {/* Nombre del cliente */}
          <Box>
            <Typography
              variant='subtitle2'
              fontWeight='bold'
              color='#DC2626'
              gutterBottom>
              Nombre del cliente:
            </Typography>
            <Typography variant='body1'>{customData.nombreCliente}</Typography>
          </Box>

          <Divider sx={{ my: 0.5 }} />

          {/* Teléfono del cliente */}
          <Box>
            <Typography
              variant='subtitle2'
              fontWeight='bold'
              color='#DC2626'
              gutterBottom>
              Teléfono:
            </Typography>
            <Typography variant='body1'>
              {customData.telefonoCliente || 'No proporcionado'}
            </Typography>
          </Box>

          <Divider sx={{ my: 0.5 }} />

          {/* Comentarios */}
          <Box>
            <Typography
              variant='subtitle2'
              fontWeight='bold'
              color='#DC2626'
              gutterBottom>
              Comentarios:
            </Typography>
            <Typography variant='body1'>
              {customData.comentarios || 'Sin comentarios'}
            </Typography>
          </Box>

          <Divider sx={{ my: 0.5 }} />

          {/* Archivos */}
          <Box>
            <Typography
              variant='subtitle2'
              fontWeight='bold'
              color='#DC2626'
              gutterBottom>
              Archivos adjuntos:
            </Typography>
            <Typography variant='body1'>
              {customData.archivos?.length || 0} archivo(s)
            </Typography>
            {customData.archivos && customData.archivos.length > 0 && (
              <Box sx={{ mt: 1, pl: 2 }}>
                {customData.archivos.map((archivo, index) => (
                  <Typography
                    key={index}
                    variant='body2'
                    sx={{ color: '#6b7280' }}>
                    • {archivo.name || `archivo_${index + 1}`}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={onClose}
          variant='contained'
          fullWidth
          sx={{
            backgroundColor: '#DC2626',
            color: 'white',
            fontWeight: 'bold',
            py: 1.5,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#B91C1C',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.2s ease',
          }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDetallePersonalizacion;
