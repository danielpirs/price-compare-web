// Layer A — pure unit tests for render.js. Hand-picked inputs, exact-value
// assertions, no DOM/browser involved (same spirit as price-compare's own
// Layer 1: nothing but the function under test). Pin the timezone so
// formatDate's local-time formatting doesn't depend on the host's TZ.
process.env.TZ = 'UTC';

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatPrice,
  formatNative,
  displayedPriceOf,
  pickName,
  formatDate,
  esc,
  parseHash,
  countryCellHtml,
  brandLineHtml,
  rowHtml,
  COUNTRY_ORDER,
  I18N,
} from '../../docs/render.js';

test('formatPrice', () => {
  assert.equal(formatPrice(null), '—');
  assert.equal(formatPrice(0), '0,00\u00A0€');
  assert.equal(formatPrice(1234), '12,34\u00A0€');
  assert.equal(formatPrice(100), '1,00\u00A0€');
});

test('formatNative: EUR-style currency, comma decimal', () => {
  assert.equal(formatNative(12345, 'USD'), '123,45 USD');
});

test('formatNative: HUF has no decimals and a non-breaking-space thousands separator', () => {
  assert.equal(formatNative(19990000, 'HUF'), '199\u00A0900\u00A0Ft');
  assert.equal(formatNative(49900, 'HUF'), '499\u00A0Ft');
});

test('displayedPriceOf: non-promo uses the current price', () => {
  const c = { isPromo: false, currentPriceEurCents: 500, referencePriceEurCents: null };
  assert.equal(displayedPriceOf(c), 500);
});

test('displayedPriceOf: promo with a recorded reference price shows the reference, not the sale price', () => {
  const c = { isPromo: true, currentPriceEurCents: 195, referencePriceEurCents: 325 };
  assert.equal(displayedPriceOf(c), 325);
});

test('displayedPriceOf: promo but no reference price recorded falls back to the current price', () => {
  const c = { isPromo: true, currentPriceEurCents: 195, referencePriceEurCents: null };
  assert.equal(displayedPriceOf(c), 195);
});

test('formatDate', () => {
  assert.equal(formatDate('2026-09-04T09:13:53.027Z'), '04.09.2026.');
  assert.equal(formatDate(null), '');
  assert.equal(formatDate(undefined), '');
});

test('esc escapes HTML-significant characters', () => {
  assert.equal(esc('<script>&"\'</script>'), '&lt;script&gt;&amp;&quot;&#39;&lt;/script&gt;');
  assert.equal(esc(null), '');
  assert.equal(esc(undefined), '');
});

test('parseHash: recognised country/kind route', () => {
  assert.deepEqual(parseHash('#/SI/most-expensive'), { view: 'country', cc: 'SI', kind: 'most-expensive' });
  // country code case-insensitive
  assert.deepEqual(parseHash('#/at/cheapest'), { view: 'country', cc: 'AT', kind: 'cheapest' });
});

test('parseHash: unrecognised/empty hash defaults to HR cheapest', () => {
  assert.deepEqual(parseHash(''), { view: 'country', cc: 'HR', kind: 'cheapest' });
  assert.deepEqual(parseHash('#/'), { view: 'country', cc: 'HR', kind: 'cheapest' });
  assert.deepEqual(parseHash('#/XX/cheapest'), { view: 'country', cc: 'HR', kind: 'cheapest' });
  assert.deepEqual(parseHash('#/HR/nonsense'), { view: 'country', cc: 'HR', kind: 'cheapest' });
});

const nivea = {
  brand: 'NIVEA',
  countries: [
    { countryCode: 'HR', name: 'Nivea krema u limenci' },
    { countryCode: 'SI', name: 'Nivea krema v pločevinki' },
    { countryCode: 'AT', name: 'Nivea Creme Dose' },
    { countryCode: 'HU', name: 'Nivea krém fémdobozban' },
    // deliberately no DE listing, to exercise the de-falls-back-to-AT rule
  ],
};

test('pickName: uses the UI language\'s own country listing', () => {
  assert.equal(pickName(nivea, 'hr'), 'Nivea krema u limenci');
  assert.equal(pickName(nivea, 'sl'), 'Nivea krema v pločevinki');
  assert.equal(pickName(nivea, 'hu'), 'Nivea krém fémdobozban');
});

