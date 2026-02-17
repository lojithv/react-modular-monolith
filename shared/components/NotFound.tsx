import { Link } from 'react-router';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <h1 className="text-7xl font-extrabold text-gray-300">404</h1>
      <p className="mt-4 text-xl text-gray-500">Page not found</p>
      <Link
        to="/"
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
