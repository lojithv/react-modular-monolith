import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth.ts';

/**
 * Route guard that requires authentication.
 * Unauthenticated users are redirected to /auth/login,
 * preserving the intended destination for redirect after login.
 */
export default function AuthGuard() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
