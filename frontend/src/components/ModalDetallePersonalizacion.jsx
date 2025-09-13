import { Dialog, DialogTitle, DialogContent, Typography, List, ListItem, ListItemText, Button } from '@mui/material';

const ModalDetallePersonalizacion = ({ open, onClose, customData }) => {
  if (!customData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Detalle de Personalización</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Nombre: {customData.nombreCliente}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Teléfono: {customData.telefonoCliente}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Comentarios: {customData.comentarios || '—'}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Fecha de personalización: {new Date(customData.fechaPersonalizacion).toLocaleString()}
        </Typography>
        {customData.archivos?.length > 0 && (
          <>
            <Typography variant="body1" sx={{ mt: 1 }}>Archivos adjuntos:</Typography>
            <List dense>
              {customData.archivos.map((file, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={file.name || file} />
                </ListItem>
              ))}
            </List>
          </>
        )}
        <Button onClick={onClose} variant="contained" sx={{ mt: 2 }}>Cerrar</Button>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetallePersonalizacion;
