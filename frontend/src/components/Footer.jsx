// import {
//   Box,
//   Container,
//   Grid,
//   Typography,
//   Link,
//   IconButton,
//   TextField,
//   Button,
// } from '@mui/material';
// import FacebookIcon from '@mui/icons-material/Facebook';
// import InstagramIcon from '@mui/icons-material/Instagram';
// import EmailIcon from '@mui/icons-material/Email';

// function Footer() {
//   return (
//     <Box
//       component='footer'
//       className='bg-gray-100'>
//       <Container maxWidth='lg'>
//         <Grid
//           container
//           spacing={6}
//           justifyContent='center'
//           className='py-6 '>
//           <Grid
//             xs={12}
//             sm={6}
//             md={4}>
//             <Typography
//               variant='h6'
//               gutterBottom
//               sx={{
//                 fontSize: '0.9rem',
//                 fontWeight: 500,
//                 textTransform: 'uppercase',
//               }}>
//               Contacto
//             </Typography>
//             <Typography variant='body2'>Córdoba, Argentina</Typography>
//             <Typography variant='body2'>(351) 5574206</Typography>
//             <Typography variant='body2'>
//               imprentaperessotti@gmail.com
//             </Typography>
//           </Grid>

//           <Grid
//             xs={12}
//             sm={6}
//             md={3}>
//             <Typography
//               variant='h6'
//               gutterBottom
//               sx={{
//                 fontSize: '0.9rem',
//                 fontWeight: 500,
//                 textTransform: 'uppercase',
//                 textAlign: 'center',
//               }}>
//               Seguinos
//             </Typography>
//             <IconButton
//               color='primary'
//               href='https://facebook.com/imprenta.peressotti'>
//               <FacebookIcon />
//             </IconButton>
//             <IconButton
//               color='secondary'
//               href='https://instagram.com/imprenta.peressotti'>
//               <InstagramIcon />
//             </IconButton>
//             <IconButton color='default'>
//               <EmailIcon />
//             </IconButton>
//           </Grid>

//           {/* <Grid
//             xs={12}
//             sm={6}
//             md={3}>
//             <Typography
//               variant='h6'
//               gutterBottom
//               sx={{
//                 fontSize: '0.9rem',
//                 fontWeight: 500,
//                 textTransform: 'uppercase',
//               }}>
//               Suscribite al newsletter
//             </Typography>
//             <Box className='flex gap-2'>
//               <TextField
//                 size='small'
//                 placeholder='Tu email'
//                 fullWidth
//               />
//               <Button
//                 variant='contained'
//                 size='small'
//                 sx={{
//                   backgroundColor: '#2b7fff',
//                   color: 'white',
//                   '&:hover': {
//                     backgroundColor: '#ffffff',
//                     border: '1px solid #2b7fff',
//                     color: '#2b7fff',
//                   },
//                 }}>
//                 Enviar
//               </Button>
//             </Box>
//           </Grid> */}
//         </Grid>

//         <Typography
//           variant='body2'
//           align='center'
//           color='text.secondary'
//           className='pb-6'>
//           © {new Date().getFullYear()} Imprenta Peressotti. Todos los derechos
//           reservados.
//         </Typography>
//       </Container>
//     </Box>
//   );
// }

// export default Footer;

// // Ejemplo de Footer mejorado (colores y enlaces funcionales)
// // import {
// //   Box,
// //   Container,
// //   Grid,
// //   Typography,
// //   Link,
// //   IconButton,
// // } from '@mui/material';
// // import FacebookIcon from '@mui/icons-material/Facebook';
// // import InstagramIcon from '@mui/icons-material/Instagram';
// // import EmailIcon from '@mui/icons-material/Email';
// // import { Link as RouterLink } from 'react-router-dom';

// // function Footer() {
// //   return (
// //     <Box
// //       component='footer'
// //       sx={{
// //         backgroundColor: '#F9FAFB',
// //         color: '#1F2937',
// //         py: 4,
// //         mt: 'auto',
// //       }}>
// //       <Container maxWidth='lg'>
// //         <Grid
// //           container
// //           spacing={4}>
// //           {/* Columna: Información */}
// //           <Grid
// //             item
// //             xs={12}
// //             sm={4}>
// //             <Typography
// //               variant='h6'
// //               fontWeight='bold'
// //               color='#DC2626'
// //               gutterBottom>
// //               Imprenta Peressotti
// //             </Typography>
// //             <Typography
// //               variant='body2'
// //               color='text.secondary'>
// //               Calidad y compromiso en cada impresión.
// //             </Typography>
// //           </Grid>

