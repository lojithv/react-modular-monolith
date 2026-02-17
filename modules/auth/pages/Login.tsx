import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '@shared/auth/index.ts';
import type { AuthUser } from '@shared/auth/index.ts';

/**
 * Demo user accounts for development.
 * In production, replace with real API authentication.
 */
const DEMO_ACCOUNTS: { label: string; email: string; user: AuthUser }[] = [
  {
    label: 'Admin (Pro)',
    email: 'alice@example.com',
    user: {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'admin',
      subscription: { plan: 'pro', trialEndsAt: null },
      features: ['analytics', 'bulk-export', 'api-access'],
    },
  },
  {
    label: 'Editor (Starter)',
    email: 'bob@example.com',
    user: {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      role: 'editor',
      subscription: { plan: 'starter', trialEndsAt: null },
      features: ['analytics'],
    },
  },
  {
    label: 'Viewer (Free)',
    email: 'charlie@example.com',
    user: {
      id: '3',
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      role: 'viewer',
      subscription: { plan: 'free', trialEndsAt: null },
      features: [],
    },
  },
];

export function Component() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  function handleLogin(user: AuthUser) {
    login(user);
    navigate(redirectTo, { replace: true });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const account = DEMO_ACCOUNTS.find((a) => a.email === email);
    if (!account) {
      setError('Unknown email. Try one of the demo accounts below.');
      return;
    }

    if (!password) {
      setError('Enter any password (validation is mocked).');
      return;
    }

    handleLogin(account.user);
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-600">
            <input type="checkbox" className="rounded" />
            Remember me
          </label>
          <Link to="/auth/forgot-password" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Sign In
        </button>
      </form>

      {/* Dev quick-login buttons */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center mb-3">Quick login (dev only)</p>
        <div className="flex flex-col gap-2">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.user.id}
              type="button"
              onClick={() => handleLogin(account.user)}
              className="w-full py-2 px-3 text-sm text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition flex items-center justify-between"
            >
              <span className="font-medium text-gray-700">{account.label}</span>
              <span className="text-xs text-gray-400">{account.email}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-blue-600 font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
