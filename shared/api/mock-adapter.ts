/**
 * Mock adapter for the API client.
 *
 * Modules register their own mock handlers at app startup.
 * When VITE_API_MOCK=true, the API client checks this registry
 * before hitting the network, enabling frontend development
 * without a running backend.
 *
 * Pattern format: "METHOD /path" (e.g. "GET /products", "POST /users")
 * Supports simple wildcards: "GET /products/:id" matches "GET /products/123"
 */

export type MockHandler = (
  url: string,
  init: RequestInit,
) => unknown | Promise<unknown>;

interface MockRoute {
  method: string;
  pathPattern: RegExp;
  handler: MockHandler;
}

const routes: MockRoute[] = [];
const enabled = import.meta.env.VITE_API_MOCK === 'true';

/**
 * Register a mock handler for a given HTTP method + path pattern.
 * @param pattern - e.g. "GET /products", "GET /products/:id", "POST /products"
 * @param handler - function that returns mock response data
 */
export function registerMock(pattern: string, handler: MockHandler): void {
  const spaceIdx = pattern.indexOf(' ');
  const method = pattern.slice(0, spaceIdx).toUpperCase();
  const pathTemplate = pattern.slice(spaceIdx + 1);

  // Convert :param placeholders to regex capture groups
  const regexStr = pathTemplate.replace(/:([^/]+)/g, '([^/]+)');
  const pathPattern = new RegExp(`^${regexStr}$`);

  routes.push({ method, pathPattern, handler });
}

/**
 * Find a registered mock handler matching the given path and method.
 * Returns undefined if mock mode is disabled or no handler matches.
 */
export function findMock(path: string, method: string): MockHandler | undefined {
  if (!enabled) return undefined;

  const upperMethod = method.toUpperCase();

  for (const route of routes) {
    if (route.method === upperMethod && route.pathPattern.test(path)) {
      return route.handler;
    }
  }

  return undefined;
}

/**
 * Clear all registered mocks. Useful in tests.
 */
export function clearMocks(): void {
  routes.length = 0;
}
