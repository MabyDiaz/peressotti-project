import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import CuponProvider from './context/CuponContext.jsx';
import CssBaseline from '@mui/material/CssBaseline';
import ProtectedRoute from './admin/components/ProtectedRoute';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Productos from './pages/Productos.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Contacto from './pages/Contacto.jsx';
import DetalleCategoria from './pages/DetalleCategoria';
import DetalleProducto from './pages/DetalleProducto.jsx';
import Carrito from './pages/Carrito.jsx';
import { ToastContainer } from 'react-toastify';

// Admin
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminClientes from './admin/pages/AdminClientes';
import AdminProductos from './admin/pages/AdminProductos';
import AdminPedidos from './admin/pages/AdminPedidos';
import AdminCategorias from './admin/pages/AdminCategorias';
import AdminCupones from './admin/pages/AdminCupones';
import AdminAdministradores from './admin/pages/AdminAdministradores.jsx';

import './App.css';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      <CssBaseline />

      <CuponProvider>
        <Routes>
          <Route
            path='/'
            element={<Home />}
          />

          <Route
            path='/productos'
            element={<Productos />}
          />

          <Route
            path='/nosotros'
            element={<Nosotros />}
          />

          <Route
            path='/contacto'
            element={<Contacto />}
          />

          <Route
            path='/categoria/:id'
            element={<DetalleCategoria />}
          />
          <Route
            path='/producto/:id'
            element={<DetalleProducto />}
          />

          <Route
            path='/carrito'
            element={<Carrito />}
          />

          {/* Admin */}
          {/* Login admin */}
          <Route
            path='/admin/login'
            element={<AdminLogin />}
          />

          {/* Panel admin */}
          <Route
            element={<ProtectedRoute allowedRoles={['ADMIN', 'DISENADOR']} />}>
            <Route
              path='/admin'
              element={<AdminLayout />}>
              <Route
                index
                element={<AdminDashboard />}
              />
              {/* ADMIN */}
              <Route
                path='clientes'
                element={<AdminClientes />}
              />
              <Route
                path='productos'
                element={<AdminProductos />}
              />
              <Route
                path='categorias'
                element={<AdminCategorias />}
              />
              <Route
                path='cupones'
                element={<AdminCupones />}
              />
              <Route
                path='pedidos'
                element={<AdminPedidos />}
              />
              <Route
                path='administradores'
                element={<AdminAdministradores />}
              />
            </Route>
          </Route>
        </Routes>
      </CuponProvider>

      <ToastContainer
        position='bottom-left'
        autoClose={3000}
      />
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
