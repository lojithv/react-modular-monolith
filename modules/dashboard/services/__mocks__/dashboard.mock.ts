import { registerMock } from '@shared/api/index.ts';
import type { DashboardData } from '../../types.ts';

const MOCK_DASHBOARD: DashboardData = {
  stats: [
    { label: 'Total Revenue', value: '$45,231', change: '+20.1%', positive: true },
    { label: 'Active Users', value: '2,350', change: '+15.3%', positive: true },
    { label: 'Products', value: '128', change: '+4.5%', positive: true },
    { label: 'Pending Orders', value: '23', change: '-2.1%', positive: false },
  ],
};

export function registerDashboardMocks(): void {
  registerMock('GET /dashboard/stats', () => MOCK_DASHBOARD);
}
