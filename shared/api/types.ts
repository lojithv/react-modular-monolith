// ─── Request Options ────────────────────────────────────

export interface RequestOptions {
  /** Query parameters appended to the URL */
  params?: Record<string, string | number | boolean | undefined>;
  /** Extra headers merged with defaults */
  headers?: Record<string, string>;
  /** AbortSignal for cancellation */
  signal?: AbortSignal;
}

// ─── Response Wrappers ──────────────────────────────────

/** Standard envelope for single-item responses */
export interface ApiResponse<T> {
  data: T;
}

/** Standard envelope for paginated list responses */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ─── Interceptors ───────────────────────────────────────

export type RequestInterceptor = (
  url: string,
  init: RequestInit,
) => RequestInit | Promise<RequestInit>;

export type ResponseInterceptor = (
  response: Response,
) => Response | Promise<Response>;