// //           {/* Columna: Enlaces */}
// //           <Grid
// //             item
// //             xs={12}
// //             sm={4}>
// //             <Typography
// //               variant='subtitle1'
// //               fontWeight='bold'
// //               gutterBottom>
// //               Enlaces
// //             </Typography>
// //             <Box
// //               display='flex'
// //               flexDirection='column'
// //               gap={0.5}>
// //               <Link
// //                 component={RouterLink}
// //                 to='/'
// //                 color='text.secondary'
// //                 underline='hover'>
// //                 Inicio
// //               </Link>
// //               <Link
// //                 component={RouterLink}
// //                 to='/productos'
// //                 color='text.secondary'
// //                 underline='hover'>
// //                 Productos
// //               </Link>
// //               <Link
// //                 component={RouterLink}
// //                 to='/nosotros'
// //                 color='text.secondary'
// //                 underline='hover'>
// //                 Nosotros
// //               </Link>
// //               <Link
// //                 component={RouterLink}
// //                 to='/contacto'
// //                 color='text.secondary'
// //                 underline='hover'>
// //                 Contacto
// //               </Link>
// //             </Box>
// //           </Grid>

// //           {/* Columna: Contacto / Redes */}
// //           <Grid
// //             item
// //             xs={12}
// //             sm={4}>
// //             <Typography
// //               variant='subtitle1'
// //               fontWeight='bold'
// //               gutterBottom>
// //               Contacto
// //             </Typography>
// //             <Box
// //               display='flex'
// //               alignItems='center'
// //               gap={1}
// //               mb={1}>
// //               <EmailIcon fontSize='small' />
// //               <Typography variant='body2'>contacto@peressotti.com</Typography>
// //             </Box>
// //             <Box
// //               display='flex'
// //               gap={2}
// //               mt={2}>
// //               <IconButton
// //                 href='https://facebook.com/tuempresa'
// //                 target='_blank'
// //                 sx={{ color: '#1F2937', '&:hover': { color: '#DC2626' } }}
// //                 aria-label='Facebook'>
// //                 <FacebookIcon />
// //               </IconButton>
// //               <IconButton
// //                 href='https://instagram.com/tuempresa'
// //                 target='_blank'
// //                 sx={{ color: '#1F2937', '&:hover': { color: '#DC2626' } }}
// //                 aria-label='Instagram'>
// //                 <InstagramIcon />
// //               </IconButton>
// //             </Box>
// //           </Grid>
// //         </Grid>

// //         <Box
// //           textAlign='center'
// //           mt={4}
// //           pt={2}
// //           borderTop='1px solid #e5e7eb'>
// //           <Typography
// //             variant='body2'
// //             color='text.secondary'>
// //             © {new Date().getFullYear()} Imprenta Peressotti. Todos los derechos
// //             reservados.
// //           </Typography>
// //         </Box>
// //       </Container>
// //     </Box>
// //   );
// // }

// // export default Footer;

// import { Box, Container, Grid, Typography, IconButton } from '@mui/material';
// import FacebookIcon from '@mui/icons-material/Facebook';
// import InstagramIcon from '@mui/icons-material/Instagram';
// import EmailIcon from '@mui/icons-material/Email';
// import { Link as RouterLink } from 'react-router-dom';

// function Footer() {
//   return (
//     <Box
//       component='footer'
//       sx={{
//         backgroundColor: '#F9FAFB',
//         color: '#1F2937',
//         py: { xs: 3, md: 4 },
//         mt: 'auto',
//       }}>
//       <Container maxWidth='lg'>

//         <Grid
//           container
//           spacing={{ xs: 3, md: 4 }}
//           justifyContent='center'
//           textAlign={{ xs: 'center', md: 'left' }}>
//           {/* Columna: Información */}
//           <Grid
//             item
//             xs={12}
//             sm={6}
//             md={4}>
//             <Typography
//               variant='h6'
//               fontWeight='bold'
//               color='#DC2626'
//               gutterBottom
//               sx={{ textAlign: { xs: 'center', md: 'left' } }}>
//               Imprenta Peressotti
//             </Typography>
//             <Typography
//               variant='body2'
//               color='text.secondary'
//               sx={{ textAlign: { xs: 'center', md: 'left' } }}>
//               Calidad y compromiso en cada impresión.
//             </Typography>
//           </Grid>

//           {/* Columna: Contacto / Redes */}
//           <Grid
//             item
//             xs={12}
//             md={4}>
//             <Typography
//               variant='subtitle1'
//               fontWeight='bold'
//               gutterBottom
//               sx={{ textAlign: { xs: 'center', md: 'left' } }}>
//               Contacto
//             </Typography>
//             <Box
//               sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: { xs: 'center', md: 'flex-start' },
//                 gap: 0.5,
//               }}>
//               <Typography variant='body2'>Córdoba, Argentina</Typography>
//               <Typography variant='body2'>(351) 5574206</Typography>
//               <Typography variant='body2'>
//                 imprentaperessotti@gmail.com
//               </Typography>
//             </Box>

