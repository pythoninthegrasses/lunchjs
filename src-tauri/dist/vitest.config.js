import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['__tests__/**/*.{test,spec}.js'],
    exclude: ['tests/**', 'node_modules/**'],
    globals: true,
    silent: true,
    reporters: ['dot'],
    setupFiles: ['__tests__/setup-tauri-mocks.js'],
    coverage: {
      provider: 'v8',
      include: ['js/app.js'],
      exclude: ['**/*.min.js', 'js/basecoat/**', 'js/alpine.min.js'],
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      thresholds: {
        global: {
          statements: 50,
          branches: 50,
          functions: 50,
          lines: 50,
        },
      },
    },
  },
});
