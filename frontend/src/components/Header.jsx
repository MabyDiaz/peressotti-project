import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../hooks/useCarrito.js';

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
  const [anchorElProductos, setAnchorElProductos] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // const { cantidadTotal } = useCarrito();
  const navigate = useNavigate();

  const { carrito, cantidadTotal } = useCarrito();
  console.log('Carrito en Header:', carrito);
  console.log('Cantidad total en Header:', cantidadTotal);

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

  const handleOpenProductosMenu = (event) => {
    setAnchorElProductos(event.currentTarget);
  };

  const handleCloseProductosMenu = () => {
    setAnchorElProductos(null);
  };

  // Función para navegar a la categoría seleccionada
  const handleCategoriaClick = (categoriaId) => {
    navigate(`/categoria/${categoriaId}`);
    handleCloseProductosMenu();
  };

  // Función para navegar a la categoría desde el menú móvil
  const handleCategoriaClickMobile = (categoriaId) => {
    navigate(`/categoria/${categoriaId}`);
    handleCloseProductosMenu();
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

  return (
    <AppBar
      position='sticky'
      color='default'
      sx={{ backgroundColor: '#ffffff' }}>
      <Container maxWidth='xl'>
        <Toolbar className='h-20 flex justify-between items-center w-full'>
          {/* IZQUIERDA: menú hamburguesa + logo */}
          <Box className='flex items-center gap-2'>
            {/* Menu hamburguesa SOLO en mobile */}
            <Box className='lg:hidden'>
              <IconButton
                edge='start'
                onClick={handleOpenNavMenu}
                sx={{ color: 'black', '&:hover': { color: '#2B7FFF' } }}>
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
                      onClick={handleOpenProductosMenu}
                      sx={{
                        color: 'black',
                        textTransform: 'uppercase',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        '&:hover': { color: '#2B7FFF' },
                      }}>
                      {page.name}
                      {anchorElProductos ? <ExpandLess /> : <ExpandMore />}
                    </Button>
                    <Menu
                      anchorEl={anchorElProductos}
                      open={Boolean(anchorElProductos)}
                      onClose={handleCloseProductosMenu}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                      sx={{ mt: '20px' }}>
                      {categorias.map((categoria) => (
                        <MenuItem
                          key={categoria.id}
                          onClick={() => handleCategoriaClick(categoria.id)}
                          sx={{
                            '&:hover': {
                              backgroundColor: '#F6FAFD',
                              color: '#2B7FFF',
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
                    component={Link}
                    to={page.path}
                    sx={{
                      color: 'black',
                      textTransform: 'uppercase',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      '&:hover': { color: '#2B7FFF' },
                    }}>
                    {page.name}
                  </Button>
                )
              )}
            </Box>

            {/* Iconos de carrito y usuario */}
            <IconButton
              component={Link}
              to='/carrito'
              color='inherit'>
              <Badge
                badgeContent={cantidadTotal}
                color='error'>
                <ShoppingCartIcon sx={{ color: 'black' }} />
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
                  mt: '20px',
                  width: '180px',
                  pl: '20px',
                  pr: '20px',
                  boxSizing: 'border-box',
                },
              }}>
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleUserMenuClick(setting)} // ✅ ahora abre el modal correcto
                  sx={{
                    '&:hover': { backgroundColor: '#F6FAFD', color: '#2B7FFF' },
                  }}>
                  <Typography
                    textAlign='center'
                    sx={{
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                    }}>
                    {setting}
                  </Typography>
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
              pl: '20px',
              pr: '20px',
              boxSizing: 'border-box',
            },
          }}>
          {pages.map((page) => (
            <Box key={page.name}>
              <MenuItem
                onClick={page.hasDropdown ? null : handleCloseNavMenu}
                component={page.hasDropdown ? 'div' : Link}
                to={page.hasDropdown ? null : page.path}
                sx={{
                  my: 1,
                  '&:hover': {
                    backgroundColor: '#F6FAFD',
                    color: '#2B7FFF',
                  },
                }}>
                <Typography
                  textAlign='center'
                  sx={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                  }}>
                  {page.name}
                </Typography>
                {page.hasDropdown && (
                  <IconButton onClick={handleOpenProductosMenu}>
                    {anchorElProductos ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                )}
              </MenuItem>

              {/* Menú desplegable para móvil */}
              {page.hasDropdown && (
                <Menu
                  anchorEl={anchorElProductos}
                  open={Boolean(anchorElProductos)}
                  onClose={handleCloseProductosMenu}>
                  {categorias.map((categoria) => (
                    <MenuItem
                      key={categoria.id}
                      onClick={() => handleCategoriaClickMobile(categoria.id)}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#F6FAFD',
                          color: '#2B7FFF',
                        },
                      }}>
                      {categoria.nombre}
                    </MenuItem>
                  ))}
                </Menu>
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
      </Container>
    </AppBar>
  );
};

export default Header;
