// ─── Roles ──────────────────────────────────────────────
export type UserRole = 'admin' | 'editor' | 'viewer';

// ─── Subscription & Billing ─────────────────────────────
export type PlanTier = 'free' | 'starter' | 'pro' | 'enterprise';

export interface Subscription {
  plan: PlanTier;
  trialEndsAt: string | null;
}

// ─── Feature Flags ──────────────────────────────────────
export type FeatureFlag = string;

// ─── User ───────────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subscription: Subscription;
  features: FeatureFlag[];
}

// ─── Store Snapshot ─────────────────────────────────────
export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

/** Ordered plan tiers for comparison (higher index = higher tier) */
export const PLAN_HIERARCHY: PlanTier[] = ['free', 'starter', 'pro', 'enterprise'];