test('pickName: de falls back to AT when there is no DE listing', () => {
  assert.equal(pickName(nivea, 'de'), 'Nivea Creme Dose');
});

test('pickName: falls back to the first available country if neither the preferred nor fallback country is sold', () => {
  const noAt = { countries: [{ countryCode: 'HR', name: 'Samo HR' }] };
  assert.equal(pickName(noAt, 'de'), 'Samo HR');
});

test('pickName: no countries at all returns empty string', () => {
  assert.equal(pickName({ countries: [] }, 'hr'), '');
});

test('I18N carries all 4 UI languages with a heading() function', () => {
  assert.deepEqual(Object.keys(I18N).sort(), ['de', 'hr', 'hu', 'sl']);
  for (const lang of Object.keys(I18N)) {
    assert.equal(typeof I18N[lang].heading, 'function');
    assert.equal(typeof I18N[lang].heading('cheapest', 'in Test'), 'string');
  }
});

test('countryCellHtml: missing country renders a dash, no link', () => {
  const item = { countries: [{ countryCode: 'HR', currentPriceEurCents: 100, isPromo: false, observedAt: '2026-09-01T00:00:00Z', currency: 'EUR' }] };
  const html = countryCellHtml(item, 'AT', 'hr');
  assert.match(html, /data-extreme="none"/);
  assert.match(html, /—/);
  assert.doesNotMatch(html, /<a /);
});

test('countryCellHtml: marks the cheapest/most-expensive country and shows the promo tag on a promo price', () => {
  const item = {
    countries: [
      { countryCode: 'HR', currentPriceEurCents: 500, referencePriceEurCents: null, isPromo: false, currency: 'EUR', observedAt: '2026-09-01T00:00:00Z', url: 'https://example.com/hr' },
      { countryCode: 'AT', currentPriceEurCents: 195, referencePriceEurCents: 325, isPromo: true, currency: 'EUR', observedAt: '2026-09-02T00:00:00Z', url: 'https://example.com/at' },
    ],
  };
  const hrHtml = countryCellHtml(item, 'HR', 'hr');
  assert.match(hrHtml, /data-extreme="max"/);
  assert.doesNotMatch(hrHtml, /pw-promo-tag/);

  const atHtml = countryCellHtml(item, 'AT', 'hr');
  // AT is displayed at its non-promo reference price (3,25 €), not the 1,95 € sale price
  assert.match(atHtml, /data-extreme="min"/);
  assert.match(atHtml, /3,25/);
  assert.match(atHtml, /pw-promo-tag/);
  assert.match(atHtml, /href="https:\/\/example\.com\/at"/);
});

test('countryCellHtml: all countries at the same price mark none as extreme', () => {
  const item = {
    countries: [
      { countryCode: 'HR', currentPriceEurCents: 500, isPromo: false, currency: 'EUR', observedAt: '2026-09-01T00:00:00Z' },
      { countryCode: 'AT', currentPriceEurCents: 500, isPromo: false, currency: 'EUR', observedAt: '2026-09-01T00:00:00Z' },
    ],
  };
  assert.match(countryCellHtml(item, 'HR', 'hr'), /data-extreme="mid"/);
});

test('rowHtml: renders the rank, picked name, brand and one cell per country in COUNTRY_ORDER', () => {
  // an uncurated brand on purpose - this test is about the row's general
  // plumbing (rank/name/country-cells), not brand-logo behaviour, which
  // has its own tests below. A curated brand like NIVEA would make the
  // plain ">NIVEA<" text assertion below false for reasons unrelated to
  // what this test is checking.
  const item = {
    brand: 'Uncurated Brand',
    countries: [{ countryCode: 'HR', name: 'Nivea', currentPriceEurCents: 500, isPromo: false, currency: 'EUR', observedAt: '2026-09-01T00:00:00Z' }],
  };
  const html = rowHtml(item, 4, 'hr');
  assert.match(html, />5</); // idx 4 -> rank 5
  assert.match(html, />Nivea</);
  assert.match(html, />Uncurated Brand</);
  assert.equal((html.match(/pw-cell-country/g) || []).length, COUNTRY_ORDER.length);
});

