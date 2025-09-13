import Banner from '../components/Banner.jsx';
import BloqueHero from '../components/BloqueHero.jsx';
import Filtros from '../components/Filtros.jsx';
import ProductosDestacados from '../components/ProductosDestacados.jsx';
import ListadoCategorias from '../components/ListadoCategorias.jsx';
import EntradaCupon from '../components/EntradaCupon.jsx';
import { Typography } from '@mui/material';

const Home = () => {
  return (
    <div>
      <Banner />
      <Filtros />
      <ListadoCategorias />
      <EntradaCupon />
      <Typography
        component='h2'
        align='center'
        sx={{
          fontWeight: 'bold',
          // pt: 6,
          mb: 1,
          textTransform: 'uppercase',
          fontSize: {
            xs: '1.4rem',
            sm: '1.7rem',
            md: '2rem',
          },
        }}>
        Productos Destacados
      </Typography>

      <ProductosDestacados />
      <BloqueHero />
    </div>
  );
};

export default Home;
