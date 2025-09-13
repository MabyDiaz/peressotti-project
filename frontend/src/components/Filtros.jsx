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

const Filtros = () => {
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');

  return (
    <Paper
      elevation={1}
      className='p-6 '
      sx={{ bgcolor: 'grey.50' }}>
      <Box className='flex flex-wrap items-center gap-4 justify-center'>
        {/* Chips */}
        <Box className='hidden md:flex'>
          {['Más vendidos', 'Promociones', 'Novedades'].map((label) => (
            <Chip
              key={label}
              label={label}
              variant='outlined'
              color='primary'
              sx={{ mr: 1.5 }}
            />
          ))}
        </Box>

        <Box className='hidden md:flex'>
          {/* Categoría */}
          <FormControl
            size='small'
            sx={{ width: 200, mr: 2 }}>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label='Categoría'>
              <MenuItem value=''>Todas</MenuItem>
              <MenuItem value='comercial'>Comercial</MenuItem>
              <MenuItem value='escolar'>Escolar</MenuItem>
              <MenuItem value='Fiestas-y-eventos'>Fiestas y Eventos</MenuItem>
              <MenuItem value='Regalos'>Regalos</MenuItem>
            </Select>
          </FormControl>

          {/* Ordenar */}
          <FormControl
            size='small'
            sx={{ width: 200 }}>
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              label='Ordenar por'>
              <MenuItem value='popular'>Popularidad</MenuItem>
              <MenuItem value='name-asc'>Nombre (A-Z)</MenuItem>
              <MenuItem value='name-desc'>Nombre (Z-A)</MenuItem>
              <MenuItem value='nuevo'>Más nuevos</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Buscador */}
        <TextField
          size='small'
          placeholder='Buscar producto...'
          className='w-[300px] md:w-[400px]'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton size='small'>
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
