import { Link } from 'react-router';

export default function TrialExpired() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <span className="text-2xl">⏰</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-800">Trial Expired</h1>
      <p className="mt-2 text-sm text-gray-500 text-center max-w-md">
        Your free trial has ended. Upgrade to a paid plan to continue using this feature.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          to="/settings"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Choose a Plan
        </Link>
        <Link
          to="/dashboard"
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
