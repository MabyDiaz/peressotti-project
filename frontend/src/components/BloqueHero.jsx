// import { Box, Container, Grid, Typography, Button } from '@mui/material';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import img from '../assets/img/imanesalfabeto.jpg';

// const BloqueHero = () => {
//   return (
//     <Box className='bg-[#1F2937] text-white py-12 mt-10'>
//       <Container maxWidth='lg'>
//         <Grid
//           container
//           spacing={2}
//           direction={{ xs: 'column-reverse', sm: 'row' }}
//           alignItems='center'
//           justifyContent='center'>
//           <Grid size={{ xs: 12, md: 4, sx: { mr: { md: 4 } } }}>
//             <Box className='flex flex-col justify-center items-start h-full'>
//               <Typography
//                 variant='h4'
//                 gutterBottom
//                 textTransform='uppercase'
//                 sx={{
//                   fontSize: {
//                     xs: '1.5rem',
//                     sm: '1.8rem',
//                     md: '2rem',
//                   },
//                   fontWeight: 'bold',
//                 }}>
//                 Abecedario Imantado
//               </Typography>

//               <Typography
//                 variant='body1'
//                 gutterBottom
//                 sx={{
//                   maxWidth: '300px',
//                   mb: 2,
//                   fontSize: {
//                     xs: '0.85rem',
//                     sm: '0.95rem',
//                     md: '1rem',
//                   },
//                 }}>
//                 Tarjetas imantadas tamaño 4cm x 6cm, impresión fullcolor, con
//                 abecedario e imágenes de animales.
//               </Typography>

//               <Box className='flex gap-4'>
//                 <Button
//                   variant='contained'
//                   size='small'
//                   startIcon={<ShoppingCartIcon />}
//                   color='secondary'
//                   sx={{
//                     backgroundColor: '#ffffff',
//                     color: 'black',
//                     border: '1px solid #2b7fff',
//                     transition: 'all 0.2s ease',
//                     '&:hover': {
//                       backgroundColor: '#ffffff',
//                       color: '#2b7fff',
//                       transform: 'scale(1.05)',
//                     },
//                   }}>
//                   Agregar al carrito
//                 </Button>

//                 <Button
//                   variant='contained'
//                   size='small'
//                   color='secondary'
//                   sx={{
//                     backgroundColor: '#ffffff',
//                     border: '1px solid #2b7fff',
//                     color: 'black',
//                     transition: 'all 0.2s ease',
//                     '&:hover': {
//                       color: '#2b7fff',
//                       transform: 'scale(1.05)',
//                     },
//                   }}>
//                   Ver productos
//                 </Button>
//               </Box>
//             </Box>
//           </Grid>

//           <Grid size={{ xs: 1, sm: 1, md: 3 }} />

//           <Grid
//             item
//             xs={12}
//             md={5}>
//             <Box className='flex justify-center'>
//               <img
//                 src={img}
//                 alt='Productos de imprenta'
//                 className='w-[100%] max-w-[400px] h-[300px] object-cover rounded-lg shadow-lg'
//               />
//             </Box>
//           </Grid>
//         </Grid>
//       </Container>
//     </Box>
//   );
// };

// export default BloqueHero;

// frontend/src/components/BloqueHero.jsx
// import { Box, Container, Grid, Typography, Button } from '@mui/material';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCarrito } from '../hooks/useCarrito';
// import { getImageUrl } from '../utils/getImageUrl';
// import api from '../api/axios';
// import { toast } from 'react-toastify';

// const BloqueHero = () => {
//   const [producto, setProducto] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const { agregarAlCarrito } = useCarrito();

