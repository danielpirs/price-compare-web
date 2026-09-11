// Pure rendering/formatting logic for index.html, split out into its own ES
// module (native <script type="module">, still no build step) specifically
// so it can be unit-tested directly in Node - see test/unit/render.test.mjs
// and price-compare's README ("The frontend test suite" in Findings) for
// the full rationale. Nothing in this file touches the DOM, localStorage,
// or the network; every function takes what it needs as an argument.

import { resolveBrandLogo } from './brandLogos.js';

export var COUNTRY_ORDER = ['HR', 'SI', 'AT', 'DE', 'HU'];
export var FLAGS = { HR: '🇭🇷', SI: '🇸🇮', AT: '🇦🇹', DE: '🇩🇪', HU: '🇭🇺' };
export var LANGS = ['hr', 'sl', 'de', 'hu'];
// the 'de' switcher slot is a running joke: a black-gold "Habsburg" flag and
// an "Habsburgian" tooltip instead of the real German flag/name — the UI
// text it switches to is still genuine German (I18N.de below).
export var LANG_FLAGS = { hr: '🇭🇷', sl: '🇸🇮', de: null, hu: '🇭🇺' };
export var LANG_NATIVE = { hr: 'Hrvatski', sl: 'Slovenščina', de: 'Habsburgian', hu: 'Magyar' };
// which country's (already-localized) product name to show per UI language;
// 'de' falls back to AT if a product has no DE listing (both German).
export var LANG_NAME_COUNTRY = { hr: 'HR', sl: 'SI', de: 'DE', hu: 'HU' };
export var LANG_NAME_FALLBACK = { de: 'AT' };
export var KINDS = ['cheapest', 'most-expensive'];

export var I18N = {
  hr: {
    product: 'Proizvod',
    cheapestHere: 'Najjeftinije', mostExpensiveHere: 'Najskuplje',
    loading: 'Učitavanje…', error: 'Podatke trenutno nije moguće učitati.',
    langLabel: 'Jezik',
    lastSeen: 'Zadnje viđeno', promoPrice: 'Akcijska cijena',
    legalLink: 'Pravne napomene',
    countries: { HR: 'Hrvatska', SI: 'Slovenija', AT: 'Austrija', DE: 'Njemačka', HU: 'Mađarska' },
    countriesIn: { HR: 'u Hrvatskoj', SI: 'u Sloveniji', AT: 'u Austriji', DE: 'u Njemačkoj', HU: 'u Mađarskoj' },
    heading: function (kind, inCountry) {
      return 'Lista ' + (kind === 'cheapest' ? 'najjeftinijih' : 'najskupljih') + ' proizvoda ' + inCountry;
    },
  },
  sl: {
    product: 'Izdelek',
    cheapestHere: 'Najcenejše', mostExpensiveHere: 'Najdražje',
    loading: 'Nalaganje…', error: 'Podatkov trenutno ni mogoče naložiti.',
    langLabel: 'Jezik',
    lastSeen: 'Nazadnje videno', promoPrice: 'Akcijska cena',
    legalLink: 'Pravna obvestila',
    countries: { HR: 'Hrvaška', SI: 'Slovenija', AT: 'Avstrija', DE: 'Nemčija', HU: 'Madžarska' },
    countriesIn: { HR: 'na Hrvaškem', SI: 'v Sloveniji', AT: 'v Avstriji', DE: 'v Nemčiji', HU: 'na Madžarskem' },
    heading: function (kind, inCountry) {
      return 'Seznam ' + (kind === 'cheapest' ? 'najcenejših' : 'najdražjih') + ' izdelkov ' + inCountry;
    },
  },
  de: {
    product: 'Produkt',
    cheapestHere: 'Am günstigsten', mostExpensiveHere: 'Am teuersten',
    loading: 'Wird geladen…', error: 'Daten können derzeit nicht geladen werden.',
    langLabel: 'Sprache',
    lastSeen: 'Zuletzt gesehen', promoPrice: 'Aktionspreis',
    legalLink: 'Rechtliche Hinweise',
    countries: { HR: 'Kroatien', SI: 'Slowenien', AT: 'Österreich', DE: 'Deutschland', HU: 'Ungarn' },
    countriesIn: { HR: 'in Kroatien', SI: 'in Slowenien', AT: 'in Österreich', DE: 'in Deutschland', HU: 'in Ungarn' },
    heading: function (kind, inCountry) {
      return 'Liste der ' + (kind === 'cheapest' ? 'günstigsten' : 'teuersten') + ' Produkte ' + inCountry;
    },
  },
  hu: {
    product: 'Termék',
    cheapestHere: 'Legolcsóbb', mostExpensiveHere: 'Legdrágább',
    loading: 'Betöltés…', error: 'Az adatok jelenleg nem tölthetők be.',
    langLabel: 'Nyelv',
    lastSeen: 'Utoljára látva', promoPrice: 'Akciós ár',
    legalLink: 'Jogi közlemények',
    countries: { HR: 'Horvátország', SI: 'Szlovénia', AT: 'Ausztria', DE: 'Németország', HU: 'Magyarország' },
    countriesIn: { HR: 'Horvátországban', SI: 'Szlovéniában', AT: 'Ausztriában', DE: 'Németországban', HU: 'Magyarországon' },
    heading: function (kind, inCountry) {
      return 'A ' + (kind === 'cheapest' ? 'legolcsóbb' : 'legdrágább') + ' termékek listája ' + inCountry;
    },
  },
};

