// Models
export type { UserRole, AuthUser, AuthState, PlanTier, FeatureFlag, Subscription } from './models/auth.types.ts';
export { PLAN_HIERARCHY } from './models/auth.types.ts';

// Store (framework-agnostic singleton)
export { AuthStore, authStore, MOCK_USER } from './services/auth.service.ts';

// Hooks (React adapter)
export { useAuth } from './hooks/useAuth.ts';

// Guards
export { default as AuthGuard } from './guards/AuthGuard.tsx';
export { default as RoleGuard } from './guards/RoleGuard.tsx';
export { default as FeatureGuard } from './guards/FeatureGuard.tsx';
export { default as SubscriptionGuard } from './guards/SubscriptionGuard.tsx';
export { default as TrialGuard } from './guards/TrialGuard.tsx';
