import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { authStore } from '../services/auth.service.ts';
import TrialGuard from '../guards/TrialGuard.tsx';
import { renderWithRouter, guardRoutes } from '../__testing__/render-with-router.tsx';
import {
  mockAdmin,
  mockViewer,
  mockActiveTrial,
  mockExpiredTrial,
} from '../__testing__/mock-users.ts';

describe('TrialGuard', () => {
  beforeEach(() => {
    authStore.reset();
  });

  it('renders child content when user has an active trial', async () => {
    authStore.login(mockActiveTrial); // free plan, trial in future
    const routes = guardRoutes(<TrialGuard />);
    renderWithRouter(<TrialGuard />, { routes, initialEntries: ['/'] });

    await waitFor(() => {
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });
  });

  it('renders TrialExpired when trial has expired and user is on free plan', async () => {
    authStore.login(mockExpiredTrial); // free plan, trial in past
    const routes = guardRoutes(<TrialGuard />);
    renderWithRouter(<TrialGuard />, { routes, initialEntries: ['/'] });

    await waitFor(() => {
      expect(screen.getByText('Trial Expired')).toBeInTheDocument();
    });
  });

  it('renders child content when user is on a paid plan (no trial needed)', async () => {
    authStore.login(mockAdmin); // pro plan, no trial
    const routes = guardRoutes(<TrialGuard />);
    renderWithRouter(<TrialGuard />, { routes, initialEntries: ['/'] });

    await waitFor(() => {
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });
  });

  it('renders TrialExpired for free user with no trial at all', async () => {
    authStore.login(mockViewer); // free plan, trialEndsAt: null
    const routes = guardRoutes(<TrialGuard />);
    renderWithRouter(<TrialGuard />, { routes, initialEntries: ['/'] });

    await waitFor(() => {
      expect(screen.getByText('Trial Expired')).toBeInTheDocument();
    });
  });
});
