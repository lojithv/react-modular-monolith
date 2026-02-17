import type { RouteObject } from 'react-router';
import { createBrowserRouter } from 'react-router';
import RootLayout from '@shared/layouts/RootLayout.tsx';
import NotFound from '@shared/components/NotFound.tsx';
import ErrorBoundary from '@shared/components/ErrorBoundary.tsx';
import {
  AuthGuard,
  RoleGuard,
  FeatureGuard,
  SubscriptionGuard,
  TrialGuard,
  type UserRole,
  type PlanTier,
  type FeatureFlag,
} from '@shared/auth/index.ts';
import type { ModuleManifest } from '@shared/types/module-manifest.ts';
import { publicModules, protectedModules } from '@modules/registry.ts';

// ─── Guard Helpers ──────────────────────────────────────
// Wrap module routes with pathless layout routes that enforce access rules.

function withRoles(roles: UserRole[]) {
  return { element: <RoleGuard roles={roles} /> };
}

function withFeatures(features: FeatureFlag[]) {
  return { element: <FeatureGuard features={features} /> };
}

function withPlan(minPlan: PlanTier) {
  return { element: <SubscriptionGuard minPlan={minPlan} /> };
}

function withTrial() {
  return { element: <TrialGuard /> };
}

/**
 * Build a guarded route subtree for a single module manifest.
 * Wraps the module's routes with RoleGuard and optionally SubscriptionGuard
 * based on the manifest's `allowedRoles` and `minPlan` fields.
 */
function buildModuleRoute(manifest: ModuleManifest): RouteObject {
  let inner: RouteObject[] = [manifest.routes];

  if (manifest.minPlan) {
    inner = [{ ...withPlan(manifest.minPlan), children: inner }];
  }

  if (manifest.allowedRoles && manifest.allowedRoles.length > 0) {
    return { ...withRoles(manifest.allowedRoles), children: inner };
  }

  return inner[0];
}

/**
 * Root route configuration — composes module routes from the registry.
 * Adding a new module only requires updating modules/registry.ts.
 */
const router = createBrowserRouter([
  // ─── Public Modules (no sidebar layout, no auth) ──────
  ...publicModules.map((m) => ({ ...m.routes, ErrorBoundary })),

  // ─── Authenticated Shell ──────────────────────────────
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary,
    children: [
      {
        element: <AuthGuard />,
        children: [
          // Module routes — built automatically from manifests
          ...protectedModules.map(buildModuleRoute),

          // ─── UI Showcase (dev only) ───────────────────────
          { path: 'ui', lazy: () => import('@shared/ui/pages/UIShowcase.tsx') },

          // ─── Home (default redirect) ──────────────────────
          { index: true, lazy: () => import('@modules/dashboard/pages/DashboardHome.tsx') },

          // ─── 404 Catch-all ────────────────────────────────
          { path: '*', Component: NotFound },
        ],
      },
    ],
  },
]);

export default router;

// Re-export helpers so modules can use them in their own routes.ts if needed
export { withRoles, withFeatures, withPlan, withTrial };
