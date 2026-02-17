import { Link, useLoaderData } from 'react-router';
import type { __Name__ } from '../types.ts';
import { __name__Service } from '../services/__name__.service.ts';

/** Route loader — fetches the list via the service layer */
export async function loader() {
  const result = await __name__Service.list();
  return { items: result.data };
}

export function Component() {
  const { items } = useLoaderData<typeof loader>();

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">All __Name__s</h2>
        <Link
          to="/__name__/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
        >
          + New __Name__
        </Link>
      </div>
      <div className="divide-y divide-gray-100">
        {items.map((item: __Name__) => (
          <Link
            key={item.id}
            to={`/__name__/${item.id}`}
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
          >
            <p className="font-medium text-gray-800">{item.name}</p>
            <span className="text-sm text-gray-400">View &rarr;</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