//             <Typography
//               variant='subtitle1'
//               fontWeight='bold'
//               gutterBottom
//               sx={{ mt: 3, textAlign: { xs: 'center', md: 'left' } }}>
//               Seguinos
//             </Typography>
//             <Box
//               display='flex'
//               justifyContent={{ xs: 'center', md: 'flex-start' }}
//               gap={2}
//               mt={1}>
//               <IconButton
//                 href='https://facebook.com/imprenta.peressotti'
//                 target='_blank'
//                 rel='noopener noreferrer'
//                 sx={{ color: '#1F2937', '&:hover': { color: '#DC2626' } }}
//                 aria-label='Facebook'>
//                 <FacebookIcon />
//               </IconButton>
//               <IconButton
//                 href='https://instagram.com/imprenta.peressotti'
//                 target='_blank'
//                 rel='noopener noreferrer'
//                 sx={{ color: '#1F2937', '&:hover': { color: '#DC2626' } }}
//                 aria-label='Instagram'>
//                 <InstagramIcon />
//               </IconButton>
//               <IconButton
//                 href='mailto:imprentaperessotti@gmail.com'
//                 sx={{ color: '#1F2937', '&:hover': { color: '#DC2626' } }}
//                 aria-label='Email'>
//                 <EmailIcon />
//               </IconButton>
//             </Box>
//           </Grid>
//         </Grid>

//         {/* Separador y copyright */}
//         <Box
//           textAlign='center'
//           mt={4}
//           pt={2}
//           borderTop='1px solid #e5e7eb'>
//           <Typography
//             variant='body2'
//             color='text.secondary'>
//             © {new Date().getFullYear()} Imprenta Peressotti. Todos los derechos
//             reservados.
//           </Typography>
//         </Box>
//       </Container>
//     </Box>
//   );
// }

// export default Footer;

import { Box, Container, Grid, Typography, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';

function Footer() {
  return (
    <Box
      component='footer'
      sx={{
        backgroundColor: '#F9FAFB',
        color: '#1F2937',
        py: { xs: 3, md: 4 },
        mt: 'auto',
      }}>
      <Container maxWidth='lg'>
        <Grid
          container
          spacing={{ xs: 3, md: 8 }}
          justifyContent='center'
          textAlign={{ xs: 'center', md: 'left' }}>
          {/* Columna 1: Información */}
          <Grid
            item
            xs={12}
            md={4}>
            <Typography
              variant='h6'
              fontWeight='bold'
              color='#e7000b'
              gutterBottom
              sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              Imprenta Peressotti
            </Typography>
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              Calidad y compromiso en cada impresión.
            </Typography>
          </Grid>

          {/* Columna 2: Contacto */}
          <Grid
            item
            xs={12}
            md={4}>
            <Typography
              variant='subtitle1'
              fontWeight='bold'
              gutterBottom
              sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              Contacto
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'flex-start' },
                gap: 0.5,
              }}>
              <Typography variant='body2'>Córdoba, Argentina</Typography>
              <Typography variant='body2'>(351) 5574206</Typography>
              <Typography variant='body2'>
                imprentaperessotti@gmail.com
              </Typography>
            </Box>
          </Grid>

          {/* Columna 3: Seguinos (solo íconos) */}
          <Grid
            item
            xs={12}
            md={4}>
            <Typography
              variant='subtitle1'
              fontWeight='bold'
              gutterBottom
              sx={{ textAlign: { xs: 'center', md: 'center' } }}>
              Seguinos
            </Typography>
            <Box
              display='flex'
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              gap={1}
              mt={1}>
              <IconButton
                href='https://facebook.com/imprenta.peressotti'
                target='_blank'
                rel='noopener noreferrer'
                sx={{
                  color: '#e7000b',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    color: '#e7000b',
                  },
                }}
                aria-label='Facebook'>
                <FacebookIcon />
              </IconButton>
              <IconButton
                href='https://www.instagram.com/imprenta.peressotti'
                target='_blank'
                rel='noopener noreferrer'
                sx={{
                  color: '#e7000b',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    color: '#e7000b',
                  },
                }}
                aria-label='Instagram'>
                <InstagramIcon />
              </IconButton>
              <IconButton
                href='mailto:imprentaperessotti@gmail.com'
                sx={{
                  color: '#e7000b',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    color: '#e7000b',
                  },
                }}
                aria-label='Email'>
                <EmailIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Separador y copyright */}
        <Box
          textAlign='center'
          mt={4}
          pt={2}
          borderTop='1px solid #e5e7eb'>
          <Typography
            variant='body2'
            color='text.secondary'>
            © {new Date().getFullYear()} Imprenta Peressotti. Todos los derechos
            reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
