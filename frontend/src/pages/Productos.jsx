import ListaProductos from '../components/ListaProductos.jsx';
import { Typography, Box } from '@mui/material';

const Productos = () => {
  return (
    <Box>
      <Typography
        component='h1'
        align='center'
        sx={{
          fontWeight: 'bold',
          my: 4,
          textTransform: 'uppercase',
          fontSize: {
            xs: '1.3rem',
            sm: '1.8rem',
            md: '2rem',
          },
        }}>
        Todos Nuestros Productos
      </Typography>
      <ListaProductos />
    </Box>
  );
};

export default Productos;
