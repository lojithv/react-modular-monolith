import { apiClient } from '@shared/api/index.ts';
import type { PaginatedResponse } from '@shared/api/index.ts';
import type { Product, CreateProductInput, UpdateProductInput } from '../types.ts';

/**
 * Business logic layer for the Products module.
 *
 * All data fetching and mutations go through this service,
 * keeping page components free of API concerns.
 */
class ProductService {
  async list(params?: {
    page?: number;
    pageSize?: number;
    category?: string;
  }): Promise<PaginatedResponse<Product>> {
    return apiClient.get<PaginatedResponse<Product>>('/products', { params });
  }

  async getById(id: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}`);
  }

  async create(input: CreateProductInput): Promise<Product> {
    return apiClient.post<Product>('/products', input);
  }

  async update(id: string, input: UpdateProductInput): Promise<Product> {
    return apiClient.patch<Product>(`/products/${id}`, input);
  }

  async remove(id: string): Promise<void> {
    return apiClient.delete<void>(`/products/${id}`);
  }
}

export const productService = new ProductService();