// ---------- brand-logo badge (see docs/brandLogos.js) ----------

test('brandLineHtml: no logo (the common case today) renders plain escaped brand text, nothing else', () => {
  const html = brandLineHtml('Some & Brand', null);
  assert.equal(html, '<span class="pw-brand">Some &amp; Brand</span>');
});

test('brandLineHtml: a logo with showBrandText:false renders only the badge, no duplicate text span', () => {
  const logo = { file: 'foo.svg', showBrandText: false, linkUrl: 'https://foo.example/' };
  const html = brandLineHtml('Foo', logo);
  assert.match(html, /<a class="pw-brand-logo-link" href="https:\/\/foo\.example\/" target="_blank" rel="noopener">/);
  assert.match(html, /<img class="pw-brand-logo" src="assets\/brands\/foo\.svg" alt="Foo">/);
  assert.doesNotMatch(html, /pw-brand"/);
});

test('brandLineHtml: a logo with showBrandText:true renders the badge and the text span', () => {
  const logo = { file: 'foo.svg', showBrandText: true, linkUrl: 'https://foo.example/' };
  const html = brandLineHtml('Foo', logo);
  assert.match(html, /pw-brand-logo/);
  assert.match(html, /<span class="pw-brand">Foo<\/span>/);
});

test('brandLineHtml: the logo link and image src/alt are HTML-escaped', () => {
  const logo = { file: 'foo.svg', showBrandText: false, linkUrl: 'https://foo.example/?a=1&b=2' };
  const html = brandLineHtml('Foo & Bar', logo);
  assert.match(html, /href="https:\/\/foo\.example\/\?a=1&amp;b=2"/);
  assert.match(html, /alt="Foo &amp; Bar"/);
});

test('rowHtml: a curated brand (NIVEA) renders the logo badge instead of plain brand text', () => {
  const item = {
    brand: 'NIVEA',
    countries: [{ countryCode: 'HR', name: 'Nivea krema', currentPriceEurCents: 500, isPromo: false, currency: 'EUR', observedAt: '2026-09-01T00:00:00Z' }],
  };
  const html = rowHtml(item, 0, 'hr');
  assert.match(html, /src="assets\/brands\/nivea\.svg"/);
  assert.match(html, /alt="NIVEA"/);
});

test('rowHtml: a NIVEA sub-line with no dedicated mark (NIVEA MEN) falls back to the NIVEA logo file, keeping its own alt text', () => {
  const item = {
    brand: 'NIVEA MEN',
    countries: [{ countryCode: 'HR', name: 'Nivea Men gel za tuširanje', currentPriceEurCents: 500, isPromo: false, currency: 'EUR', observedAt: '2026-09-01T00:00:00Z' }],
  };
  const html = rowHtml(item, 0, 'hr');
  assert.match(html, /src="assets\/brands\/nivea\.svg"/);
  assert.match(html, /alt="NIVEA MEN"/);
});

test('rowHtml: a lowercase-scraped curated brand (adidas) resolves by exact string, alt text keeps the scraped casing', () => {
  const item = {
    brand: 'adidas',
    countries: [{ countryCode: 'HR', name: 'Čarape', currentPriceEurCents: 500, isPromo: false, currency: 'EUR', observedAt: '2026-09-01T00:00:00Z' }],
  };
  const html = rowHtml(item, 0, 'hr');
  assert.match(html, /src="assets\/brands\/adidas\.svg"/);
  assert.match(html, /alt="adidas"/);
});

test('rowHtml: an uncurated brand (the common case) renders exactly as before this feature - plain text, no badge markup', () => {
  const item = {
    brand: 'Balea',
    countries: [{ countryCode: 'HR', name: 'Balea krema', currentPriceEurCents: 500, isPromo: false, currency: 'EUR', observedAt: '2026-09-01T00:00:00Z' }],
  };
  const html = rowHtml(item, 0, 'hr');
  assert.doesNotMatch(html, /pw-brand-logo/);
  assert.match(html, /<span class="pw-brand">Balea<\/span>/);
});
