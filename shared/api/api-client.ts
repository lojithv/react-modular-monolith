import { authStore } from '@shared/auth/index.ts';
import { ApiError } from './api-error.ts';
import { findMock } from './mock-adapter.ts';
import type { RequestOptions, RequestInterceptor, ResponseInterceptor } from './types.ts';

/**
 * Framework-agnostic HTTP client.
 *
 * - Wraps `fetch` with typed convenience methods (get, post, put, patch, delete)
 * - Injects Authorization header from the auth store automatically
 * - Normalizes errors into `ApiError` instances
 * - Supports request/response interceptors for cross-cutting concerns
 * - In mock mode (VITE_API_MOCK=true), short-circuits to registered mock handlers
 * - Singleton via globalThis for microfrontend compatibility
 */
export class ApiClient {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor(private baseUrl: string) {}

  // ─── Interceptors ───────────────────────────────────────

  onRequest(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  onResponse(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  // ─── Public HTTP Methods ────────────────────────────────

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, body, options);
  }

  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', path, body, options);
  }

  async patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', path, body, options);
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options);
  }

  // ─── Core Request Pipeline ──────────────────────────────

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params);

    // Check for mock handler first
    const mockHandler = findMock(path, method);
    if (mockHandler) {
      const mockResult = await mockHandler(url, { method });
      return mockResult as T;
    }

    // Build request init
    let init: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...this.authHeader(),
        ...options?.headers,
      },
      signal: options?.signal,
    };

    if (body !== undefined) {
      init.body = JSON.stringify(body);
    }

    // Apply request interceptors
    for (const interceptor of this.requestInterceptors) {
      init = await interceptor(url, init);
    }

    // Execute fetch
    let response = await fetch(url, init);

    // Apply response interceptors
    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response);
    }

    // Handle errors
    if (!response.ok) {
      throw await this.buildError(response);
    }

    // 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  // ─── Helpers ────────────────────────────────────────────

  private buildUrl(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): string {
    const url = new URL(path, this.baseUrl);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return url.toString();
  }

  private authHeader(): Record<string, string> {
    const { user } = authStore.getSnapshot();
    if (!user) return {};
    // In a real app, this would be a JWT token. For now we send the user ID
    // so loaders/services can identify the caller.
    return { Authorization: `Bearer mock-token-${user.id}` };
  }

  private async buildError(response: Response): Promise<ApiError> {
    let message = response.statusText || 'Request failed';
    let code: string | undefined;
    let details: Record<string, string[]> | undefined;

    try {
      const body = await response.json();
      if (body.message) message = body.message;
      if (body.code) code = body.code;
      if (body.details) details = body.details;
    } catch {
      // Response body is not JSON — use statusText
    }

    return new ApiError(response.status, message, code, details);
  }
}

// ─── Singleton ──────────────────────────────────────────

const API_CLIENT_KEY = '__API_CLIENT__';
const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api';

function getOrCreateApiClient(): ApiClient {
  const g = globalThis as Record<string, unknown>;
  if (!g[API_CLIENT_KEY]) {
    g[API_CLIENT_KEY] = new ApiClient(DEFAULT_BASE_URL);
  }
  return g[API_CLIENT_KEY] as ApiClient;
}

export const apiClient = getOrCreateApiClient();
