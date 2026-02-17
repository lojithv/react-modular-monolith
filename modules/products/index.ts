import type { ModuleManifest } from '@shared/types/module-manifest.ts';
import productRoutes from './routes.ts';

export const productsModule: ModuleManifest = {
  name: 'products',
  routes: productRoutes,
  sidebar: [{ to: '/products', label: 'Products', roles: ['admin', 'editor'] }],
  allowedRoles: ['admin', 'editor'],
  minPlan: 'starter',
};

export { productRoutes };
