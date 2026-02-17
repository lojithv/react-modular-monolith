import { useMemo, useSyncExternalStore } from 'react';
import { authStore } from '../services/auth.service.ts';
import type { AuthState, AuthUser, UserRole, PlanTier, FeatureFlag } from '../models/auth.types.ts';

export interface UseAuthReturn extends AuthState {
  login: (user: AuthUser) => void;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  hasFeature: (flags: FeatureFlag | FeatureFlag[]) => boolean;
  hasPlan: (minPlan: PlanTier) => boolean;
  isTrialActive: () => boolean;
}

/**
 * Stable method references — these are bound once in the AuthStore constructor
 * and never change, so we hoist them to module scope to avoid re-creating the
 * return object on every render.
 */
const methods = {
  login: authStore.login,
  logout: authStore.logout,
  hasRole: authStore.hasRole,
  hasFeature: authStore.hasFeature,
  hasPlan: authStore.hasPlan,
  isTrialActive: authStore.isTrialActive,
} as const;

/**
 * React hook that subscribes to the framework-agnostic AuthStore.
 * Uses `useSyncExternalStore` — no Context or Provider needed.
 * Works in both monolith and microfrontend setups.
 *
 * Returns a memoized object that only changes when auth state changes.
 */
export function useAuth(): UseAuthReturn {
  const state = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
  );

  return useMemo(() => ({ ...state, ...methods }), [state]);
}
