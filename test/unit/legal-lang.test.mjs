// Layer A — pure unit test for legal.js's resolveLang(). Takes the query
// string and stored preference as plain arguments (rather than reading
// location/localStorage itself) precisely so this is testable without a
// browser - see legal.js.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveLang } from '../../docs/legal.js';

test('resolveLang: explicit ?lang=hr wins regardless of storage', () => {
  assert.equal(resolveLang('?lang=hr', 'en'), 'hr');
});

test('resolveLang: any other explicit ?lang= value maps to en', () => {
  assert.equal(resolveLang('?lang=de', null), 'en');
  assert.equal(resolveLang('?lang=en', null), 'en');
});

test('resolveLang: no query param falls back to stored pw-lang', () => {
  assert.equal(resolveLang('', 'hr'), 'hr');
  assert.equal(resolveLang('', 'sl'), 'en'); // any non-hr stored UI language maps to the English legal text
});

test('resolveLang: no query param and nothing stored defaults to hr', () => {
  assert.equal(resolveLang('', null), 'hr');
});
