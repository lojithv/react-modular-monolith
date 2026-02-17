import { Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth.ts';
import TrialExpired from '@shared/components/TrialExpired.tsx';

/**
 * Route guard that requires an active trial or paid plan.
 * Assumes AuthGuard already enforces authentication at the shell level.
 * - Trial expired and on free plan → render TrialExpired page
 * - Trial active or on paid plan → render child routes
 */
export default function TrialGuard() {
  const { isTrialActive, hasPlan } = useAuth();

  if (!isTrialActive() && !hasPlan('starter')) {
    return <TrialExpired />;
  }

  return <Outlet />;
}
