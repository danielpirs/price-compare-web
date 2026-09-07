import { defineConfig, devices } from '@playwright/test';

// Layer B - Playwright smoke tests, opening the real, already-built
// index.html/legal.html served exactly as GitHub Pages would (plain static
// files, no dev-server magic) - see test/e2e/*.spec.js and price-compare's
// README ("The frontend test suite" in Findings) for the full rationale.
export default defineConfig({
  testDir: './test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node test/e2e/static-server.js',
    url: 'http://localhost:4173/index.html',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // this sandbox pre-installs a full Chromium (not the newer
        // headless-shell build @playwright/test's exact version expects) at
        // a stable path - point at it directly rather than downloading.
        // In CI, PW_CHROMIUM_PATH is unset and Playwright uses its own
        // `npx playwright install --with-deps chromium` download instead.
        launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
      },
    },
  ],
});
