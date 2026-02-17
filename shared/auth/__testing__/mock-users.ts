import type { AuthUser } from '../models/auth.types.ts';

/** Admin user on pro plan with all features */
export const mockAdmin: AuthUser = {
  id: '1',
  name: 'Alice Johnson',
  email: 'alice@example.com',
  role: 'admin',
  subscription: { plan: 'pro', trialEndsAt: null },
  features: ['analytics', 'bulk-export', 'api-access'],
};

/** Editor user on starter plan with limited features */
export const mockEditor: AuthUser = {
  id: '2',
  name: 'Bob Smith',
  email: 'bob@example.com',
  role: 'editor',
  subscription: { plan: 'starter', trialEndsAt: null },
  features: ['analytics'],
};

/** Viewer user on free plan with no features */
export const mockViewer: AuthUser = {
  id: '3',
  name: 'Charlie Brown',
  email: 'charlie@example.com',
  role: 'viewer',
  subscription: { plan: 'free', trialEndsAt: null },
  features: [],
};

/** Viewer user on free plan with an expired trial */
export const mockExpiredTrial: AuthUser = {
  id: '4',
  name: 'Dana White',
  email: 'dana@example.com',
  role: 'viewer',
  subscription: { plan: 'free', trialEndsAt: '2020-01-01T00:00:00Z' },
  features: [],
};

/** Viewer user on free plan with an active trial (far future) */
export const mockActiveTrial: AuthUser = {
  id: '5',
  name: 'Eve Green',
  email: 'eve@example.com',
  role: 'viewer',
  subscription: { plan: 'free', trialEndsAt: '2099-12-31T23:59:59Z' },
  features: ['analytics'],
};

/** Enterprise user with all features */
export const mockEnterprise: AuthUser = {
  id: '6',
  name: 'Frank Enterprise',
  email: 'frank@example.com',
  role: 'admin',
  subscription: { plan: 'enterprise', trialEndsAt: null },
  features: ['analytics', 'bulk-export', 'api-access', 'sso', 'audit-log'],
};
