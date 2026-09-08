// Layer B - Playwright smoke tests against the real, already-built
// index.html, run under the 'mobile-chromium' project (see
// playwright.config.js) at a phone-sized viewport with touch emulation.
//
// These are deliberately NOT the same assertions as home.spec.js run
// smaller: the @media (max-width: 767px) block in docs/index.html swaps in
// a different chrome entirely (off-canvas hamburger sidebar instead of an
// always-visible one, cards instead of a table with a header row), so what's
// worth testing here is that mobile-only chrome, not a re-check of content
// already covered by the desktop specs and by render.test.mjs.
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const basicFixture = JSON.parse(
  readFileSync(fileURLToPath(new URL('./fixtures/basic.json', import.meta.url)), 'utf-8')
);

async function gotoWithFixture(page, hash, fixture = basicFixture) {
  await page.route('**/data/*.json', (route) => route.fulfill({ json: fixture }));
  await page.goto('/index.html' + hash);
}

test('canary: the mobile breakpoint is actually in effect', async ({ page }) => {
  await gotoWithFixture(page, '#/HR/cheapest');
  // desktop-only chrome that the @media block turns off - if this fails,
  // the viewport isn't actually narrow and every other test here is moot.
  await expect(page.locator('.pw-hamburger')).toBeVisible();
  await expect(page.locator('.pw-lang-icon')).toBeHidden();
});

test('the sidebar starts closed and the hamburger opens it', async ({ page }) => {
  await gotoWithFixture(page, '#/HR/cheapest');
  const sidebar = page.locator('#sidebar');
  const backdrop = page.locator('#backdrop');
  const hamburger = page.locator('#hamburgerBtn');

  await expect(sidebar).not.toHaveClass(/pw-open/);
  await expect(backdrop).not.toHaveClass(/pw-open/);
  await expect(hamburger).toHaveAttribute('aria-expanded', 'false');

  await hamburger.click();
  await expect(sidebar).toHaveClass(/pw-open/);
  await expect(backdrop).toHaveClass(/pw-open/);
  await expect(hamburger).toHaveAttribute('aria-expanded', 'true');
});

test('clicking the backdrop closes the sidebar again', async ({ page }) => {
  await gotoWithFixture(page, '#/HR/cheapest');
  await page.locator('#hamburgerBtn').click();
  await expect(page.locator('#sidebar')).toHaveClass(/pw-open/);

  await page.locator('#backdrop').click();
  await expect(page.locator('#sidebar')).not.toHaveClass(/pw-open/);
  await expect(page.locator('#backdrop')).not.toHaveClass(/pw-open/);
  await expect(page.locator('#hamburgerBtn')).toHaveAttribute('aria-expanded', 'false');
});

test('picking a country/kind in the sidebar navigates and auto-closes it', async ({ page }) => {
  await gotoWithFixture(page, '#/HR/cheapest');
  await page.locator('#hamburgerBtn').click();

  await page.locator('#sidebar a[href="#/AT/most-expensive"]').click();

  await expect(page).toHaveURL(/#\/AT\/most-expensive$/);
  await expect(page.locator('#sidebar')).not.toHaveClass(/pw-open/);
  await expect(page.locator('#backdrop')).not.toHaveClass(/pw-open/);
});

test('the table header is hidden and rows render as cards with the data still legible', async ({ page }) => {
  await gotoWithFixture(page, '#/HR/cheapest');

  await expect(page.locator('.pw-table-header')).toBeHidden();

  const rows = page.locator('.pw-row');
  await expect(rows).toHaveCount(2);
  const niveaRow = rows.first();
  await expect(niveaRow).toContainText('Nivea krema u limenci');
  await expect(niveaRow).toContainText('NIVEA');
  // the per-country grid still carries every country's price, just reflowed
  await expect(niveaRow.locator('.pw-cell-country')).toHaveCount(5);
});
