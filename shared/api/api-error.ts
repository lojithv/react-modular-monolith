/**
 * Typed error for failed API requests.
 * Provides structured access to HTTP status, error code, and
 * field-level validation details.
 */
export class ApiError extends Error {
  override name = 'ApiError';

  constructor(
    /** HTTP status code (e.g. 400, 401, 404, 500) */
    public status: number,
    /** Human-readable error message */
    message: string,
    /** Machine-readable error code from the backend (e.g. "VALIDATION_FAILED") */
    public code?: string,
    /** Field-level validation errors: { fieldName: ["error1", "error2"] } */
    public details?: Record<string, string[]>,
  ) {
    super(message);
  }

  /** True for 401 responses — trigger logout / re-auth */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  /** True for 403 responses — user lacks permission */
  get isForbidden(): boolean {
    return this.status === 403;
  }

  /** True for 404 responses */
  get isNotFound(): boolean {
    return this.status === 404;
  }

  /** True for 422 responses with field-level details */
  get isValidation(): boolean {
    return this.status === 422 && !!this.details;
  }
}
