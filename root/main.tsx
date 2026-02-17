import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import './index.css'
import router from './routes.tsx'
import { authStore } from '@shared/auth/index.ts'

// ─── Mock API Registration ──────────────────────────────
// When VITE_API_MOCK=true, register per-module mock handlers
// so the app works without a backend. Each module owns its mock data.
if (import.meta.env.VITE_API_MOCK === 'true') {
  const { registerProductMocks } = await import('@modules/products/services/__mocks__/products.mock.ts');
  const { registerUserMocks } = await import('@modules/users/services/__mocks__/users.mock.ts');
  const { registerDashboardMocks } = await import('@modules/dashboard/services/__mocks__/dashboard.mock.ts');

  registerProductMocks();
  registerUserMocks();
  registerDashboardMocks();
}

/**
 * Auto-login for development convenience.
 * Set VITE_AUTO_LOGIN=true in a .env.local file to skip the login screen.
 */
if (import.meta.env.VITE_AUTO_LOGIN === 'true') {
  authStore.loginAsMock();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
