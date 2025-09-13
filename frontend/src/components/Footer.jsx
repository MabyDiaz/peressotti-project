import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  TextField,
  Button,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';

function Footer() {
  return (
    <Box
      component='footer'
      className='bg-gray-100'>
      <Container maxWidth='lg'>
        <Grid
          container
          spacing={6}
          justifyContent='center'
          className='py-6 '>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}>
            <Typography
              variant='h6'
              gutterBottom
              sx={{
                fontSize: '0.9rem',
                fontWeight: 500,
                textTransform: 'uppercase',
              }}>
              Contacto
            </Typography>
            <Typography variant='body2'>Barrio 4 de Febrero</Typography>
            <Typography variant='body2'>Córdoba, Argentina</Typography>
            <Typography variant='body2'>(351) 574206</Typography>
            <Typography variant='body2'>
              imprentaperessotti@gmail.com
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            md={3}>
            <Typography
              variant='h6'
              gutterBottom
              sx={{
                fontSize: '0.9rem',
                fontWeight: 500,
                textTransform: 'uppercase',
              }}>
              Seguinos
            </Typography>
            <IconButton
              color='primary'
              href='https://facebook.com'>
              <FacebookIcon />
            </IconButton>
            <IconButton
              color='secondary'
              href='https://instagram.com'>
              <InstagramIcon />
            </IconButton>
            <IconButton color='default'>
              <EmailIcon />
            </IconButton>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            md={3}>
            <Typography
              variant='h6'
              gutterBottom
              sx={{
                fontSize: '0.9rem',
                fontWeight: 500,
                textTransform: 'uppercase',
              }}>
              Suscribite al newsletter
            </Typography>
            <Box className='flex gap-2'>
              <TextField
                size='small'
                placeholder='Tu email'
                fullWidth
              />
              <Button
                variant='contained'
                size='small'
                sx={{
                  backgroundColor: '#2b7fff',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#ffffff',
                    border: '1px solid #2b7fff',
                    color: '#2b7fff',
                  },
                }}>
                Enviar
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Typography
          variant='body2'
          align='center'
          color='text.secondary'
          className='pb-6'>
          © {new Date().getFullYear()} Imprenta Peressotti. Todos los derechos
          reservados.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
