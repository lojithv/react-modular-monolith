import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import type { UserConfig } from 'vitest/config';

const root = __dirname;

/**
 * Shared Vitest configuration reused by all per-module configs.
 * Each module extends this and overrides `include` to scope tests.
 */
export const sharedConfig: UserConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      '@root': resolve(root, 'root'),
      '@modules': resolve(root, 'modules'),
      '@shared': resolve(root, 'shared'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [resolve(root, 'shared/auth/__testing__/setup.ts')],
  },
};
