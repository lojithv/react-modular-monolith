import { Link, useParams } from 'react-router';

export function Component() {
  const { token } = useParams();

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Set new password</h1>
        <p className="text-sm text-gray-500 mt-1">
          Token: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{token}</code>
        </p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Reset Password
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        <Link to="/auth/login" className="text-blue-600 font-medium hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
