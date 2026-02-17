import { Link } from 'react-router';

export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <h1 className="text-7xl font-extrabold text-gray-300">403</h1>
      <p className="mt-4 text-xl text-gray-500">Access denied</p>
      <p className="mt-2 text-sm text-gray-400">You don't have permission to view this page.</p>
      <Link
        to="/dashboard"
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
