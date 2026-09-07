// Layer B - Playwright smoke tests against the real, already-built
// legal.html: the hr/en split via ?lang=, stored preference, and the
// toggle buttons. Both language blocks exist in the DOM at once (one is
// [hidden]) so every assertion is scoped to the visible h1 specifically.
import { test, expect } from '@playwright/test';

const visibleHeading = (page) => page.locator('[data-lang-block]:not([hidden]) h1');

test('defaults to hr with no query param and nothing stored', async ({ page }) => {
  await page.goto('/legal.html');
  await expect(visibleHeading(page)).toHaveText('Pravne napomene');
  await expect(page.locator('[data-lang-block="en"]')).toBeHidden();
});

test('?lang=hr shows Croatian', async ({ page }) => {
  await page.goto('/legal.html?lang=hr');
  await expect(visibleHeading(page)).toHaveText('Pravne napomene');
});

test('?lang=en (or any non-hr value) shows English', async ({ page }) => {
  await page.goto('/legal.html?lang=en');
  await expect(visibleHeading(page)).toHaveText('Legal notices');
  await expect(page.locator('[data-lang-block="hr"]')).toBeHidden();
});

test('a stored pw-lang preference is honoured when there is no query param', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('pw-lang', 'de'));
  await page.goto('/legal.html');
  await expect(visibleHeading(page)).toHaveText('Legal notices');
});

test('the toggle buttons switch the visible language', async ({ page }) => {
  await page.goto('/legal.html?lang=hr');
  await expect(visibleHeading(page)).toHaveText('Pravne napomene');

  await page.locator('.lang-toggle button[data-lang="en"]').click();
  await expect(visibleHeading(page)).toHaveText('Legal notices');
  await expect(page.locator('.lang-toggle button[data-lang="en"]')).toHaveAttribute('aria-pressed', 'true');

  await page.locator('.lang-toggle button[data-lang="hr"]').click();
  await expect(visibleHeading(page)).toHaveText('Pravne napomene');
});
