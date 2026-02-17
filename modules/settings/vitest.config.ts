import { defineConfig, mergeConfig } from 'vitest/config';
import { sharedConfig } from '../../vitest.shared.ts';

export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      name: 'settings',
      include: ['**/__tests__/**/*.test.{ts,tsx}'],
      root: __dirname,
    },
  }),
);
