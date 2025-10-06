import { Typography, Box } from '@mui/material';
import ProductCard from './ProductCard.jsx';

const ListaProductos = ({ productos = [] }) => {
  if (!productos || productos.length === 0) {
    return (
      <Typography
        align='center'
        mt={4}>
        No hay productos disponibles
      </Typography>
    );
  }

  return (
    <Box className='lg:px-30  sm:px-10 '>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center'>
        {productos.map((producto) => (
          <div
            key={producto.id}
            className='mb-10 w-full'>
            <ProductCard
              producto={producto}
              className='w-full'
            />
          </div>
        ))}
      </div>
    </Box>
  );
};

export default ListaProductos;
