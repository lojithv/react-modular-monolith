import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { authStore } from '../services/auth.service.ts';
import RoleGuard from '../guards/RoleGuard.tsx';
import { renderWithRouter, guardRoutes } from '../__testing__/render-with-router.tsx';
import { mockAdmin, mockEditor, mockViewer } from '../__testing__/mock-users.ts';

describe('RoleGuard', () => {
  beforeEach(() => {
    authStore.reset();
  });

  it('renders child content when user has the required role', async () => {
    authStore.login(mockAdmin);
    const routes = guardRoutes(<RoleGuard roles={['admin']} />);
    renderWithRouter(<RoleGuard roles={['admin']} />, { routes, initialEntries: ['/'] });

    await waitFor(() => {
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });
  });

  it('renders Forbidden when user lacks the required role', async () => {
    authStore.login(mockViewer);
    const routes = guardRoutes(<RoleGuard roles={['admin']} />);
    renderWithRouter(<RoleGuard roles={['admin']} />, { routes, initialEntries: ['/'] });

    await waitFor(() => {
      expect(screen.getByText('403')).toBeInTheDocument();
      expect(screen.getByText('Access denied')).toBeInTheDocument();
    });
  });

  it('allows access when user role is in the allowed list', async () => {
    authStore.login(mockEditor);
    const routes = guardRoutes(<RoleGuard roles={['admin', 'editor']} />);
    renderWithRouter(<RoleGuard roles={['admin', 'editor']} />, { routes, initialEntries: ['/'] });

    await waitFor(() => {
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });
  });

  it('blocks viewer from admin+editor route', async () => {
    authStore.login(mockViewer);
    const routes = guardRoutes(<RoleGuard roles={['admin', 'editor']} />);
    renderWithRouter(<RoleGuard roles={['admin', 'editor']} />, { routes, initialEntries: ['/'] });

    await waitFor(() => {
      expect(screen.getByText('403')).toBeInTheDocument();
    });
  });
});
