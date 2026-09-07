// Layer B - Playwright smoke tests against the real, already-built
// index.html, with data/*.json intercepted and served from a small
// synthetic fixture (see fixtures/basic.json) instead of the real,
// nightly-changing production data - see price-compare's README ("The
// frontend test suite" in Findings) for the full rationale.
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

test('renders per-country rows from the fixture JSON, ranked in file order', async ({ page }) => {
  await gotoWithFixture(page, '#/HR/cheapest');
  const rows = page.locator('.pw-row');
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(0)).toContainText('Nivea krema u limenci');
  await expect(rows.nth(0)).toContainText('NIVEA');
  await expect(rows.nth(1)).toContainText('always');
});

test('marks the cheapest and most expensive country per product', async ({ page }) => {
  await gotoWithFixture(page, '#/HR/cheapest');
  const row = page.locator('.pw-row').first();
  // Nivea: AT is cheapest (3,00 €), SI is most expensive (7,00 €)
  await expect(row.locator('.pw-cell-country[data-extreme="min"]')).toContainText('🇦🇹');
  await expect(row.locator('.pw-cell-country[data-extreme="max"]')).toContainText('🇸🇮');
});

test('promo price swap: the table shows the non-promo reference price, tagged, not the sale price', async ({ page }) => {
  await gotoWithFixture(page, '#/HR/cheapest');
  const row = page.locator('.pw-row').filter({ hasText: 'always' });
  const hrCell = row.locator('.pw-cell-country').nth(0); // HR is first in COUNTRY_ORDER
  // reference price 3,25 €, not the 1,95 € sale price
  await expect(hrCell.locator('.pw-price')).toContainText('3,25');
  await expect(hrCell.locator('.pw-promo-tag')).toBeVisible();

  // the tooltip additionally surfaces the actual promo price
  await hrCell.locator('.pw-price-link').hover();
  await expect(page.locator('#tooltip')).toContainText('1,95');
});

test('language switching changes the picked product name, including the de-falls-back-to-AT rule', async ({ page }) => {
  await gotoWithFixture(page, '#/HR/cheapest');
  const niveaRow = page.locator('.pw-row').first();

  await expect(niveaRow).toContainText('Nivea krema u limenci'); // hr, default

  await page.locator('.pw-lang-btn[data-lang="sl"]').click();
  await expect(niveaRow).toContainText('Nivea krema v pločevinki');

  await page.locator('.pw-lang-btn[data-lang="hu"]').click();
  await expect(niveaRow).toContainText('Nivea krém fémdobozban');

  // 'de' falls back to AT's name - this product has no DE listing
  await page.locator('.pw-lang-btn[data-lang="de"]').click();
  await expect(niveaRow).toContainText('Nivea Creme Dose');
});

test('4-language UI strings: breadcrumb heading text follows the selected language', async ({ page }) => {
  await gotoWithFixture(page, '#/HR/cheapest');
  const breadcrumb = page.locator('#breadcrumb');
  await expect(breadcrumb).toContainText('Hrvatskoj'); // hr

  await page.locator('.pw-lang-btn[data-lang="de"]').click();
  await expect(breadcrumb).toContainText('Kroatien');

  await page.locator('.pw-lang-btn[data-lang="hu"]').click();
  await expect(breadcrumb).toContainText('Horvátországban');

  await page.locator('.pw-lang-btn[data-lang="sl"]').click();
  await expect(breadcrumb).toContainText('Hrvaškem');
});

test('a HUF listing shows a EUR-converted table price with the native amount in the tooltip', async ({ page }) => {
  await gotoWithFixture(page, '#/HR/cheapest');
  const niveaRow = page.locator('.pw-row').first();
  const huCell = niveaRow.locator('.pw-cell-country').nth(4); // HU is last in COUNTRY_ORDER
  await expect(huCell.locator('.pw-price')).toContainText('5,50'); // 550 eur-cents

  await huCell.locator('.pw-price-link').hover();
  await expect(page.locator('#tooltip')).toContainText('Ft');
});
