// import {
//   Paper,
//   Box,
//   Chip,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   TextField,
//   InputAdornment,
//   IconButton,
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import { useState } from 'react';

// const Filtros = () => {
//   const [category, setCategory] = useState('');
//   const [sort, setSort] = useState('');

//   return (
//     <Paper
//       elevation={1}
//       className='p-6 '
//       sx={{ bgcolor: 'grey.50' }}>
//       <Box className='flex flex-wrap items-center gap-4 justify-center'>
//         {/* Chips */}
//         <Box className='hidden md:flex'>
//           {['Más vendidos', 'Promociones', 'Novedades'].map((label) => (
//             <Chip
//               key={label}
//               label={label}
//               variant='outlined'
//               color='primary'
//               sx={{ mr: 1.5 }}
//             />
//           ))}
//         </Box>

//         <Box className='hidden md:flex'>
//           {/* Categoría */}
//           <FormControl
//             size='small'
//             sx={{ width: 200, mr: 2 }}>
//             <InputLabel>Categoría</InputLabel>
//             <Select
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               label='Categoría'>
//               <MenuItem value=''>Todas</MenuItem>
//               <MenuItem value='comercial'>Comercial</MenuItem>
//               <MenuItem value='escolar'>Escolar</MenuItem>
//               <MenuItem value='Fiestas-y-eventos'>Fiestas y Eventos</MenuItem>
//               <MenuItem value='Regalos'>Regalos</MenuItem>
//             </Select>
//           </FormControl>

//           {/* Ordenar */}
//           <FormControl
//             size='small'
//             sx={{ width: 200 }}>
//             <InputLabel>Ordenar por</InputLabel>
//             <Select
//               value={sort}
//               onChange={(e) => setSort(e.target.value)}
//               label='Ordenar por'>
//               <MenuItem value='popular'>Popularidad</MenuItem>
//               <MenuItem value='name-asc'>Nombre (A-Z)</MenuItem>
//               <MenuItem value='name-desc'>Nombre (Z-A)</MenuItem>
//               <MenuItem value='nuevo'>Más nuevos</MenuItem>
//             </Select>
//           </FormControl>
//         </Box>

//         {/* Buscador */}
//         <TextField
//           size='small'
//           placeholder='Buscar producto...'
//           className='w-[300px] md:w-[400px]'
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position='end'>
//                 <IconButton size='small'>
//                   <SearchIcon />
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Box>
//     </Paper>
//   );
// };

// export default Filtros;

// import {
//   Paper,
//   Box,
//   Chip,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   TextField,
//   InputAdornment,
//   IconButton,
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import { useState } from 'react';

// const Filtros = ({ onFiltrar }) => {
//   const [category, setCategory] = useState('');
//   const [sort, setSort] = useState('');
//   const [search, setSearch] = useState('');
//   const [tipo, setTipo] = useState('');

//   // ✅ Función unificada para aplicar todos los filtros actuales
//   const aplicarFiltros = (extra = {}) => {
//     const filtros = {};
//     if (category) filtros.idCategoria = category;
//     if (search.trim()) filtros.search = search.trim();
//     if (tipo) filtros.tipo = tipo;

//     // Ordenar
//     if (sort === 'name-asc') {
//       filtros.sort = 'nombre';
//       filtros.direction = 'ASC';
//     } else if (sort === 'name-desc') {
//       filtros.sort = 'nombre';
//       filtros.direction = 'DESC';
//     } else if (sort === 'nuevo') {
//       filtros.sort = 'createdAt';
//       filtros.direction = 'DESC';
//     }

//     // Combina filtros adicionales (chips, etc.)
//     Object.assign(filtros, extra);

//     console.log('🧭 Filtros aplicados:', filtros);
//     onFiltrar(filtros);
//   };

//   return (
//     <Paper
//       elevation={1}
//       className='p-6'
//       sx={{ bgcolor: 'grey.50' }}>
//       <Box className='flex flex-wrap items-center gap-4 justify-center'>
//         {/* Chips (Filtros rápidos) */}
//         <Box className='hidden md:flex'>
//           {[
//             { label: 'Más vendidos', value: 'mas-vendidos' },
//             { label: 'Promociones', value: 'promociones' },
//             { label: 'Novedades', value: 'novedades' },
//           ].map((chip) => (
//             <Chip
//               key={chip.value}
//               label={chip.label}
//               variant={tipo === chip.value ? 'filled' : 'outlined'}
//               color='primary'
//               sx={{ mr: 1.5 }}
//               onClick={() => {
//                 const nuevoTipo = tipo === chip.value ? '' : chip.value;
//                 setTipo(nuevoTipo);
//                 aplicarFiltros({ tipo: nuevoTipo });
//               }}
//             />
//           ))}
//         </Box>

//         {/* Categoría */}
//         <Box className='hidden md:flex'>
//           <FormControl
//             size='small'
//             sx={{ width: 200, mr: 2 }}>
//             <InputLabel>Categoría</InputLabel>
//             <Select
//               value={category}
//               onChange={(e) => {
//                 setCategory(e.target.value);
//                 aplicarFiltros({ idCategoria: e.target.value });
//               }}
//               label='Categoría'>
//               <MenuItem value=''>Todas</MenuItem>
//               <MenuItem value='1'>Comerciales</MenuItem>
//               <MenuItem value='2'>Escolares</MenuItem>
//               <MenuItem value='3'>Fiestas y Eventos</MenuItem>
//               <MenuItem value='4'>Regalos</MenuItem>
//             </Select>
//           </FormControl>

