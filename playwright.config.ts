import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://localhost:4080', trace: 'retain-on-failure', ...devices['Desktop Chrome'] },
  webServer: { command: 'npm run start', url: 'http://localhost:4080', reuseExistingServer: true, timeout: 120_000 },
});
