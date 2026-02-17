import type { RouteObject } from 'react-router';

const dashboardRoutes: RouteObject = {
  path: 'dashboard',
  lazy: () => import('./layout.tsx'),
  children: [
    { index: true, lazy: () => import('./pages/DashboardHome.tsx') },
    { path: 'analytics', lazy: () => import('./pages/Analytics.tsx') },
    { path: 'reports', lazy: () => import('./pages/Reports.tsx') },
  ],
};

export default dashboardRoutes;
