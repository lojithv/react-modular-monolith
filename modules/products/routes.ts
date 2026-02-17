import type { RouteObject } from 'react-router';

const productRoutes: RouteObject = {
  path: 'products',
  lazy: () => import('./layout.tsx'),
  children: [
    { index: true, lazy: () => import('./pages/ProductList.tsx') },
    { path: 'new', lazy: () => import('./pages/CreateProduct.tsx') },
    { path: ':productId', lazy: () => import('./pages/ProductDetail.tsx') },
    { path: ':productId/edit', lazy: () => import('./pages/EditProduct.tsx') },
  ],
};

export default productRoutes;
