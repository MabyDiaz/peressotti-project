import { useState, useEffect } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useCarrito } from '../hooks/useCarrito.js';
import Carrito from '../pages/Carrito';
import api from '../api/axios';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Box,
  Badge,
} from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import logo from '../assets/img/imprentaPeressotti_Logo.png';
import avatarImg from '../assets/img/avatar.jpg';
import LoginModal from './auth/LoginModal.jsx';
import RegisterClienteModal from './auth/RegisterClienteModal.jsx';

const pages = [
  { name: 'Inicio', path: '/' },
  { name: 'Productos', hasDropdown: true },
  { name: 'Nosotros', path: '/nosotros' },
  { name: 'Contacto', path: '/contacto' },
];

const settings = ['Iniciar Sesión', 'Registrarse', 'Cerrar Sesión'];

const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElProductosDesktop, setAnchorElProductosDesktop] =
    useState(null);
  const [anchorElProductosMobile, setAnchorElProductosMobile] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const { carrito, cantidadTotal } = useCarrito();
  const navigate = useNavigate();
  const location = useLocation();

  console.log(carrito);

  const CarritoComponent = Carrito();

  // Detectar si estamos en una ruta de categoría
  const isCategoriaPage = location.pathname.startsWith('/categoria/');

  // Obtener categorías al cargar el componente
  useEffect(() => {
    api
      .get('/categorias')
      .then((res) => {
        console.log('Respuesta categorias:', res.data);
        setCategorias(res.data.data);
      })
      .catch((err) => console.error('Error al obtener categorías', err));
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Para escritorio
  const handleOpenProductosMenuDesktop = (event) => {
    setAnchorElProductosDesktop(event.currentTarget);
  };

  const handleCloseProductosMenuDesktop = () => {
    setAnchorElProductosDesktop(null);
  };

  // Para móvil
  const handleOpenProductosMenuMobile = (event) => {
    setAnchorElProductosMobile(event.currentTarget);
  };

  const handleCloseProductosMenuMobile = () => {
    setAnchorElProductosMobile(null);
  };

  // Función para navegar a la categoría seleccionada
  const handleCategoriaClick = (categoriaId) => {
    navigate(`/categoria/${categoriaId}`);
    handleCloseProductosMenuDesktop();
  };

  // Función para navegar a la categoría desde el menú móvil
  const handleCategoriaClickMobile = (categoriaId) => {
    navigate(`/categoria/${categoriaId}`);
    handleCloseProductosMenuMobile();
    handleCloseNavMenu();
  };

  const handleUserMenuClick = (setting) => {
    if (setting === 'Iniciar Sesión') setShowLogin(true);
    if (setting === 'Registrarse') setShowRegister(true);
    if (setting === 'Cerrar Sesión') {
      console.log('Cerrar sesión');
    }
    handleCloseUserMenu();
  };

  <IconButton
    onClick={CarritoComponent.toggleDrawer(true)} // Abre el drawer
    color='inherit'
    sx={{
      color: 'white',
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: '#dc2626',
        color: 'white',
      },
      borderRadius: '6px',
      padding: '8px',
    }}>
    <Badge
      badgeContent={cantidadTotal}
      color='error'>
      <ShoppingCartIcon sx={{ color: 'white' }} />
    </Badge>
  </IconButton>;

  {
    /* Renderiza el Drawer del carrito */
  }
  {
    CarritoComponent.CarritoDrawer;
  }

  return (
    <AppBar
      position='sticky'
      sx={{ backgroundColor: '#1F2937', color: '#fff' }}>
      <Container maxWidth='xl'>
        <Toolbar className='h-20 flex justify-between items-center w-full '>
          {/* IZQUIERDA: menú hamburguesa + logo */}
          <Box className='flex items-center gap-2'>
            {/* Menu hamburguesa SOLO en mobile */}
            <Box className='lg:hidden'>
              <IconButton
                edge='start'
                onClick={handleOpenNavMenu}
                sx={{
                  color: '#ffffff',
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: '#dc2626',
                    color: '#fff',
                  },
                  borderRadius: '6px',
                  padding: '8px',
                }}>
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Logo */}
            <Link to='/'>
              <Box
                component='img'
                src={logo}
                alt='Logo'
                sx={{
                  height: 40,
                  width: 'auto',
                  '@media (max-width:900px)': { height: 35 },
                  '@media (max-width:600px)': { height: 30 },
                }}
              />
            </Link>
          </Box>

          {/* DERECHA: enlaces */}
          <Box className='flex items-center gap-4'>
            <Box className='hidden lg:flex gap-4'>
              {pages.map((page) =>
                page.hasDropdown ? (
                  <Box key={page.name}>
                    <Button
                      onClick={handleOpenProductosMenuDesktop}
                      sx={{
                        color: 'white',
                        backgroundColor: isCategoriaPage
                          ? '#dc2626'
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: '#dc2626',
                          color: 'white',
                        },
                        py: 1,
                        px: 2,
                        borderRadius: 1,
                        textTransform: 'none',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}>
                      {page.name}
                      {anchorElProductosDesktop ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </Button>

                    {/* Menú de productos */}
                    <Menu
                      anchorEl={anchorElProductosDesktop}
                      open={Boolean(anchorElProductosDesktop)}
                      onClose={handleCloseProductosMenuDesktop}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                      PaperProps={{
                        sx: {
                          mt: '19px',
                          backgroundColor: '#1F2937',
                          color: '#fff',
                          minWidth: '160px',
                          pl: 2,
                          pr: 2,
                        },
                      }}>
                      {categorias.map((categoria) => (
                        <MenuItem
                          key={categoria.id}
                          onClick={() => {
                            handleCategoriaClick(categoria.id);
                            handleCloseProductosMenuDesktop();
                          }}
                          sx={{
                            fontSize: '0.9rem',
                            color: '#fff',
                            borderRadius: '8px',
                            pl: 2,
                            pr: 2,
                            mx: 0.5,
                            '&:hover': {
                              backgroundColor: '#dc2626',
                              color: '#fff',
                            },
                          }}>
                          {categoria.nombre}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                ) : (
                  <Button
                    key={page.name}
                    component={NavLink}
                    to={page.path}
                    className={({ isActive }) => (isActive ? 'active' : '')}
                    sx={{
                      color: 'white',
                      backgroundColor: 'transparent',
                      '&.active': {
                        backgroundColor: '#dc2626',
                        color: 'white',
                      },
                      '&:hover': {
                        backgroundColor: '#dc2626',
                        color: 'white',
                      },
                      py: 1,
                      px: 2,
                      borderRadius: 1,
                      textTransform: 'none',
                      fontWeight: 500,
                    }}>
                    {page.name}
                  </Button>
                )
              )}
            </Box>

            {/* Iconos de carrito y usuario */}
            <IconButton
              onClick={CarritoComponent.toggleDrawer(true)}
              sx={{
                color: 'white',
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: '#dc2626',
                  color: 'white',
                },
                borderRadius: '6px',
                padding: '8px',
              }}>
              <Badge
                badgeContent={cantidadTotal}
                color='error'>
                <ShoppingCartIcon sx={{ color: 'white' }} />
              </Badge>
            </IconButton>

            <Tooltip title='Cuenta'>
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0 }}>
                <Avatar
                  alt='Usuario'
                  src={avatarImg}
                />
              </IconButton>
            </Tooltip>

            {/* Menú de usuario */}
            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: {
                  mt: '19px',
                  width: '180px',
                  backgroundColor: '#1F2937',
                  color: '#fff',
                  pl: '20px',
                  pr: '20px',
                  boxSizing: 'border-box',
                },
              }}>
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleUserMenuClick(setting)}
                  sx={{
                    color: '#fff',
                    borderRadius: '6px',
                    py: 0.7,
                    '&:hover': {
                      backgroundColor: '#dc2626',
                      color: '#fff',
                    },
                    '& .MuiTypography-root': {
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      textTransform: 'none',
                      width: '100%',
                      textAlign: 'left',
                    },
                  }}>
                  <Typography>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>

        {/* Menú móvil */}
        <Menu
          anchorEl={anchorElNav}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          sx={{ display: { xs: 'block', lg: 'none' } }}
          PaperProps={{
            sx: {
              width: '100vw',
              maxWidth: '100vw',
              left: '0px !important',
              right: '0px',
              mt: '20px',
              borderRadius: '0px',
              backgroundColor: '#1F2937',
              color: '#fff',
              pl: '20px',
              pr: '20px',
              boxSizing: 'border-box',
            },
          }}>
          {pages.map((page) => (
            <Box key={page.name}>
              {page.hasDropdown ? (
                <>
                  <MenuItem
                    onClick={handleOpenProductosMenuMobile}
                    sx={{
                      my: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: isCategoriaPage
                        ? '#dc2626'
                        : 'transparent',
                      color: isCategoriaPage ? 'white' : '#fff',
                      '&:hover': {
                        backgroundColor: '#dc2626',
                        color: 'white',
                        borderRadius: '8px',
                      },
                    }}>
                    <Typography
                      textAlign='center'
                      sx={{
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        textTransform: 'none',
                        color: 'inherit',
                      }}>
                      {page.name}
                    </Typography>
                    <IconButton
                      size='small'
                      sx={{ color: 'inherit' }}>
                      {anchorElProductosMobile ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </IconButton>
                  </MenuItem>

                  {/* Menú desplegable de productos en móvil */}
                  <Menu
                    anchorEl={anchorElProductosMobile}
                    open={Boolean(anchorElProductosMobile)}
                    onClose={handleCloseProductosMenuMobile}
                    PaperProps={{
                      sx: {
                        backgroundColor: '#1F2937',
                        color: '#fff',
                        pl: 3,
                        pr: 3,
                        mt: 1,
                        ml: 2,
                      },
                    }}>
                    {categorias.map((categoria) => (
                      <MenuItem
                        key={categoria.id}
                        onClick={() => {
                          handleCategoriaClickMobile(categoria.id);
                          handleCloseProductosMenuMobile();
                        }}
                        sx={{
                          fontSize: '0.9rem',
                          color: '#fff',
                          textTransform: 'none',
                          borderRadius: '8px',
                          pl: 2,
                          pr: 2,
                          mx: 0.5,
                          '&:hover': {
                            backgroundColor: '#dc2626',
                            color: '#fff',
                          },
                        }}>
                        {categoria.nombre}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : (
                <MenuItem
                  component={NavLink}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  sx={{
                    my: 1,
                    color: '#fff',
                    '&.active': {
                      backgroundColor: '#dc2626',
                      color: 'white',
                      borderRadius: '8px',
                    },
                    '&:hover': {
                      backgroundColor: '#dc2626',
                      color: 'white',
                      borderRadius: '8px',
                    },
                    '& .MuiTypography-root': {
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      textTransform: 'none',
                    },
                  }}>
                  <Typography textAlign='center'>{page.name}</Typography>
                </MenuItem>
              )}
            </Box>
          ))}
        </Menu>

        {/* Modales de autenticación */}
        <LoginModal
          open={showLogin}
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => setShowRegister(true)}
        />
        <RegisterClienteModal
          open={showRegister}
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => setShowLogin(true)}
        />

        {CarritoComponent.CarritoDrawer}
      </Container>
    </AppBar>
  );
};

export default Header;
