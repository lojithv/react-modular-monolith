import type { RouteObject } from 'react-router';

const userRoutes: RouteObject = {
  path: 'users',
  lazy: () => import('./layout.tsx'),
  children: [
    { index: true, lazy: () => import('./pages/UserList.tsx') },
    { path: ':userId', lazy: () => import('./pages/UserProfile.tsx') },
    { path: ':userId/settings', lazy: () => import('./pages/UserSettings.tsx') },
  ],
};

export default userRoutes;
