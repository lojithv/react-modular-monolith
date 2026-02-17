import { render, type RenderOptions } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import type { ReactElement } from 'react';
import type { RouteObject } from 'react-router';

interface RenderWithRouterOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Route objects for the test router. Defaults to a single route rendering the element. */
  routes?: RouteObject[];
  /** Initial URL entries for MemoryRouter. Defaults to ['/'] */
  initialEntries?: string[];
}

/**
 * Renders a component inside a data-router (createMemoryRouter + RouterProvider).
 * Useful for testing route guards that depend on <Outlet />, <Navigate />, useLocation, etc.
 */
export function renderWithRouter(
  ui: ReactElement,
  options: RenderWithRouterOptions = {},
) {
  const {
    routes,
    initialEntries = ['/'],
    ...renderOptions
  } = options;

  const routeObjects: RouteObject[] = routes ?? [
    {
      path: '/',
      element: ui,
      children: [
        { index: true, element: <div data-testid="child-content">Protected Content</div> },
      ],
    },
  ];

  const router = createMemoryRouter(routeObjects, { initialEntries });

  const utils = render(<RouterProvider router={router} />, renderOptions);

  return { ...utils, router };
}

/**
 * Creates route objects for testing a guard component.
 * The guard is rendered as a pathless layout route with a child that displays test content.
 */
export function guardRoutes(guardElement: ReactElement, path = '/'): RouteObject[] {
  return [
    {
      path,
      element: guardElement,
      children: [
        { index: true, element: <div data-testid="child-content">Protected Content</div> },
      ],
    },
    {
      path: '/auth/login',
      element: <div data-testid="login-page">Login Page</div>,
    },
  ];
}
