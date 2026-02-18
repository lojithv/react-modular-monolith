import { modules } from '@modules/registry.ts';
import type { UserRole, PlanTier } from '@shared/auth/index.ts';

export interface NavItem {
  to: string;
  label: string;
  /** Links this item to a module manifest for automatic access filtering */
  module: string;
}

/**
 * Centralized sidebar navigation config.
 *
 * Each entry's visibility is auto-derived from its module's
 * `allowedRoles` and `minPlan` — no need to duplicate access rules here.
 *
 * To add a nav item: add an entry here and ensure the module is registered.
 * To reorder navigation: reorder the entries in this array.
 */
export const sidebarNav: NavItem[] = [
  { module: 'dashboard', to: '/dashboard', label: 'Dashboard' },
  { module: 'products',  to: '/products',  label: 'Products' },
  { module: 'users',     to: '/users',     label: 'Users' },
  { module: 'settings',  to: '/settings',  label: 'Settings' },
];

const moduleMap = new Map(modules.map((m) => [m.name, m]));

/**
 * Returns the subset of `sidebarNav` the current user is allowed to see.
 * Checks the linked module's `allowedRoles` and `minPlan` so that sidebar
 * visibility is always in sync with route-level guards.
 */
export function getVisibleNav(
  hasRole: (roles: UserRole[]) => boolean,
  hasPlan: (plan: PlanTier) => boolean,
): NavItem[] {
  return sidebarNav.filter((item) => {
    const manifest = moduleMap.get(item.module);
    if (!manifest) return false;
    if (manifest.allowedRoles?.length && !hasRole(manifest.allowedRoles)) return false;
    if (manifest.minPlan && !hasPlan(manifest.minPlan)) return false;
    return true;
  });
}
