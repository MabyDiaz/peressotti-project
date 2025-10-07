import { useState, useEffect } from 'react';
import Filtros from '../components/Filtros';
import ListaProductos from '../components/ListaProductos';
import Pagination from '../admin/components/Pagination.jsx';
import api from '../api/axios';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const obtenerProductos = async (nuevosFiltros = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({ ...nuevosFiltros, page }).toString();
      const res = await api.get(`/productos?${params}`);

      if (res.data?.data) {
        setProductos(res.data.data);
        setPagination(res.data.pagination);
        setFiltros(nuevosFiltros); // guardamos los filtros actuales
      } else {
        setProductos([]);
        setPagination({ currentPage: 1, totalPages: 1 });
      }
    } catch (err) {
      console.error(err);
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerProductos(); // carga inicial
  }, []);

  const handlePageChange = (page) => {
    obtenerProductos(filtros, page);
  };

  return (
    <div className='bg-[#1F2937] container mx-auto px-2 py-6'>
      <h1 className='text-2xl text-white font-bold mb-6 text-center'>
        Nuestros Productos
      </h1>

      <Filtros
        onFiltrar={(nuevosFiltros) => obtenerProductos(nuevosFiltros, 1)}
      />

      {loading ? (
        <p className='text-center mt-6'>Cargando productos...</p>
      ) : error ? (
        <p className='text-center text-red-600 mt-6'>{error}</p>
      ) : (
        <ListaProductos productos={productos} />
      )}
      <Pagination
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Productos;
