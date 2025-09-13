// import { Outlet, NavLink } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth.js';

// export default function AdminLayout() {
//   const { user, logout } = useAuth();

//   const handleLogout = () => {
//     logout();
//   };

//   // Función para clases de links activos
//   const linkClass = ({ isActive }) =>
//     isActive
//       ? 'bg-red-600 text-white py-2 px-4 rounded transition-colors duration-200' // estilo activo (igual que el botón)
//       : 'text-white py-2 px-4 rounded hover:bg-red-600 hover:text-white transition-colors duration-200'; // estilo normal

//   return (
//     <div className='flex h-screen'>
//       {/* Sidebar */}
//       <aside className='w-64 bg-gray-800 text-white flex flex-col'>
//         <div className='p-4'>
//           <h1 className='text-lg font-bold mb-2 uppercase'>
//             Imprenta Peressotti
//           </h1>
//           <h2 className='text-sm font-semibold text-gray-300'>
//             Panel de Administración
//           </h2>
//         </div>

//         <nav className='flex flex-col gap-3 flex-1 p-4 text-sm'>
//           {/* Dashboard para todos */}
//           <NavLink
//             to='/admin'
//             end
//             className={linkClass}>
//             Dashboard
//           </NavLink>

//           {/* Links solo para ADMIN */}
//           {user?.roles?.includes('ADMIN') && (
//             <>
//               <NavLink
//                 to='/admin/clientes'
//                 className={linkClass}>
//                 Clientes
//               </NavLink>
//               <NavLink
//                 to='/admin/productos'
//                 className={linkClass}>
//                 Productos
//               </NavLink>
//               <NavLink
//                 to='/admin/categorias'
//                 className={linkClass}>
//                 Categorías
//               </NavLink>
//               <NavLink
//                 to='/admin/cupones'
//                 className={linkClass}>
//                 Cupones
//               </NavLink>
//             </>
//           )}

//           {/* Pedidos para ADMIN y DISENADOR */}
//           {user?.roles?.includes('ADMIN') ||
//           user?.roles?.includes('DISENADOR') ? (
//             <NavLink
//               to='/admin/pedidos'
//               className={linkClass}>
//               Pedidos
//             </NavLink>
//           ) : null}
//         </nav>

//         {/* Botón de cerrar sesión */}
//         <div className='p-4 border-t border-gray-700'>
//           <button
//             onClick={handleLogout}
//             className='w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-4 rounded transition-colors duration-200'>
//             Cerrar sesión
//           </button>
//         </div>
//       </aside>

//       {/* Contenido dinámico */}
//       <main className='flex-1 p-6 overflow-y-auto bg-gray-50'>
//         <Outlet />
//       </main>
//     </div>
//   );
// }

import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export default function AdminLayout() {
  const { user, logout } = useAuth();

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

        <nav className='flex flex-col gap-3 flex-1 p-4 text-sm'>
          {/* Todos los roles ven dashboard */}
          <NavLink
            to='/admin'
            end
            className={linkClass}>
            Dashboard
          </NavLink>

          {/* ADMIN: todo el resto */}
          {user?.roles?.includes('ADMIN') && (
            <>
              <NavLink
                to='/admin/clientes'
                className={linkClass}>
                Clientes
              </NavLink>
              <NavLink
                to='/admin/productos'
                className={linkClass}>
                Productos
              </NavLink>
              {/* <NavLink
                to='/admin/categorias'
                className={linkClass}>
                Categorías
              </NavLink>
              <NavLink
                to='/admin/cupones'
                className={linkClass}>
                Cupones de descuento
              </NavLink>
              <NavLink
                to='/admin/pedidos'
                className={linkClass}>
                Pedidos
              </NavLink> */}
              <NavLink
                to='/admin/administradores'
                className={linkClass}>
                Administradores
              </NavLink>
            </>
          )}

          {/* DISENADOR: solo pedidos */}
          {user?.roles?.includes('DISENADOR') && (
            <NavLink
              to='/admin/pedidos'
              className={linkClass}>
              Pedidos
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
