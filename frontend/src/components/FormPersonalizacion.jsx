// src/components/FormPersonalizacion.jsx
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Stack,
} from '@mui/material';

const FormPersonalizacion = ({ open, onClose, product, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombreCliente: '',
    telefonoCliente: '',
    comentarios: '',
    archivos: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, archivos: files }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombreCliente.trim())
      newErrors.nombreCliente = 'Nombre requerido';
    if (!formData.telefonoCliente.trim())
      newErrors.telefonoCliente = 'Teléfono requerido';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        nombreCliente: '',
        telefonoCliente: '',
        comentarios: '',
        archivos: [],
      });
      onClose();
    } catch (err) {
      console.error('Error al enviar personalización:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth>
      <DialogTitle>Personalizar Producto</DialogTitle>
      <DialogContent dividers>
        <Typography
          variant='subtitle1'
          mb={2}>
          {product?.nombre}
        </Typography>
        <Typography
          variant='body2'
          color='text.secondary'
          mb={2}>
          {product?.descripcion}
        </Typography>

        <Stack spacing={2}>
          <TextField
            label='Nombre completo *'
            name='nombreCliente'
            value={formData.nombreCliente}
            onChange={handleChange}
            error={!!errors.nombreCliente}
            helperText={errors.nombreCliente}
            fullWidth
          />

          <TextField
            label='Teléfono *'
            name='telefonoCliente'
            value={formData.telefonoCliente}
            onChange={handleChange}
            error={!!errors.telefonoCliente}
            helperText={errors.telefonoCliente}
            fullWidth
          />

          <TextField
            label='Comentarios / instrucciones'
            name='comentarios'
            value={formData.comentarios}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
          />

          <Button
            variant='outlined'
            component='label'>
            Adjuntar archivos
            <input
              type='file'
              hidden
              multiple
              accept='.jpg,.jpeg,.png,.pdf,.ai,.psd'
              onChange={handleFileChange}
            />
          </Button>
          {formData.archivos.length > 0 && (
            <Typography variant='body2'>
              Archivos seleccionados: {formData.archivos.length}
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant='contained'
          disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar y continuar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormPersonalizacion;