//           {/* Ordenar */}
//           <FormControl
//             size='small'
//             sx={{ width: 200 }}>
//             <InputLabel>Ordenar por</InputLabel>
//             <Select
//               value={sort}
//               onChange={(e) => {
//                 setSort(e.target.value);
//                 aplicarFiltros({ sort: e.target.value });
//               }}
//               label='Ordenar por'>
//               <MenuItem value=''>Ninguno</MenuItem>
//               <MenuItem value='name-asc'>Nombre (A-Z)</MenuItem>
//               <MenuItem value='name-desc'>Nombre (Z-A)</MenuItem>
//               <MenuItem value='nuevo'>Más nuevos</MenuItem>
//             </Select>
//           </FormControl>
//         </Box>

//         {/* Buscador */}
//         <TextField
//           size='small'
//           placeholder='Buscar producto...'
//           className='w-[300px] md:w-[400px]'
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && aplicarFiltros()}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position='end'>
//                 <IconButton
//                   size='small'
//                   onClick={() => aplicarFiltros()}>
//                   <SearchIcon />
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Box>
//     </Paper>
//   );
// };

// export default Filtros;

import {
  Paper,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';

const Filtros = ({ onFiltrar }) => {
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState('');
  const [tipo, setTipo] = useState('');

  const aplicarFiltros = (extra = {}) => {
    const filtros = {};

    if (category) filtros.idCategoria = category;
    if (search.trim()) filtros.search = search.trim();
    if (tipo) filtros.tipo = tipo;

    // Ordenamiento
    if (sort === 'name-asc') {
      filtros.sort = 'nombre';
      filtros.direction = 'ASC';
    } else if (sort === 'name-desc') {
      filtros.sort = 'nombre';
      filtros.direction = 'DESC';
    } else if (sort === 'price-asc') {
      filtros.sort = 'precio';
      filtros.direction = 'ASC';
    } else if (sort === 'price-desc') {
      filtros.sort = 'precio';
      filtros.direction = 'DESC';
    } else if (sort === 'nuevo') {
      filtros.sort = 'createdAt';
      filtros.direction = 'DESC';
    }

    Object.assign(filtros, extra);

    console.log('🧭 Filtros aplicados:', filtros);
    onFiltrar(filtros);
  };

  return (
    <Paper
      elevation={1}
      className='p-6'
      sx={{ bgcolor: 'grey.50' }}>
      <Box className='flex flex-wrap items-center gap-4 justify-center'>
        {/* Chips (filtros rápidos) */}
        <Box className='hidden md:flex'>
          {[
            { label: 'Más vendidos', value: 'mas-vendidos' },
            { label: 'Promociones', value: 'promociones' },
            { label: 'Novedades', value: 'novedades' },
          ].map((chip) => (
            <Chip
              key={chip.value}
              label={chip.label}
              variant={tipo === chip.value ? 'filled' : 'outlined'}
              color='primary'
              sx={{ mr: 1.5 }}
              onClick={() => {
                const nuevoTipo = tipo === chip.value ? '' : chip.value;
                setTipo(nuevoTipo);
                aplicarFiltros({ tipo: nuevoTipo });
              }}
            />
          ))}
        </Box>

        {/* Categoría */}
        <FormControl
          size='small'
          sx={{ width: 200, mr: 2 }}>
          <InputLabel>Categoría</InputLabel>
          <Select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              aplicarFiltros({ idCategoria: e.target.value });
            }}
            label='Categoría'>
            <MenuItem value=''>Todas</MenuItem>
            <MenuItem value='1'>Comerciales</MenuItem>
            <MenuItem value='2'>Escolares</MenuItem>
            <MenuItem value='3'>Fiestas y Eventos</MenuItem>
            <MenuItem value='4'>Regalos</MenuItem>
          </Select>
        </FormControl>

        {/* Ordenar */}
        <FormControl
          size='small'
          sx={{ width: 200 }}>
          <InputLabel>Ordenar por</InputLabel>
          <Select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              aplicarFiltros({ sort: e.target.value });
            }}
            label='Ordenar por'>
            <MenuItem value=''>Ninguno</MenuItem>
            <MenuItem value='name-asc'>Nombre (A-Z)</MenuItem>
            <MenuItem value='name-desc'>Nombre (Z-A)</MenuItem>
            <MenuItem value='price-asc'>Precio (menor a mayor)</MenuItem>
            <MenuItem value='price-desc'>Precio (mayor a menor)</MenuItem>
            <MenuItem value='nuevo'>Más nuevos</MenuItem>
          </Select>
        </FormControl>

        {/* Buscador */}
        <TextField
          size='small'
          placeholder='Buscar producto...'
          className='w-[300px] md:w-[400px]'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && aplicarFiltros()}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  size='small'
                  onClick={() => aplicarFiltros()}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Paper>
  );
};

export default Filtros;
