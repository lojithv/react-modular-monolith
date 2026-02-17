export function Component() {
  const channels = [
    { id: 'email', label: 'Email Notifications', description: 'Receive updates via email', checked: true },
    { id: 'push', label: 'Push Notifications', description: 'Browser push notifications', checked: false },
    { id: 'sms', label: 'SMS Notifications', description: 'Text message alerts', checked: false },
    { id: 'slack', label: 'Slack Integration', description: 'Notifications to your Slack channel', checked: true },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Notification Preferences</h2>
      <div className="space-y-4 max-w-lg">
        {channels.map((channel) => (
          <div key={channel.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-800 text-sm">{channel.label}</p>
              <p className="text-xs text-gray-500">{channel.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={channel.checked} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>
        ))}
        <div className="pt-2">
          <button type="button" className="px-6 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 transition">Save Preferences</button>
        </div>
      </div>
    </div>
  );
}
