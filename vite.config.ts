/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@root': resolve(__dirname, 'root'),
      '@modules': resolve(__dirname, 'modules'),
      '@shared': resolve(__dirname, 'shared'),
    },
  },
  test: {
    projects: [
      'modules/auth/vitest.config.ts',
      'modules/dashboard/vitest.config.ts',
      'modules/products/vitest.config.ts',
      'modules/users/vitest.config.ts',
      'modules/settings/vitest.config.ts',
      'shared/vitest.config.ts',
    ],
  },
})
