import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import { authStore } from '../services/auth.service.ts';
import AuthGuard from '../guards/AuthGuard.tsx';
import { renderWithRouter, guardRoutes } from '../__testing__/render-with-router.tsx';
import { mockAdmin } from '../__testing__/mock-users.ts';

describe('Logout flow', () => {
  beforeEach(() => {
    authStore.reset();
  });

  it('clears auth state on logout', () => {
    authStore.login(mockAdmin);
    expect(authStore.getSnapshot().isAuthenticated).toBe(true);

    authStore.logout();
    expect(authStore.getSnapshot().isAuthenticated).toBe(false);
    expect(authStore.getSnapshot().user).toBeNull();
  });

  it('redirects to login page when logout happens while on protected route', async () => {
    authStore.login(mockAdmin);
    const routes = guardRoutes(<AuthGuard />);
    renderWithRouter(<AuthGuard />, { routes, initialEntries: ['/'] });

    await waitFor(() => {
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    act(() => {
      authStore.logout();
    });

    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
  });

  it('role checks return false after logout', () => {
    authStore.login(mockAdmin);
    expect(authStore.hasRole('admin')).toBe(true);

    authStore.logout();
    expect(authStore.hasRole('admin')).toBe(false);
  });

  it('feature checks return false after logout', () => {
    authStore.login(mockAdmin);
    expect(authStore.hasFeature('analytics')).toBe(true);

    authStore.logout();
    expect(authStore.hasFeature('analytics')).toBe(false);
  });

  it('plan checks return false after logout', () => {
    authStore.login(mockAdmin);
    expect(authStore.hasPlan('free')).toBe(true);

    authStore.logout();
    expect(authStore.hasPlan('free')).toBe(false);
  });

  it('trial checks return false after logout', () => {
    authStore.login(mockAdmin);
    authStore.logout();
    expect(authStore.isTrialActive()).toBe(false);
  });
});
