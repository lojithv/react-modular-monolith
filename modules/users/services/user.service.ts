import { apiClient } from '@shared/api/index.ts';
import type { PaginatedResponse } from '@shared/api/index.ts';
import type { User } from '../types.ts';

/**
 * Business logic layer for the Users module.
 *
 * All data fetching and mutations go through this service,
 * keeping page components free of API concerns.
 */
class UserService {
  async list(params?: {
    page?: number;
    pageSize?: number;
    role?: string;
    status?: string;
  }): Promise<PaginatedResponse<User>> {
    return apiClient.get<PaginatedResponse<User>>('/users', { params });
  }

  async getById(id: string): Promise<User> {
    return apiClient.get<User>(`/users/${id}`);
  }
}

export const userService = new UserService();
