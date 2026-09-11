// Curated brand-logo registry - see price-compare/README.md's "Brand logo"
// next-steps item and Findings.md's "Logos, brand marks and product
// images" for the sourcing/legal reasoning behind what's curated here, and
// docs/assets/brands/SOURCES.md for the per-file license/attribution
// record. Logos are self-hosted (docs/assets/brands/), not hotlinked - see
// that same discussion for why.
//
// Keyed on the raw brand string exactly as scraped today (dm is the only
// source, so brand strings are reasonably consistent - no cross-source
// alias layer yet). Once a second chain is scraped and spells the same
// brand differently, this needs a `brand_aliases` layer in front of this
// registry (raw scraped string -> canonical brand key, ideally mined from
// GTIN-linked product matches in packages/matching) - see the README item
// for the full two-layer design. Not needed while there's only one source.
//
// Entry shape is one of:
//   { file, showBrandText, linkUrl, license, attribution } - a real,
//     curated logo. `file` is a path under docs/assets/brands/.
//     `showBrandText` says whether to also show the plain brand-name text
//     next to the badge - false for a logo that already spells the brand
//     out (a wordmark), true for an icon-only mark that doesn't.
//   { fallbackKey } - an alias: this exact brand string has no dedicated
//     mark of its own (or none has been found/curated yet), so resolve
//     the parent brand's entry instead - e.g. a sub-line that shares its
//     parent's visual identity. Only one hop is resolved (see
//     resolveBrandLogo below) - a fallbackKey pointing at another alias
//     resolves to nothing rather than being chased further.
export var BRAND_LOGOS = {
  NIVEA: {
    file: 'nivea.svg',
    showBrandText: false,
    linkUrl: 'https://www.nivea.de/',
    license: 'Public domain (file), trademarked (mark)',
    attribution: 'Beiersdorf AG, via Wikimedia Commons',
  },
  // no dedicated Commons file found for these sub-lines (checked
  // 2026-09-11) - they fall back to the parent NIVEA disc rather than
  // showing no badge at all.
  'NIVEA BABY': { fallbackKey: 'NIVEA' },
  'NIVEA MEN': { fallbackKey: 'NIVEA' },
  'NIVEA SUN': { fallbackKey: 'NIVEA' },

  Colgate: {
    file: 'colgate.svg',
    showBrandText: false,
    linkUrl: 'https://www.colgate.com/',
    license: 'Public domain (file), trademarked (mark)',
    attribution: 'Colgate-Palmolive, via Wikimedia Commons',
  },

  "L'ORÉAL PARiS": {
    file: 'loreal.svg',
    showBrandText: false,
    linkUrl: 'https://www.lorealparis.com/',
    license: 'Public domain (file), trademarked (mark)',
    attribution: "L'Oréal, via Wikimedia Commons",
  },

  // lowercase, matches the raw scraped string exactly.
  durex: {
    file: 'durex.svg',
    showBrandText: false,
    linkUrl: 'https://www.durex.co.uk/',
    license: 'Public domain (file), trademarked (mark)',
    attribution: 'Durex, via Wikimedia Commons',
  },

  // Dove/Dove MEN+CARE deliberately not curated yet - the first Commons
  // hit for "Dove logo" turned out to be an unrelated dove-the-bird mascot
  // (Free Software Foundation Europe's Document Freedom Day, not
  // Unilever's Dove), and no confirmed freely-licensed Unilever Dove mark
  // was found on a follow-up check. See docs/assets/brands/SOURCES.md.
};

// Resolves a raw scraped brand string to its logo entry, following at most
// one alias hop (see the fallbackKey note above) - returns null for
// anything not curated at all, which is the vast majority of brands today
// and renders exactly as it did before this feature (plain text).
// `registry` is injectable so this stays a pure function for unit tests;
// callers use the real BRAND_LOGOS by default.
export function resolveBrandLogo(brand, registry) {
  if (registry === undefined) registry = BRAND_LOGOS;
  if (!brand) return null;
  var entry = registry[brand];
  if (!entry) return null;
  if (entry.fallbackKey) {
    var parent = registry[entry.fallbackKey];
    return parent && !parent.fallbackKey ? parent : null;
  }
  return entry;
}
