import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { authStore } from '../services/auth.service.ts';
import SubscriptionGuard from '../guards/SubscriptionGuard.tsx';
import { renderWithRouter, guardRoutes } from '../__testing__/render-with-router.tsx';
import { mockAdmin, mockEditor, mockViewer } from '../__testing__/mock-users.ts';

describe('SubscriptionGuard', () => {
  beforeEach(() => {
    authStore.reset();
  });

  it('renders child content when plan is sufficient', async () => {
    authStore.login(mockAdmin); // pro plan
    const routes = guardRoutes(<SubscriptionGuard minPlan="starter" />);
    renderWithRouter(<SubscriptionGuard minPlan="starter" />, { routes, initialEntries: ['/'] });

    await waitFor(() => {
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });
  });

  it('renders Paywall when plan is insufficient', async () => {
    authStore.login(mockViewer); // free plan
    const routes = guardRoutes(<SubscriptionGuard minPlan="pro" />);
    renderWithRouter(<SubscriptionGuard minPlan="pro" />, { routes, initialEntries: ['/'] });

    await waitFor(() => {
      expect(screen.getByText('Upgrade Required')).toBeInTheDocument();
      expect(screen.getByText('Pro')).toBeInTheDocument();
    });
  });

  it('passes for exact plan match', async () => {
    authStore.login(mockEditor); // starter plan
    const routes = guardRoutes(<SubscriptionGuard minPlan="starter" />);
    renderWithRouter(<SubscriptionGuard minPlan="starter" />, { routes, initialEntries: ['/'] });

    await waitFor(() => {
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });
  });

  it('blocks starter user from pro-required route', async () => {
    authStore.login(mockEditor); // starter plan
    const routes = guardRoutes(<SubscriptionGuard minPlan="pro" />);
    renderWithRouter(<SubscriptionGuard minPlan="pro" />, { routes, initialEntries: ['/'] });

    await waitFor(() => {
      expect(screen.getByText('Upgrade Required')).toBeInTheDocument();
    });
  });

  it('displays the correct required plan label', async () => {
    authStore.login(mockViewer); // free plan
    const routes = guardRoutes(<SubscriptionGuard minPlan="enterprise" />);
    renderWithRouter(<SubscriptionGuard minPlan="enterprise" />, { routes, initialEntries: ['/'] });

    await waitFor(() => {
      expect(screen.getByText('Enterprise')).toBeInTheDocument();
    });
  });
});
