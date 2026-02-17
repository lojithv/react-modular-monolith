import type { ModuleManifest } from '@shared/types/module-manifest.ts';
import authRoutes from './routes.ts';

export const authModule: ModuleManifest = {
  name: 'auth',
  routes: authRoutes,
  public: true,
};

export { authRoutes };
