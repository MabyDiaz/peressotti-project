import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

import {
  FaHome,
  FaUsers,
  FaTags,
  FaUserFriends,
  FaGift,
  FaBox,
  FaClipboardList,
  FaUserShield,
} from 'react-icons/fa';

export default function AdminLayout() {
  const { user, logout, loading } = useAuth();

  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-red-600 text-white py-2 px-4 rounded transition-colors duration-200'
      : 'text-white py-2 px-4 rounded hover:bg-red-600 hover:text-white transition-colors duration-200';

  return (
    <div className='flex h-screen'>
      <aside className='w-64 bg-gray-800 text-white flex flex-col'>
        <div className='p-4'>
          <h1 className='text-lg font-bold mb-2 uppercase'>
            Imprenta Peressotti
          </h1>
          <h2 className='text-sm font-semibold text-gray-300'>
            Panel de Administración
          </h2>
        </div>

        <div className='p-4'>
          <h1 className='text-lg font-bold mb-2 uppercase'>
            Imprenta Peressotti
          </h1>
          <h2 className='text-sm font-semibold text-gray-300'>
            Panel de Administración
          </h2>

          {/* 👇 Saludo personalizado */}
          {loading ? (
            <p className='text-xs text-gray-400 italic'>Cargando...</p>
          ) : user ? (
            <p className='text-xs text-white mt-2'>
              Hola,{' '}
              <strong>
                {user.nombre} {user.apellido}
              </strong>
            </p>
          ) : null}
        </div>

        <nav className='flex flex-col gap-3 flex-1 p-4 text-sm'>
          {/* Todos los roles ven dashboard */}
          <NavLink
            to='/admin'
            end
            className={linkClass}>
            <div className='flex items-center gap-2'>
              <FaHome />
              Dashboard
            </div>
          </NavLink>

          {/* ADMIN: todo el resto */}
          {user?.roles?.includes('ADMIN') && (
            <>
              <NavLink
                to='/admin/administradores'
                className={linkClass}>
                <div className='flex items-center gap-2'>
                  <FaUsers />
                  Administradores
                </div>
              </NavLink>

              <NavLink
                to='/admin/categorias'
                className={linkClass}>
                <div className='flex items-center gap-2'>
                  <FaTags />
                  Categorías
                </div>
              </NavLink>

              <NavLink
                to='/admin/clientes'
                className={linkClass}>
                <div className='flex items-center gap-2'>
                  <FaUserFriends />
                  Clientes
                </div>
              </NavLink>

              <NavLink
                to='/admin/cupones'
                className={linkClass}>
                <div className='flex items-center gap-2'>
                  <FaGift />
                  Cupones de descuento
                </div>
              </NavLink>

              <NavLink
                to='/admin/pedidos'
                className={linkClass}>
                <div className='flex items-center gap-2'>
                  <FaClipboardList />
                  Pedidos
                </div>
              </NavLink>

              <NavLink
                to='/admin/productos'
                className={linkClass}>
                <div className='flex items-center gap-2'>
                  <FaBox />
                  Productos
                </div>
              </NavLink>

              <NavLink
                to='/admin/roles'
                className={linkClass}>
                <div className='flex items-center gap-2'>
                  <FaUserShield />
                  Roles
                </div>
              </NavLink>
            </>
          )}

          {/* DISENADOR: solo pedidos */}
          {user?.roles?.includes('DISENADOR') && (
            <NavLink
              to='/admin/pedidos'
              className={linkClass}>
              <div className='flex items-center gap-2'>
                <FaClipboardList />
                Pedidos
              </div>
            </NavLink>
          )}
        </nav>

        <div className='p-4 border-t border-gray-700'>
          <button
            onClick={logout}
            className='w-full bg-red-600 hover:bg-red-700 text-white tex-sm py-2 px-4 rounded'>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className='flex-1 p-6 overflow-y-auto bg-gray-50'>
        <Outlet />
      </main>
    </div>
  );
}
