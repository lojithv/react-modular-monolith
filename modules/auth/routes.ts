import type { RouteObject } from 'react-router';

const authRoutes: RouteObject = {
  path: 'auth',
  lazy: () => import('./layout.tsx'),
  children: [
    { index: true, lazy: () => import('./pages/Login.tsx') },
    { path: 'login', lazy: () => import('./pages/Login.tsx') },
    { path: 'register', lazy: () => import('./pages/Register.tsx') },
    { path: 'forgot-password', lazy: () => import('./pages/ForgotPassword.tsx') },
    { path: 'reset-password/:token', lazy: () => import('./pages/ResetPassword.tsx') },
  ],
};

export default authRoutes;
