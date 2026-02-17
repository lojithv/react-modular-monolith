export function Component() {
  const reports = [
    { id: 1, name: 'Monthly Revenue Report', date: '2026-02-01', status: 'Completed' },
    { id: 2, name: 'User Growth Analysis', date: '2026-02-10', status: 'Completed' },
    { id: 3, name: 'Product Performance Q1', date: '2026-02-15', status: 'In Progress' },
    { id: 4, name: 'Customer Satisfaction Survey', date: '2026-02-17', status: 'Pending' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Reports</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {reports.map((report) => (
          <div key={report.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition">
            <div>
              <p className="font-medium text-gray-800">{report.name}</p>
              <p className="text-sm text-gray-500">{report.date}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                report.status === 'Completed'
                  ? 'bg-green-100 text-green-700'
                  : report.status === 'In Progress'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
              }`}
            >
              {report.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
