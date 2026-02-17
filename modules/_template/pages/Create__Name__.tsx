import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { __name__Service } from '../services/__name__.service.ts';

export function Component() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    try {
      const created = await __name__Service.create({
        name: form.get('name') as string,
        // Map additional form fields here
      });
      navigate(`/__name__/${created.id}`);
    } catch {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Create New __Name__</h2>
      <form className="space-y-4 max-w-lg" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            name="name"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Enter name"
          />
        </div>
        {/* Add more form fields here */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create __Name__'}
          </button>
          <Link
            to="/__name__"
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
