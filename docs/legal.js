// Pure language-resolution logic for legal.html, split out for unit-testing
// - see test/unit/legal-lang.test.mjs. Takes the query string and stored
// preference as plain arguments rather than reading location/localStorage
// itself, so it needs no browser to test.
export function resolveLang(search, stored) {
  var params = new URLSearchParams(search);
  var q = params.get('lang');
  if (q === 'hr') return 'hr';
  if (q) return 'en';
  if (stored === 'hr') return 'hr';
  if (stored) return 'en';
  return 'hr';
}
