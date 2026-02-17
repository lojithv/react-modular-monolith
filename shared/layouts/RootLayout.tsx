import { Suspense } from 'react';
import { Outlet } from 'react-router';
import Sidebar from '@shared/components/Sidebar.tsx';
import { useAuth } from '@shared/auth/index.ts';
import { allSidebarItems } from '@modules/registry.ts';

/**
 * Sidebar links are read from the module registry.
 * Adding a new module with `sidebar` in its manifest
 * automatically makes it appear here.
 *
 * The static "UI Library" link is appended separately
 * since it's a dev utility, not a feature module.
 */
const sidebarLinks = [
  ...allSidebarItems,
  { to: '/ui', label: 'UI Library' },
];

export default function RootLayout() {
  const { user, hasRole, logout } = useAuth();

  const visibleLinks = sidebarLinks.filter(
    (link) => !link.roles || hasRole(link.roles),
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar
        links={visibleLinks}
        footer={
          user && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0">
                {user.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-700 truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.role}</p>
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 19 10Z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )
        }
      />

      <main className="flex-1 p-8 pt-16 md:pt-8 overflow-y-auto">
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}
