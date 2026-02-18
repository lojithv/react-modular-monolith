import type { ModuleManifest } from '@shared/types/module-manifest.ts';
import dashboardRoutes from './routes.ts';

export const dashboardModule: ModuleManifest = {
  name: 'dashboard',
  routes: dashboardRoutes,
  allowedRoles: ['admin', 'editor', 'viewer'],
};

export { dashboardRoutes };
