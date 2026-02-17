import { Link, useLoaderData } from 'react-router';
import type { DashboardStat } from '../types.ts';
import { dashboardService } from '../services/dashboard.service.ts';

/** Route loader — fetches dashboard stats via the service layer */
export async function loader() {
  const data = await dashboardService.getStats();
  return { stats: data.stats };
}

export function Component() {
  const { stats } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat: DashboardStat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            <p className={`text-sm mt-1 ${stat.positive ? 'text-green-600' : 'text-red-500'}`}>
              {stat.change} from last month
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex gap-3">
          <Link to="/products/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
            Add Product
          </Link>
          <Link to="/users" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">
            View Users
          </Link>
          <Link to="/dashboard/reports" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">
            View Reports
          </Link>
        </div>
      </div>
    </div>
  );
}
