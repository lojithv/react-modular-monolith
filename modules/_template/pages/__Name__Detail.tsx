import { useLoaderData, Link } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import type { __Name__ } from '../types.ts';
import { __name__Service } from '../services/__name__.service.ts';

/** Route loader — fetches a single item via the service layer */
export async function loader({ params }: LoaderFunctionArgs) {
  const item = await __name__Service.getById(params.__name__Id!);
  return { item };
}

export function Component() {
  const { item } = useLoaderData<typeof loader>();
  const data = item as __Name__;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">{data.name}</h2>
        <div className="flex gap-2">
          <Link
            to={`/__name__/${data.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Edit
          </Link>
          <Link
            to="/__name__"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
          >
            Back to List
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">ID</p>
          <p className="font-medium text-gray-800">{data.id}</p>
        </div>
        <div>
          <p className="text-gray-500">Name</p>
          <p className="font-medium text-gray-800">{data.name}</p>
        </div>
        {/* Add more fields here */}
      </div>
    </div>
  );
}