export function T(lang) { return I18N[lang]; }

export function formatPrice(eurCents) {
  if (eurCents == null) return '—';
  return (eurCents / 100).toFixed(2).replace('.', ',') + '\u00A0€';
}

// native-currency amount for non-EUR listings (currently HUF only) - HUF has
// no real fractional subdivision in practice, so no decimals; thousands get
// a non-breaking space per Hungarian convention.
export function formatNative(cents, currency) {
  var amount = cents / 100;
  if (currency === 'HUF') {
    var s = String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
    return s + '\u00A0Ft';
  }
  return amount.toFixed(2).replace('.', ',') + ' ' + currency;
}

// the price shown in the table itself: the non-promo reference price when
// this listing is a promo (falls back to the current price if no reference
// is recorded), so promo sales never headline as if they were structural.
export function displayedPriceOf(c) {
  return (c.isPromo && c.referencePriceEurCents != null) ? c.referencePriceEurCents : c.currentPriceEurCents;
}

// product name in the given UI language, using that language's own country
// listing (already localized there); falls back to the first available
// country (canonical HR/SI/AT/DE/HU order) if this product isn't sold in
// the preferred one.
export function pickName(item, lang) {
  var tryCc = [LANG_NAME_COUNTRY[lang], LANG_NAME_FALLBACK[lang]].filter(Boolean);
  for (var j = 0; j < tryCc.length; j++) {
    for (var i = 0; i < item.countries.length; i++) {
      if (item.countries[i].countryCode === tryCc[j]) return item.countries[i].name;
    }
  }
  return item.countries[0] ? item.countries[0].name : '';
}

export function formatDate(iso) {
  if (!iso) return '';
  var d = new Date(iso);
  var pad = function (n) { return String(n).padStart(2, '0'); };
  return pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear() + '.';
}

export function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

