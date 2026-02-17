import { Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth.ts';
import type { FeatureFlag } from '../models/auth.types.ts';
import FeatureUnavailable from '@shared/components/FeatureUnavailable.tsx';

interface FeatureGuardProps {
  features: FeatureFlag[];
}

/**
 * Route guard that checks for required feature flags.
 * Assumes AuthGuard already enforces authentication at the shell level.
 * - Missing feature flag → render FeatureUnavailable page
 * - All flags present → render child routes
 */
export default function FeatureGuard({ features }: FeatureGuardProps) {
  const { hasFeature } = useAuth();

  if (!hasFeature(features)) {
    return <FeatureUnavailable features={features} />;
  }

  return <Outlet />;
}
