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
      // the mobile layout is different enough (off-canvas sidebar, hidden
      // table header, ...) that reusing these specs at a mobile viewport
      // would fail for the wrong reasons (e.g. clicking a nav link that's
      // off-canvas until the hamburger opens it) - mobile.spec.js is its
      // own project below instead.
      testIgnore: 'mobile.spec.js',
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
    {
      name: 'mobile-chromium',
      // real mobile viewport/touch emulation, still on Chromium so it can
      // share the sandbox's pre-installed browser binary - see
      // mobile.spec.js for what's specifically mobile about these tests
      // (@media (max-width: 767px) in docs/index.html).
      testMatch: 'mobile.spec.js',
      use: {
        ...devices['Pixel 7'],
        launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
      },
    },
  ],
});
