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
    if (sort === 'nombre-asc') {
      filtros.sort = 'nombre';
      filtros.direction = 'ASC';
    } else if (sort === 'nombre-desc') {
      filtros.sort = 'nombre';
      filtros.direction = 'DESC';
    } else if (sort === 'precio-asc') {
      filtros.sort = 'precio';
      filtros.direction = 'ASC';
    } else if (sort === 'precio-desc') {
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
              sx={{
                mr: 1.5,
                borderColor: '#E7000B',
                color: tipo === chip.value ? '#fff' : '#E7000B',
                bgcolor: tipo === chip.value ? '#E7000B' : 'transparent',
                '&:hover': {
                  bgcolor: tipo === chip.value ? '#E7000B' : '#ffe5e5',
                },
                fontWeight: 'bold',
              }}
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
          sx={{
            width: 200,
            mr: 2,
            '& .MuiInputLabel-root': {
              fontFamily: 'inherit',
              fontWeight: 'bold',
            }, // etiqueta
            '& .MuiSelect-select': {
              fontFamily: 'inherit',
              fontWeight: 'bold',
            }, // texto seleccionado
          }}>
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
          sx={{
            width: 200,
            mr: 2,
            '& .MuiInputLabel-root': {
              fontFamily: 'inherit',
              fontWeight: 'bold',
            }, // etiqueta
            '& .MuiSelect-select': {
              fontFamily: 'inherit',
              fontWeight: 'bold',
            }, // texto seleccionado
          }}>
          <InputLabel>Ordenar por</InputLabel>
          <Select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              aplicarFiltros({ sort: e.target.value });
            }}
            label='Ordenar por'>
            <MenuItem value=''>Ninguno</MenuItem>
            <MenuItem value='nombre-asc'>Nombre (A-Z)</MenuItem>
            <MenuItem value='nombre-desc'>Nombre (Z-A)</MenuItem>
            <MenuItem value='precio-asc'>Precio (menor a mayor)</MenuItem>
            <MenuItem value='precio-desc'>Precio (mayor a menor)</MenuItem>
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
            sx: { fontFamily: 'inherit', fontWeight: 'bold' }, // letra igual a los chips
          }}
        />
      </Box>
    </Paper>
  );
};

export default Filtros;
