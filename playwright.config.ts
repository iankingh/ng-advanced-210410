import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4210',
    launchOptions: process.env.CHROME_BIN ? { executablePath: process.env.CHROME_BIN } : {},
  },
  webServer: {
    command: 'npx ng serve --host 127.0.0.1 --port 4210',
    url: 'http://127.0.0.1:4210',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
