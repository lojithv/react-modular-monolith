import { useParams, Link } from 'react-router';

export function Component() {
  const { userId } = useParams();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Settings for User #{userId}</h2>
        <Link to={`/users/${userId}`} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">
          Back to Profile
        </Link>
      </div>
      <form className="space-y-4 max-w-lg" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
          <input type="text" defaultValue={`User ${userId}`} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Notifications</label>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" defaultChecked className="rounded" />
            Receive email notifications
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select defaultValue="Admin" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            <option>Admin</option>
            <option>Editor</option>
            <option>Viewer</option>
          </select>
        </div>
        <div className="pt-2">
          <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition">Save Settings</button>
        </div>
      </form>
    </div>
  );
}
