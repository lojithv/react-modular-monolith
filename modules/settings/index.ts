import type { ModuleManifest } from '@shared/types/module-manifest.ts';
import settingsRoutes from './routes.ts';

export const settingsModule: ModuleManifest = {
  name: 'settings',
  routes: settingsRoutes,
  allowedRoles: ['admin', 'editor'],
};

export { settingsRoutes };
