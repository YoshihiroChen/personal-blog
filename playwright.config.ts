import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  workers: 1,
  timeout: 300000,
  expect: { timeout: 30000 },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3100',
    headless: true,
    // Prefer the local browser's normal graphics path. Software rendering is opt-in.
    ...(process.env.UNIVERSE_SOFTWARE_RENDERING === '1' ? {
      launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] },
    } : {}),
    viewport: { width: 1440, height: 1000 },
  },
  reporter: 'list',
});
