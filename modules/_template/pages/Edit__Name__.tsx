import { useState } from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import type { __Name__ } from '../types.ts';
import { __name__Service } from '../services/__name__.service.ts';

/** Route loader — fetches the item to edit via the service layer */
export async function loader({ params }: LoaderFunctionArgs) {
  const item = await __name__Service.getById(params.__name__Id!);
  return { item };
}

export function Component() {
  const { item } = useLoaderData<typeof loader>();
  const data = item as __Name__;
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    try {
      await __name__Service.update(data.id, {
        name: form.get('name') as string,
        // Map additional form fields here
      });
      navigate(`/__name__/${data.id}`);
    } catch {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Edit {data.name}</h2>
      <form className="space-y-4 max-w-lg" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            name="name"
            type="text"
            defaultValue={data.name}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        {/* Add more form fields here */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            to={`/__name__/${data.id}`}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
