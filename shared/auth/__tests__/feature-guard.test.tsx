import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { authStore } from '../services/auth.service.ts';
import FeatureGuard from '../guards/FeatureGuard.tsx';
import { renderWithRouter, guardRoutes } from '../__testing__/render-with-router.tsx';
import { mockAdmin, mockViewer } from '../__testing__/mock-users.ts';

describe('FeatureGuard', () => {
  beforeEach(() => {
    authStore.reset();
  });

  it('renders child content when user has the required feature', async () => {
    authStore.login(mockAdmin); // has 'analytics'
    const routes = guardRoutes(<FeatureGuard features={['analytics']} />);
    renderWithRouter(<FeatureGuard features={['analytics']} />, { routes, initialEntries: ['/'] });

    await waitFor(() => {
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });
  });

  it('renders FeatureUnavailable when user lacks the feature', async () => {
    authStore.login(mockViewer); // has no features
    const routes = guardRoutes(<FeatureGuard features={['analytics']} />);
    renderWithRouter(<FeatureGuard features={['analytics']} />, { routes, initialEntries: ['/'] });

    await waitFor(() => {
      expect(screen.getByText('Feature Not Available')).toBeInTheDocument();
    });
  });

  it('requires ALL features (AND logic)', async () => {
    authStore.login(mockAdmin); // has analytics, bulk-export, api-access
    const routes = guardRoutes(<FeatureGuard features={['analytics', 'nonexistent']} />);
    renderWithRouter(<FeatureGuard features={['analytics', 'nonexistent']} />, {
      routes,
      initialEntries: ['/'],
    });

    await waitFor(() => {
      expect(screen.getByText('Feature Not Available')).toBeInTheDocument();
    });
  });

  it('passes when user has all required features', async () => {
    authStore.login(mockAdmin);
    const routes = guardRoutes(<FeatureGuard features={['analytics', 'bulk-export']} />);
    renderWithRouter(<FeatureGuard features={['analytics', 'bulk-export']} />, {
      routes,
      initialEntries: ['/'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });
  });
});
