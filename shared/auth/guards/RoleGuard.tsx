import { Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth.ts';
import type { UserRole } from '../models/auth.types.ts';
import Forbidden from '@shared/components/Forbidden.tsx';

interface RoleGuardProps {
  roles: UserRole[];
}

/**
 * Route guard that checks role authorization.
 * Assumes AuthGuard already enforces authentication at the shell level.
 * - Wrong role → render 403 Forbidden
 * - Authorized → render child routes via <Outlet />
 */
export default function RoleGuard({ roles }: RoleGuardProps) {
  const { hasRole } = useAuth();

  if (!hasRole(roles)) {
    return <Forbidden />;
  }

  return <Outlet />;
}