//   useEffect(() => {
//     const fetchProductoHero = async () => {
//       try {
//         // Obtener específicamente el producto con ID 5 (Abecedario Imantado)
//         const response = await api.get('/productos/5');
//         if (response.data.success) {
//           setProducto(response.data.data);
//         }
//       } catch (error) {
//         console.error('Error cargando producto hero:', error);
//         // Si hay error, usar datos por defecto para el producto 5
//         setProducto({
//           id: 5,
//           nombre: 'Abecedario Imantado',
//           descripcion:
//             'Tarjetas imantadas tamaño 4cm x 6cm, impresión fullcolor, con abecedario e imágenes de animales.',
//           precio: 0, // Puedes ajustar el precio
//           imagenPrincipal: '/uploads/imanimantado.jpg',
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProductoHero();
//   }, []);

//   const handleAgregarCarrito = async () => {
//     if (producto) {
//       try {
//         await agregarAlCarrito(producto.id, 1);
//         toast.success('Producto agregado al carrito');
//       } catch (error) {
//         console.log(error);

//         toast.error('Error al agregar al carrito');
//       }
//     }
//   };

//   const handleVerDetalle = () => {
//     if (producto) {
//       navigate(`/producto/${producto.id}`);
//     }
//   };

//   if (loading) {
//     return (
//       <Box className='bg-[#1F2937] text-white py-12 mt-10'>
//         <Container maxWidth='lg'>
//           <Grid
//             container
//             spacing={2}
//             alignItems='center'
//             justifyContent='center'>
//             <Grid
//               item
//               xs={12}
//               md={6}>
//               <Box className='flex flex-col justify-center items-start h-full'>
//                 <Typography
//                   variant='h4'
//                   gutterBottom>
//                   Cargando...
//                 </Typography>
//               </Box>
//             </Grid>
//             <Grid
//               item
//               xs={12}
//               md={6}>
//               <Box className='flex justify-center'>
//                 <div className='w-full max-w-[400px] h-[300px] bg-gray-300 animate-pulse rounded-lg'></div>
//               </Box>
//             </Grid>
//           </Grid>
//         </Container>
//       </Box>
//     );
//   }

//   return (
//     <Box className='bg-[#1F2937] text-white py-12 mt-10'>
//       <Container maxWidth='lg'>
//         <Grid
//           container
//           spacing={2}
//           direction={{ xs: 'column-reverse', sm: 'row' }}
//           alignItems='center'
//           justifyContent='center'>
//           <Grid
//             item
//             xs={12}
//             md={6}>
//             <Box className='flex flex-col justify-center items-start h-full'>
//               <Typography
//                 variant='h4'
//                 gutterBottom
//                 textTransform='uppercase'
//                 sx={{
//                   fontSize: {
//                     xs: '1.5rem',
//                     sm: '1.8rem',
//                     md: '2rem',
//                   },
//                   fontWeight: 'bold',
//                 }}>
//                 {producto.nombre}
//               </Typography>

//               <Typography
//                 variant='body1'
//                 gutterBottom
//                 sx={{
//                   maxWidth: '300px',
//                   mb: 2,
//                   fontSize: {
//                     xs: '0.85rem',
//                     sm: '0.95rem',
//                     md: '1rem',
//                   },
//                 }}>
//                 {producto.descripcion}
//               </Typography>

//               {producto.precio > 0 && (
//                 <Typography
//                   variant='h6'
//                   sx={{
//                     color: '#EF4444',
//                     fontWeight: 'bold',
//                     mb: 2,
//                   }}>
//                   ${producto.precio}
//                 </Typography>
//               )}

//               <Box className='flex gap-4'>
//                 <Button
//                   variant='contained'
//                   size='small'
//                   startIcon={<ShoppingCartIcon />}
//                   onClick={handleAgregarCarrito}
//                   sx={{
//                     backgroundColor: '#EF4444',
//                     color: 'white',
//                     border: '1px solid #EF4444',
//                     transition: 'all 0.2s ease',
//                     '&:hover': {
//                       backgroundColor: '#DC2626',
//                       transform: 'scale(1.05)',
//                     },
//                   }}>
//                   Agregar al carrito
//                 </Button>

