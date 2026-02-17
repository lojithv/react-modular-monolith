import { apiClient } from '@shared/api/index.ts';
import type { PaginatedResponse } from '@shared/api/index.ts';
import type { __Name__, Create__Name__Input, Update__Name__Input } from '../types.ts';

/**
 * Business logic layer for the __Name__ module.
 *
 * All data fetching and mutations go through this service,
 * keeping page components free of API concerns.
 */
class __Name__Service {
  async list(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<__Name__>> {
    return apiClient.get<PaginatedResponse<__Name__>>('/__name__s', { params });
  }

  async getById(id: string): Promise<__Name__> {
    return apiClient.get<__Name__>(`/__name__s/${id}`);
  }

  async create(input: Create__Name__Input): Promise<__Name__> {
    return apiClient.post<__Name__>('/__name__s', input);
  }

  async update(id: string, input: Update__Name__Input): Promise<__Name__> {
    return apiClient.patch<__Name__>(`/__name__s/${id}`, input);
  }

  async remove(id: string): Promise<void> {
    return apiClient.delete<void>(`/__name__s/${id}`);
  }
}

export const __name__Service = new __Name__Service();
