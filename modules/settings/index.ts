import type { ModuleManifest } from '@shared/types/module-manifest.ts';
import settingsRoutes from './routes.ts';

export const settingsModule: ModuleManifest = {
  name: 'settings',
  routes: settingsRoutes,
  sidebar: [{ to: '/settings', label: 'Settings', roles: ['admin', 'editor'] }],
  allowedRoles: ['admin', 'editor'],
};

export { settingsRoutes };
