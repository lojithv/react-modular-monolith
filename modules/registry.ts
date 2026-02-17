import type { ModuleManifest, SidebarItem } from '@shared/types/module-manifest.ts';

import { authModule } from './auth/index.ts';
import { dashboardModule } from './dashboard/index.ts';
import { productsModule } from './products/index.ts';
import { usersModule } from './users/index.ts';
import { settingsModule } from './settings/index.ts';

/**
 * Central module registry.
 *
 * To add a new module:
 * 1. Create the module folder with routes.ts, layout.tsx, pages/, index.ts
 * 2. Export a ModuleManifest from the module's index.ts
 * 3. Import and add it to this array
 *
 * The app shell (routes.tsx, RootLayout) reads this registry to compose
 * routing and navigation automatically.
 */
export const modules: ModuleManifest[] = [
  authModule,
  dashboardModule,
  productsModule,
  usersModule,
  settingsModule,
];

/** Public modules (no auth required, rendered outside the shell) */
export const publicModules = modules.filter((m) => m.public);

/** Authenticated modules (rendered inside the shell with guards) */
export const protectedModules = modules.filter((m) => !m.public);

/** Flattened sidebar items from all modules */
export const allSidebarItems: SidebarItem[] = modules.flatMap(
  (m) => m.sidebar ?? [],
);
