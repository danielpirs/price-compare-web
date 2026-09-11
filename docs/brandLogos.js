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

  adidas: {
    file: 'adidas.svg',
    showBrandText: false,
    linkUrl: 'https://www.adidas.com/',
    license: 'Public domain (file), trademarked (mark)',
    attribution: 'Adidas AG, via Wikimedia Commons',
  },

  Rexona: {
    file: 'rexona.svg',
    showBrandText: false,
    linkUrl: 'https://www.rexona.com/',
    license: 'Public domain (file), trademarked (mark)',
    attribution: 'Unilever, via Wikimedia Commons',
  },

  // the raw scraped string includes "NEW YORK" - matched exactly, not
  // shortened to just "Maybelline".
  'MAYBELLINE NEW YORK': {
    file: 'maybelline.svg',
    showBrandText: false,
    linkUrl: 'https://www.maybelline.com/',
    license: 'Public domain (file), trademarked (mark)',
    attribution: "L'Oréal, via Wikimedia Commons",
  },

  's.Oliver': {
    file: 'soliver.svg',
    showBrandText: false,
    linkUrl: 'https://www.s-oliver.com/',
    license: 'Public domain (file), trademarked (mark)',
    attribution: 'S.Oliver Group, via Wikimedia Commons',
  },

  'TOM TAILOR': {
    file: 'tomtailor.svg',
    showBrandText: false,
    linkUrl: 'https://www.tom-tailor.com/',
    license: 'Public domain (file), trademarked (mark)',
    attribution: 'TOM TAILOR E-Commerce GmbH, via Wikimedia Commons',
  },

  // an icon-forward mark (a frog, "Frosch" = "frog" in German) rather than
  // a wordmark - the first curated entry that actually needs
  // showBrandText: true, everything else so far has been a wordmark.
  // Commons file carries VRTS-confirmed permission from Werner & Mertz
  // themselves, not just a PD-textlogo tag - the strongest provenance of
  // any file curated here.
  Frosch: {
    file: 'frosch.svg',
    showBrandText: true,
    linkUrl: 'https://www.frosch.de/',
    license: 'Uploaded with VRTS-confirmed permission from the rights holder',
    attribution: 'Werner & Mertz, via Wikimedia Commons',
  },

  'Oral-B': {
    file: 'oralb.svg',
    showBrandText: false,
    linkUrl: 'https://www.oralb.com/',
    license: 'Public domain (file), trademarked (mark)',
    attribution: 'Procter & Gamble, via Wikimedia Commons',
  },

  // synthetic family key - no bare "Garnier" ever appears in the scraped
  // data, only its sub-lines do, so this entry is never resolved directly
  // by rowHtml, only reached via the fallbackKey aliases below. Same idea
  // as NIVEA's sub-lines, but the parent itself isn't a real scraped
  // string here.
  Garnier: {
    file: 'garnier.svg',
    showBrandText: false,
    linkUrl: 'https://www.garnier.com/',
    license: 'Public domain (file), trademarked (mark)',
    attribution: "L'Oréal, via Wikimedia Commons",
  },
  'GARNIER mineral': { fallbackKey: 'Garnier' },
  'Garnier Men': { fallbackKey: 'Garnier' },
  'Garnier Skin Active': { fallbackKey: 'Garnier' },

  'PHILIPS AVENT': {
    file: 'philipsavent.svg',
    showBrandText: false,
    linkUrl: 'https://www.philips.com/c-m-pe/avent',
    license: 'Public domain (file), trademarked (mark)',
    attribution: 'Philips AVENT, via Wikimedia Commons',
  },

  vileda: {
    file: 'vileda.svg',
    showBrandText: false,
    linkUrl: 'https://www.vileda.com/',
    license: 'Public domain (file), trademarked (mark)',
    attribution: 'Vileda GmbH (Freudenberg), via Wikimedia Commons',
  },

  Moschino: {
    file: 'moschino.svg',
    showBrandText: false,
    linkUrl: 'https://www.moschino.com/',
    license: 'Public domain (file), trademarked (mark)',
    attribution: 'Moschino, via Wikimedia Commons',
  },

  'DOLCE&GABBANA': {
    file: 'dolcegabbana.svg',
    showBrandText: false,
    linkUrl: 'https://www.dolcegabbana.com/',
    license: 'Public domain (file), trademarked (mark)',
    attribution: 'Dolce & Gabbana, via Wikimedia Commons',
  },

  'HUGO BOSS': {
    file: 'hugoboss.svg',
    showBrandText: false,
    linkUrl: 'https://www.hugoboss.com/',
    license: 'Public domain (file), trademarked (mark)',
    attribution: 'Hugo Boss AG, via Wikimedia Commons',
  },

  'MAX FACTOR': {
    file: 'maxfactor.svg',
    showBrandText: false,
    linkUrl: 'https://www.maxfactor.com/',
    license: 'Public domain (file), trademarked (mark)',
    attribution: 'Max Factor (Coty), via Wikimedia Commons',
  },

  HiPP: {
    file: 'hipp.svg',
    showBrandText: false,
    linkUrl: 'https://www.hipp.com/',
    license: 'Public domain (file), trademarked (mark)',
    attribution: 'HiPP, via Wikimedia Commons',
  },

  Mexx: {
    file: 'mexx.svg',
    showBrandText: false,
    linkUrl: 'https://www.mexx.com/',
    license: 'Public domain (file), trademarked (mark)',
    attribution: 'Mexx, via Wikimedia Commons',
  },

  // Checked live 2026-09-11/12 across every brand appearing in the 10
  // published per-country lists (see Findings.md's "Brand-logo
  // real-catalogue frequency pass" and its follow-up "full pass") and NOT
  // curated:
  //
  // - No freely-licensed Commons file found: CATRICE (18/300 - the single
  //   most frequent uncurated brand when this pass started), essence,
  //   ogx, Makeup Revolution, Police, Carefree, Violeta, proteini.si,
  //   WILKINSON SWORD, HADA LABO TOKYO, syoss, Jaguar, Beauty of Joseon,
  //   Batiste, Borotalco, SENSODYNE, Martinelia, PARIS CORNER, COREGA,
  //   Elizabeth Arden, PARSA BEAUTY, BIBS, Schär, NYX PROFESSIONAL
  //   MAKEUP, Dr.Beckmann, Swissdent, Betty Barclay, 4711, lavera
  //   NATURKOSMETIK, Cosrx, Bondi Sands, ambi pur, Mixa, KEUNE, Johnson's
  //   baby, Somat.
  // - Every Commons hit was for an unrelated company/person sharing the
  //   name - the same name-collision trap Dove/Document-Freedom-Day
  //   caught, avoided here by checking before downloading, not after:
  //   bugatti (car manufacturer, not the fashion/socks brand sold here),
  //   EVELINE COSMETICS (a Polish cosmetician's personal shop logo,
  //   "Ewelina Kosmetyczna" - a namesake, not the actual Eveline Cosmetics
  //   company), and one further Garnier-search hit rejected outright for
  //   the same reason (a 1900s French publishing house's mark, not
  //   L'Oréal's Garnier - the genuine hit above is a different file).
  // - dm's own private-label/co-op brands, not third-party marks (same
  //   legal bucket as the dm-logo item, not this one) - checked and none
  //   have a Commons file either, so the exclusion is moot for now
  //   regardless of the ownership question: Balea (+ PROFESSIONAL),
  //   alverde NATURKOSMETIK, trend !t up, ebelin, Profissimo, Dontodent,
  //   Denkmit, babylove, HALLOHEBAMME (a dm x two independent midwives
  //   cooperation brand, not a third party's), sundance/SUNDANCE (also a
  //   dm house brand despite reading like a standalone one), Mivolis,
  //   Dein Bestes, dmBio, Sanft&Sicher, Saugstark&Sicher.
  // - Not attempted (very low likelihood - niche/private-label-adjacent
  //   naming, 1/300 each): oyess, INAO, Swissdent, CD, Nature Blossom,
  //   Santé naturally., dentural, BRISK, Jessa, SEINZ., Paradies,
  //   Visiomax, Home&Decor, DAVID BECKHAM, SABRINA CARPENTER, Gabriela
  //   Sabatini, Fascino (already checked separately, see below).
  //
  // Dove/Dove MEN+CARE deliberately not curated - the first Commons hit
  // for "Dove logo" turned out to be an unrelated dove-the-bird mascot
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
