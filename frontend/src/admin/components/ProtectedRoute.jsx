import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <Navigate
        to='/admin/login'
        replace
      />
    );
  }

  const hasRole = allowedRoles.some((r) => user.roles?.includes(r));
  if (!hasRole) {
    return (
      <Navigate
        to='/'
        replace
      />
    );
  }

  return <Outlet />;
}
