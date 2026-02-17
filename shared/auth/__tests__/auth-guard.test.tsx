import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { authStore } from '../services/auth.service.ts';
import AuthGuard from '../guards/AuthGuard.tsx';
import { renderWithRouter, guardRoutes } from '../__testing__/render-with-router.tsx';
import { mockAdmin } from '../__testing__/mock-users.ts';

describe('AuthGuard', () => {
  beforeEach(() => {
    authStore.reset();
  });

  it('redirects to /auth/login when unauthenticated', async () => {
    const routes = guardRoutes(<AuthGuard />);
    renderWithRouter(<AuthGuard />, { routes, initialEntries: ['/'] });

    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
  });

  it('renders child content when authenticated', async () => {
    authStore.login(mockAdmin);
    const routes = guardRoutes(<AuthGuard />);
    renderWithRouter(<AuthGuard />, { routes, initialEntries: ['/'] });

    await waitFor(() => {
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });
  });
});