// no overview/landing page - any unrecognised hash (including the bare "#/"
// a fresh visit lands on) defaults to HR cheapest.
export function parseHash(hash) {
  var h = String(hash || '').replace(/^#\/?/, '');
  var parts = h.split('/').filter(Boolean);
  if (parts.length === 2 && COUNTRY_ORDER.indexOf(parts[0].toUpperCase()) !== -1 && KINDS.indexOf(parts[1]) !== -1) {
    return { view: 'country', cc: parts[0].toUpperCase(), kind: parts[1] };
  }
  return { view: 'country', cc: 'HR', kind: 'cheapest' };
}

function priceTagHtml() {
  return '<span class="pw-promo-tag" aria-hidden="true">%</span>';
}

export function countryCellHtml(item, cc, lang) {
  var c = null;
  for (var i = 0; i < item.countries.length; i++) {
    if (item.countries[i].countryCode === cc) { c = item.countries[i]; break; }
  }
  if (!c) {
    return '<div class="pw-cell-country" data-extreme="none"><span class="pw-cell-flag">' + FLAGS[cc] + '</span><span class="pw-dash">—</span></div>';
  }
  var displayed = item.countries.map(function (x) { return displayedPriceOf(x); });
  var min = Math.min.apply(null, displayed), max = Math.max.apply(null, displayed);
  var ownDisplayed = displayedPriceOf(c);
  var extreme = 'mid';
  if (min !== max) {
    if (ownDisplayed === min) extreme = 'min';
    else if (ownDisplayed === max) extreme = 'max';
  }
  var t = T(lang);
  var priceText = formatPrice(ownDisplayed);

  var tipLines = [t.lastSeen + ': ' + formatDate(c.observedAt)];
  if (c.currency !== 'EUR') {
    tipLines.push(formatNative(c.currentPriceCents, c.currency));
  }
  if (c.isPromo && c.currentPriceEurCents !== ownDisplayed) {
    tipLines.push(t.promoPrice + ': ' + formatPrice(c.currentPriceEurCents));
  }
  var tooltip = tipLines.join('\n');

  var flag = '<span class="pw-cell-flag">' + FLAGS[cc] + '</span>';
  var priceInner = '<span class="pw-price">' + priceText + (c.isPromo ? priceTagHtml() : '') + '</span>';
  if (c.url) {
    return '<div class="pw-cell-country" data-extreme="' + extreme + '" data-tooltip="' + esc(tooltip) + '">' + flag +
      '<a class="pw-price-link" href="' + esc(c.url) + '" target="_blank" rel="noopener">' + priceInner + '</a></div>';
  }
  return '<div class="pw-cell-country" data-extreme="' + extreme + '" data-tooltip="' + esc(tooltip) + '">' + flag + priceInner + '</div>';
}

// The brand line under the product name: a logo badge (see
// docs/brandLogos.js) when the brand is curated, linking out to the
// brand's own site, plus the plain brand text - except when the logo
// already spells the brand out (showBrandText: false), where the text
// would just be a redundant repeat of the badge. No logo at all (the
// common case) renders exactly as before this feature: plain text only.
export function brandLineHtml(brand, logo) {
  if (!logo) {
    return '<span class="pw-brand">' + esc(brand) + '</span>';
  }
  var badge = '<a class="pw-brand-logo-link" href="' + esc(logo.linkUrl) + '" target="_blank" rel="noopener">' +
    '<img class="pw-brand-logo" src="assets/brands/' + esc(logo.file) + '" alt="' + esc(brand) + '"></a>';
  return badge + (logo.showBrandText ? '<span class="pw-brand">' + esc(brand) + '</span>' : '');
}

export function rowHtml(item, idx, lang) {
  var name = pickName(item, lang);
  var logo = resolveBrandLogo(item.brand);
  var html = '<div class="pw-row">' +
    '<div class="pw-cell-product">' +
    '<span class="pw-rank">' + (idx + 1) + '</span>' +
    '<div><div class="pw-name">' + esc(name) + '</div><div class="pw-brand-line">' + brandLineHtml(item.brand, logo) + '</div></div>' +
    '</div>' +
    '<div class="pw-countries">';
  COUNTRY_ORDER.forEach(function (cc) { html += countryCellHtml(item, cc, lang); });
  html += '</div></div>';
  return html;
}
