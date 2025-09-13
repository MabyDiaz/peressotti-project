import { Box, Container, Grid, Typography, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import img from '../assets/img/imanesalfabeto.jpg';

const BloqueHero = () => {
  return (
    <Box className='bg-blue-500 text-white py-12 mt-10'>
      <Container maxWidth='lg'>
        <Grid
          container
          spacing={2}
          direction={{ xs: 'column-reverse', sm: 'row' }}
          alignItems='center'
          justifyContent='center'>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              mr: { md: 4 },
            }}>
            <Box className='flex flex-col justify-center items-start h-full'>
              <Typography
                variant='h4'
                gutterBottom
                textTransform='uppercase'
                sx={{
                  fontSize: {
                    xs: '1.5rem',
                    sm: '1.8rem',
                    md: '2rem',
                  },
                  fontWeight: 'bold',
                }}>
                Abecedario Imantado
              </Typography>

              <Typography
                variant='body1'
                gutterBottom
                sx={{
                  maxWidth: '300px',
                  mb: 2,
                  fontSize: {
                    xs: '0.85rem',
                    sm: '0.95rem',
                    md: '1rem',
                  },
                }}>
                Tarjetas imantadas tamaño 4cm x 6cm, impresión fullcolor, con
                abecedario e imágenes de animales.
              </Typography>

              <Box className='flex gap-4'>
                <Button
                  variant='contained'
                  size='small'
                  startIcon={<ShoppingCartIcon />}
                  color='secondary'
                  sx={{
                    backgroundColor: '#ffffff',
                    color: 'black',
                    border: '1px solid #2b7fff',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#ffffff',
                      color: '#2b7fff',
                      transform: 'scale(1.05)',
                    },
                  }}>
                  Agregar al carrito
                </Button>

                <Button
                  variant='contained'
                  size='small'
                  color='secondary'
                  sx={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #2b7fff',
                    color: 'black',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#2b7fff',
                      transform: 'scale(1.05)',
                    },
                  }}>
                  Ver productos
                </Button>
              </Box>
            </Box>
          </Grid>

          <Grid
            item
            xs={1}
            sm={1}
            md={3}
          />

          <Grid
            item
            xs={12}
            md={5}>
            <Box className='flex justify-center'>
              <img
                src={img}
                alt='Productos de imprenta'
                className='w-[100%] max-w-[400px] h-[300px] object-cover rounded-lg shadow-lg'
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BloqueHero;