//                 <Button
//                   variant='outlined'
//                   size='small'
//                   onClick={handleVerDetalle}
//                   sx={{
//                     backgroundColor: 'transparent',
//                     border: '1px solid #EF4444',
//                     color: '#EF4444',
//                     transition: 'all 0.2s ease',
//                     '&:hover': {
//                       backgroundColor: '#EF4444',
//                       color: 'white',
//                       transform: 'scale(1.05)',
//                     },
//                   }}>
//                   Ver detalle
//                 </Button>
//               </Box>
//             </Box>
//           </Grid>

//           <Grid
//             item
//             xs={12}
//             md={6}>
//             <Box className='flex justify-center'>
//               <img
//                 src={getImageUrl(producto.imagenPrincipal || producto.imagen)}
//                 alt={producto.nombre}
//                 className='w-[100%] max-w-[400px] h-[300px] object-cover rounded-lg shadow-lg'
//                 onError={(e) => {
//                   // Fallback si la imagen no carga
//                   e.target.src = '/placeholder-hero.jpg';
//                 }}
//               />
//             </Box>
//           </Grid>
//         </Grid>
//       </Container>
//     </Box>
//   );
// };

// export default BloqueHero;

import { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useCarrito } from '../hooks/useCarrito';
import { getImageUrl } from '../utils/getImageUrl';
import api from '../api/axios';
import { FaEye, FaShoppingCart } from 'react-icons/fa';

const BloqueHero = () => {
  const { agregarProducto } = useCarrito();
  const [productoHero, setProductoHero] = useState(null);

  useEffect(() => {
    const fetchProductoHero = async () => {
      try {
        const { data } = await api.get('/productos/5');
        if (data?.success) {
          setProductoHero(data.data);
        }
      } catch (error) {
        console.error('Error al cargar el producto destacado:', error);
      }
    };

    fetchProductoHero();
  }, []);

  if (!productoHero) return null;

  return (
    <Box className='bg-[#1F2937] text-white py-12 mt-10'>
      <Container maxWidth='lg'>
        <Grid
          container
          spacing={2}
          direction={{ xs: 'column-reverse', sm: 'row' }}
          alignItems='center'
          justifyContent='center'
          gap={5}>
          {/* Texto */}
          <Grid
            item
            xs={12}
            md={5}>
            <Box className='flex flex-col justify-center items-start h-full'>
              <Typography
                variant='h4'
                gutterBottom
                textTransform='uppercase'
                sx={{
                  fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                  fontWeight: 'bold',
                }}>
                {productoHero.nombre}
              </Typography>

              <Typography
                variant='body1'
                gutterBottom
                sx={{
                  maxWidth: '300px',
                  mb: 2,
                  fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
                }}>
                {productoHero.descripcion}
              </Typography>

              <Box className='flex gap-4'>
                {/* Botón ver detalle con Link */}
                <Link
                  to={`/producto/${productoHero.id}`}
                  className='mt-3 bg-[#e7000b] border-2 border-transparent hover:bg-transparent hover:border-2 hover:border-white text-white text-xs font-bold py-2 px-3 rounded flex items-center justify-center transition-colors duration-200'>
                  <FaEye
                    size={14}
                    className='mr-1'
                  />
                  Ver Detalle
                </Link>

                {/* Botón agregar al carrito */}
                <button
                  onClick={() => agregarProducto(productoHero, 1)}
                  className='mt-3 transparent border-2 border-white hover:bg-[#e7000b] hover:border-transparent text-white text-xs font-bold py-2 px-3 rounded flex items-center justify-center transition-colors duration-200'>
                  <FaShoppingCart
                    size={14}
                    className='mr-1'
                  />
                  Agregar al carrito
                </button>
              </Box>
            </Box>
          </Grid>

          {/* Imagen */}
          <Grid
            item
            xs={12}
            md={5}>
            <Box className='flex justify-center'>
              <img
                src={getImageUrl(productoHero.imagenPrincipal)}
                alt={productoHero.nombre}
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
