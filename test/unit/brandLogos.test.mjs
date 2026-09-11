// Layer A — pure unit tests for brandLogos.js's resolution logic, plus a
// data-integrity check over the real curated registry (every referenced
// file actually exists on disk, every fallback points at a real entry) -
// see price-compare's README "Brand logo" next-steps item and
// docs/assets/brands/SOURCES.md for how these were sourced.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BRAND_LOGOS, resolveBrandLogo } from '../../docs/brandLogos.js';

test('resolveBrandLogo: null/empty/unknown brand resolves to null', () => {
  assert.equal(resolveBrandLogo(null), null);
  assert.equal(resolveBrandLogo(undefined), null);
  assert.equal(resolveBrandLogo(''), null);
  assert.equal(resolveBrandLogo('Some Uncurated Brand'), null);
});

test('resolveBrandLogo: exact match on a curated entry returns it directly', () => {
  const registry = { Foo: { file: 'foo.svg', showBrandText: false, linkUrl: 'https://foo.example/' } };
  assert.deepEqual(resolveBrandLogo('Foo', registry), registry.Foo);
});

test("resolveBrandLogo: an alias entry resolves to its parent's real entry", () => {
  const registry = {
    Foo: { file: 'foo.svg', showBrandText: false, linkUrl: 'https://foo.example/' },
    'Foo Baby': { fallbackKey: 'Foo' },
  };
  assert.deepEqual(resolveBrandLogo('Foo Baby', registry), registry.Foo);
});

test('resolveBrandLogo: an alias pointing at a missing key resolves to null, not a throw', () => {
  const registry = { 'Foo Baby': { fallbackKey: 'Foo' } };
  assert.equal(resolveBrandLogo('Foo Baby', registry), null);
});

test('resolveBrandLogo: a two-hop alias chain is not followed - only one hop is supported, resolves to null', () => {
  // Deliberately unsupported for now, see the comment in brandLogos.js -
  // this pins "at most one hop" rather than silently walking an
  // arbitrarily deep (or cyclic) chain.
  const registry = {
    Foo: { file: 'foo.svg', showBrandText: false, linkUrl: 'https://foo.example/' },
    'Foo Baby': { fallbackKey: 'Foo Junior' },
    'Foo Junior': { fallbackKey: 'Foo' },
  };
  assert.equal(resolveBrandLogo('Foo Baby', registry), null);
});

test('resolveBrandLogo: defaults to the real curated BRAND_LOGOS registry when none is passed', () => {
  assert.equal(resolveBrandLogo('NIVEA').file, 'nivea.svg');
});

test('the real registry: NIVEA sub-lines with no dedicated mark fall back to the NIVEA parent logo', () => {
  const parent = resolveBrandLogo('NIVEA', BRAND_LOGOS);
  for (const sub of ['NIVEA BABY', 'NIVEA MEN', 'NIVEA SUN']) {
    assert.deepEqual(resolveBrandLogo(sub, BRAND_LOGOS), parent, sub);
  }
});

test('the real registry: every curated logo file exists on disk under docs/assets/brands/', () => {
  const assetsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../docs/assets/brands');
  for (const [brand, entry] of Object.entries(BRAND_LOGOS)) {
    if (entry.fallbackKey) continue;
    assert.ok(entry.file, `${brand} entry has neither file nor fallbackKey`);
    assert.ok(fs.existsSync(path.join(assetsDir, entry.file)), `${brand} -> docs/assets/brands/${entry.file} is missing`);
  }
});

test('the real registry: every fallbackKey points at a real (non-alias) entry', () => {
  for (const [brand, entry] of Object.entries(BRAND_LOGOS)) {
    if (!entry.fallbackKey) continue;
    const parent = BRAND_LOGOS[entry.fallbackKey];
    assert.ok(parent, `${brand}'s fallbackKey ${entry.fallbackKey} does not exist`);
    assert.ok(!parent.fallbackKey, `${brand}'s fallbackKey ${entry.fallbackKey} is itself an alias`);
  }
});

test('the real registry: every real entry has linkUrl, license and attribution recorded', () => {
  for (const [brand, entry] of Object.entries(BRAND_LOGOS)) {
    if (entry.fallbackKey) continue;
    assert.ok(entry.linkUrl, `${brand} has no linkUrl`);
    assert.ok(entry.license, `${brand} has no license recorded`);
    assert.ok(entry.attribution, `${brand} has no attribution recorded`);
    assert.equal(typeof entry.showBrandText, 'boolean', `${brand}.showBrandText should be a boolean`);
  }
});
