import { useState, useEffect } from 'react';
import Banner from '../components/Banner.jsx';
import BloqueHero from '../components/BloqueHero.jsx';
import ProductosDestacados from '../components/ProductosDestacados.jsx';
import ListadoCategorias from '../components/ListadoCategorias.jsx';
import ListaProductos from '../components/ListaProductos.jsx';
import Filtros from '../components/Filtros';
import Pagination from '../admin/components/Pagination.jsx';
import api from '../api/axios';
import { Typography } from '@mui/material';
import { Box } from '@mui/material';

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  // Función para obtener productos, opcionalmente con filtros
  const obtenerProductos = async (filtros = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({ ...filtros, page }).toString();
      const res = await api.get(`/productos?${params}`);

      if (res.data?.data) {
        setProductos(res.data.data);
        setPagination(res.data.pagination);
      } else {
        setProductos([]);
        setPagination({ currentPage: 1, totalPages: 1 });
      }
    } catch (err) {
      console.error('Error al obtener productos:', err);
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial de productos
  useEffect(() => {
    obtenerProductos();
  }, []);

  const handlePageChange = (page) => {
    obtenerProductos(filtros, page);
  };

  return (
    <div>
      <Banner />
      <ListadoCategorias />

      {/* Barra de filtros */}
      <Filtros
        onFiltrar={(nuevosFiltros) => {
          setFiltros(nuevosFiltros); // guardar los filtros
          obtenerProductos(nuevosFiltros, 1);
        }}
      />

      <Box sx={{ bgcolor: '#1F2937' }}>
        <Typography
          component='h2'
          align='center'
          sx={{
            color: '#ffffff',
            fontWeight: 'bold',
            pt: 4,
            pb: 4,
            textTransform: 'uppercase',
            fontSize: { xs: '1.4rem', sm: '1.7rem', md: '1.8rem' },
          }}>
          Nuestros Productos
        </Typography>

        {/* Lista de productos */}
        {loading ? (
          <Typography
            align='center'
            mt={4}>
            Cargando productos...
          </Typography>
        ) : error ? (
          <Typography
            align='center'
            mt={4}
            color='error'>
            {error}
          </Typography>
        ) : (
          <ListaProductos
            productos={productos}
            sx={{ pb: 0 }}
          />
        )}

        <Box sx={{ textAlign: 'center', pb: 4 }}>
          {!loading && !error && pagination.totalPages >= 1 && (
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              sx={{
                button: {
                  minWidth: 36,
                  margin: '0 4px',
                  color: '#1F2937',
                  backgroundColor: '#fff',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                },
              }}
            />
          )}
        </Box>
      </Box>

      <Box>
        <Typography
          component='h2'
          align='center'
          sx={{
            color: '#1F2937',
            fontWeight: 'bold',
            pt: 4,
            textTransform: 'uppercase',
            fontSize: { xs: '1.4rem', sm: '1.7rem', md: '1.8rem' },
          }}>
          Productos Destacados
        </Typography>
        <ProductosDestacados />
      </Box>
      <BloqueHero />
    </div>
  );
};

export default Home;
