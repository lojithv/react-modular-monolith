import { Outlet, NavLink } from 'react-router';

/**
 * Module layout — wraps all pages in this module.
 *
 * Provides a module-level heading and sub-navigation.
 * The <Outlet /> renders the matched child route (list, detail, etc.).
 */

const navItems = [
  { to: '/__name__', label: 'All __Name__s', end: true },
  { to: '/__name__/new', label: 'Create __Name__' },
];

export function Component() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">__Name__s</h1>
        <nav className="flex gap-2">
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
      <Outlet />
    </div>
  );
}
