import { defineConfig, mergeConfig } from 'vitest/config';
import { sharedConfig } from '../../vitest.shared.ts';

export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      name: '__name__',
      include: ['**/__tests__/**/*.test.{ts,tsx}'],
      root: __dirname,
    },
  }),
);
