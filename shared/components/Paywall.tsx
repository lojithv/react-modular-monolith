import { Link } from 'react-router';
import type { PlanTier } from '@shared/auth/index.ts';

interface PaywallProps {
  requiredPlan: PlanTier;
}

const planLabels: Record<PlanTier, string> = {
  free: 'Free',
  starter: 'Starter',
  pro: 'Pro',
  enterprise: 'Enterprise',
};

export default function Paywall({ requiredPlan }: PaywallProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
        <span className="text-2xl">⭐</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-800">Upgrade Required</h1>
      <p className="mt-2 text-sm text-gray-500 text-center max-w-md">
        This feature requires the{' '}
        <span className="font-semibold text-amber-600">{planLabels[requiredPlan]}</span>{' '}
        plan or higher.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          to="/settings"
          className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition font-medium"
        >
          View Plans
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
