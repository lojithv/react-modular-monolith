import type { RouteObject } from 'react-router';

/**
 * Route subtree for the __Name__ module.
 *
 * Every route uses `lazy` for automatic code-splitting.
 * The top-level `path` becomes the URL prefix (e.g. /orders).
 */
const __name__Routes: RouteObject = {
  path: '__name__',
  lazy: () => import('./layout.tsx'),
  children: [
    // List / index page
    { index: true, lazy: () => import('./pages/__Name__List.tsx') },

    // Create page
    { path: 'new', lazy: () => import('./pages/Create__Name__.tsx') },

    // Detail page  (dynamic segment)
    { path: ':__name__Id', lazy: () => import('./pages/__Name__Detail.tsx') },

    // Edit page
    { path: ':__name__Id/edit', lazy: () => import('./pages/Edit__Name__.tsx') },
  ],
};

export default __name__Routes;
