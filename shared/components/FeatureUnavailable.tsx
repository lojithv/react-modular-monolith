import { Link } from 'react-router';
import type { FeatureFlag } from '@shared/auth/index.ts';

interface FeatureUnavailableProps {
  features: FeatureFlag[];
}

export default function FeatureUnavailable({ features }: FeatureUnavailableProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <span className="text-2xl">🔒</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-800">Feature Not Available</h1>
      <p className="mt-2 text-sm text-gray-500 text-center max-w-md">
        This section requires the following feature{features.length > 1 ? 's' : ''}:{' '}
        {features.map((f) => (
          <span key={f} className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-mono mx-0.5">
            {f}
          </span>
        ))}
      </p>
      <p className="mt-1 text-sm text-gray-400">Contact your administrator to enable access.</p>
      <Link
        to="/dashboard"
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
