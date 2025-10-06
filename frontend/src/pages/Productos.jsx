// // import ListaProductos from '../components/ListaProductos.jsx';
// // import { Typography, Box } from '@mui/material';

// // const Productos = () => {
// //   return (
// //     <Box>
// //       <Typography
// //         component='h1'
// //         align='center'
// //         sx={{
// //           fontWeight: 'bold',
// //           mt: 4,

// //           textTransform: 'uppercase',
// //           fontSize: {
// //             xs: '1.3rem',
// //             sm: '1.7rem',
// //             md: '1.8rem',
// //           },
// //         }}>
// //         Nuestros Productos
// //       </Typography>
// //       <ListaProductos />
// //     </Box>
// //   );
// // };

// // export default Productos;

// import { useState, useEffect } from 'react';
// import Filtros from '../components/Filtros';
// import ListaProductos from '../components/ListaProductos';
// import api from '../api/axios';

// const Productos = () => {
//   const [productos, setProductos] = useState([]);

//   const obtenerProductos = async (filtros = {}) => {
//     try {
//       const params = new URLSearchParams(filtros).toString();
//       console.log('🌐 Llamando al backend con:', `/api/productos?${params}`);
//       const res = await api.get(`/productos?${params}`);
//       console.log('✅ Respuesta del backend:', res.data);
//       setProductos(res.data.data);
//     } catch (error) {
//       console.error('Error al obtener productos:', error);
//     }
//   };

//   useEffect(() => {
//     obtenerProductos(); // carga inicial sin filtros
//   }, []);

//   return (
//     <div className='container mx-auto px-4 py-6'>
//       <h1 className='text-2xl font-bold mb-6 text-center'>
//         Nuestros Productos
//       </h1>
//       <Filtros onFiltrar={obtenerProductos} />
//       <ListaProductos productos={productos} />
//     </div>
//   );
// };

// export default Productos;

import { useState, useEffect } from 'react';
import Filtros from '../components/Filtros';
import ListaProductos from '../components/ListaProductos';
import api from '../api/axios';

const Productos = () => {
  const [productos, setProductos] = useState([]);

  const obtenerProductos = async (filtros = {}) => {
    try {
      const params = new URLSearchParams(filtros).toString();
      console.log('🌐 Llamando al backend con:', `/api/productos?${params}`);
      const res = await api.get(`/productos?${params}`);
      console.log('✅ Respuesta del backend:', res.data);
      setProductos(res.data.data);
    } catch (error) {
      console.error('❌ Error al obtener productos:', error);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <div className='container mx-auto px-4 py-6'>
      <h1 className='text-2xl font-bold mb-6 text-center'>
        Nuestros Productos
      </h1>
      <Filtros onFiltrar={obtenerProductos} />
      <ListaProductos productos={productos} />
    </div>
  );
};

export default Productos;
