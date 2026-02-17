import type { ModuleManifest } from '@shared/types/module-manifest.ts';
import userRoutes from './routes.ts';

export const usersModule: ModuleManifest = {
  name: 'users',
  routes: userRoutes,
  sidebar: [{ to: '/users', label: 'Users', roles: ['admin'] }],
  allowedRoles: ['admin'],
  minPlan: 'pro',
};

export { userRoutes };
