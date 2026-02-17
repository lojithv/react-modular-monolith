import { Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth.ts';
import type { PlanTier } from '../models/auth.types.ts';
import Paywall from '@shared/components/Paywall.tsx';

interface SubscriptionGuardProps {
  minPlan: PlanTier;
}

/**
 * Route guard that enforces a minimum subscription plan.
 * Assumes AuthGuard already enforces authentication at the shell level.
 * - Plan too low → render Paywall upgrade page
 * - Plan sufficient → render child routes
 */
export default function SubscriptionGuard({ minPlan }: SubscriptionGuardProps) {
  const { hasPlan } = useAuth();

  if (!hasPlan(minPlan)) {
    return <Paywall requiredPlan={minPlan} />;
  }

  return <Outlet />;
}
