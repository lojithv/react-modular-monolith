export function Component() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Analytics Overview</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-gray-400">Chart placeholder — integrate your charting library here</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-700 mb-2">Traffic Sources</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex justify-between"><span>Organic Search</span><span className="font-medium">45%</span></li>
            <li className="flex justify-between"><span>Direct</span><span className="font-medium">30%</span></li>
            <li className="flex justify-between"><span>Referral</span><span className="font-medium">15%</span></li>
            <li className="flex justify-between"><span>Social</span><span className="font-medium">10%</span></li>
          </ul>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-700 mb-2">Top Pages</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex justify-between"><span>/products</span><span className="font-medium">1,234 views</span></li>
            <li className="flex justify-between"><span>/dashboard</span><span className="font-medium">987 views</span></li>
            <li className="flex justify-between"><span>/users</span><span className="font-medium">654 views</span></li>
            <li className="flex justify-between"><span>/settings</span><span className="font-medium">321 views</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
