import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import banner1 from '../assets/img/banner1.jpg';
import banner2 from '../assets/img/banner2.jpg';
import banner3 from '../assets/img/banner3.jpg';
import ProcesoCompra from './ProcesoCompra';

const banners = [
  {
    img: banner1,
    titulo: '¡Impulsá tu marca!',
    descripcion:
      'Impresiones de alta calidad y diseños únicos para tu negocio.',
    boton: 'Ver productos',
    alineacion: 'start',
  },
  {
    img: banner2,
    titulo: '¡Personalizá sin límites!',
    descripcion:
      'Diseños únicos que se adaptan a tus ideas. Calidad garantizada.',
    boton: 'Ver productos',
    alineacion: 'center',
  },
  {
    img: banner3,
    titulo: 'Soluciones para tu emprendimiento',
    descripcion: 'Material gráfico y promocional que destaca tu marca.',
    boton: 'Ver productos',
    alineacion: 'start',
  },
];

const Banner = () => {
  const navigate = useNavigate();

  const handleVerProductos = () => {
    navigate('/productos');
  };

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <>
      <div className='bg-[#d0d3c5] w-full max-h-[500px] overflow-hidden pb-8'>
        <Slider {...settings}>
          {banners.map((banner, index) => (
            <div
              key={index}
              className='relative'>
              <img
                src={banner.img}
                alt={`Banner ${index + 1}`}
                className='w-full h-[300px] md:h-[400px] object-cover'
              />

              <div
                className={`absolute inset-0 flex flex-col justify-center text-white px-4 
          ${
            banner.alineacion === 'start'
              ? 'items-start text-left p-30 md:pl-15'
              : banner.alineacion === 'end'
              ? 'items-end text-right p-30 md:pr-20'
              : 'items-center text-center p-30 md:ml-100'
          }`}>
                <h1 className='text-2xl md:text-4xl font-bold mb-2'>
                  {banner.titulo}
                </h1>
                <p className='text-sm md:text-lg max-w-xl mb-4'>
                  {banner.descripcion}
                </p>
                <button
                  onClick={handleVerProductos}
                  className='bg-white text-gray-700 px-5 py-2 rounded text-sm uppercase font-bold hover:text-blue-500 transition-transform duration-200 hover:scale-103'>
                  {banner.boton}
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <ProcesoCompra />
    </>
  );
};

export default Banner;
