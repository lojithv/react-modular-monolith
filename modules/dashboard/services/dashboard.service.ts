import { apiClient } from '@shared/api/index.ts';
import type { DashboardData } from '../types.ts';

/**
 * Business logic layer for the Dashboard module.
 *
 * Fetches aggregated stats and any other dashboard-specific data.
 */
class DashboardService {
  async getStats(): Promise<DashboardData> {
    return apiClient.get<DashboardData>('/dashboard/stats');
  }
}

export const dashboardService = new DashboardService();
