import type { RouteObject } from 'react-router';

const settingsRoutes: RouteObject = {
  path: 'settings',
  lazy: () => import('./layout.tsx'),
  children: [
    { index: true, lazy: () => import('./pages/GeneralSettings.tsx') },
    { path: 'security', lazy: () => import('./pages/SecuritySettings.tsx') },
    { path: 'notifications', lazy: () => import('./pages/NotificationSettings.tsx') },
  ],
};

export default settingsRoutes;
