import type { ModuleManifest } from '@shared/types/module-manifest.ts';
import __name__Routes from './routes.ts';

/**
 * Module manifest — the single entry point the app shell reads.
 *
 * Replace every __Name__ / __name__ placeholder with your module name.
 * Then register this manifest in modules/registry.ts.
 */
export const __name__Module: ModuleManifest = {
  name: '__name__',
  routes: __name__Routes,

  // Access control — omit for unrestricted, or list allowed roles
  allowedRoles: ['admin', 'editor'],

  // Subscription gate — omit if the module is available on all plans
  // minPlan: 'starter',

  // Set to true for public modules (e.g. auth) that render outside the shell
  // public: true,

  // Sidebar navigation is configured in root/navigation.ts
};

export { __name__Routes };
