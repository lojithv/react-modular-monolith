import { useLoaderData, Link } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import type { User } from '../types.ts';
import { userService } from '../services/user.service.ts';

/** Route loader — fetches a single user via the service layer */
export async function loader({ params }: LoaderFunctionArgs) {
  const user = await userService.getById(params.userId!);
  return { user };
}

export function Component() {
  const { user } = useLoaderData<typeof loader>();
  const u = user as User;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xl">
            {u.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{u.name}</h2>
            <p className="text-sm text-gray-500">{u.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/users/${u.id}/settings`} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
            User Settings
          </Link>
          <Link to="/users" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">
            Back to List
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div><p className="text-gray-500">Role</p><p className="font-medium text-gray-800">{u.role}</p></div>
        <div><p className="text-gray-500">Status</p><p className={`font-medium ${u.status === 'Active' ? 'text-green-600' : 'text-gray-500'}`}>{u.status}</p></div>
        <div><p className="text-gray-500">Joined</p><p className="font-medium text-gray-800">{u.joinedAt ?? 'N/A'}</p></div>
        <div><p className="text-gray-500">Last Login</p><p className="font-medium text-gray-800">{u.lastLoginAt ?? 'N/A'}</p></div>
      </div>
    </div>
  );
}
