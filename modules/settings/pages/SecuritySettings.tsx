export function Component() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Security Settings</h2>
      <form className="space-y-5 max-w-lg" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Enter current password" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Enter new password" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Two-Factor Authentication</label>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" className="rounded" />
            Enable 2FA
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            <option>15 minutes</option>
            <option>30 minutes</option>
            <option>1 hour</option>
            <option>4 hours</option>
          </select>
        </div>
        <div className="pt-2">
          <button type="submit" className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition">Update Security</button>
        </div>
      </form>
    </div>
  );
}
