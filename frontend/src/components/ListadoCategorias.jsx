import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Typography,
} from '@mui/material';

function ListadoCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/categorias');
        console.log(data);
        setCategorias(data.data);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
        setError('Error al cargar categorías');
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  if (loading) {
    return (
      <Typography
        align='center'
        mt={4}>
        Cargando categorías...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography
        align='center'
        mt={4}
        color='error'>
        {error}
      </Typography>
    );
  }

  if (categorias.length === 0) {
    return (
      <Typography
        align='center'
        mt={4}>
        No hay categorías disponibles
      </Typography>
    );
  }

  return (
    <Box className='pt-15 pb-15 bg-blue-500 text-white'>
      <Typography
        variant='h4'
        align='center'
        gutterBottom
        sx={{
          fontWeight: 'bold',
          mb: 4,
          textTransform: 'uppercase',
          fontSize: {
            xs: '1.4rem',
            sm: '1.7rem',
            md: '2rem',
          },
        }}>
        Catálogo de Productos
      </Typography>

      <Grid
        container
        spacing={4}
        justifyContent='center'
        sx={{ marginBottom: 4 }}>
        {categorias.map((cat) => (
          <Grid
            item
            key={cat.id}
            xs={12}
            sm={6}
            md={3}>
            <Card
              sx={{
                width: 260,
                height: 280,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                position: 'relative',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 6,
                },
              }}>
              <CardActionArea
                onClick={() => navigate(`/categoria/${cat.id}`)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}>
                <Box
                  sx={{
                    width: '100%',
                    height: 180,
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                  <CardMedia
                    component='img'
                    image={
                      cat.imagenURL.includes('drive.google.com/uc?id=')
                        ? cat.imagenURL.replace('uc?id=', 'thumbnail?id=')
                        : cat.imagenURL
                    }
                    alt={cat.nombre}
                    sx={{
                      width: '100%',
                      height: 180,
                      objectFit: 'cover',
                    }}
                  />
                </Box>
                <CardContent
                  sx={{
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    py: 2,
                  }}>
                  <Typography
                    variant='h6'
                    sx={{
                      fontSize: {
                        xs: '1rem', // text-base (16px)
                        sm: '1.125rem', // text-lg (18px)
                        md: '1.25rem', // text-xl (20px)
                      },
                    }}
                    align='center'>
                    {cat.nombre}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ListadoCategorias;
