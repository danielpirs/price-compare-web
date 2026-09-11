# Brand logo sources

Self-hosted, not hotlinked - see `price-compare` README's "Brand logo"
next-steps item and `Findings.md`'s "Logos, brand marks and product
images" for the sourcing/legal reasoning. Every file here was pulled from
Wikimedia Commons, whose `extmetadata` was checked per file (not just
searched-and-assumed) before it was committed.

| File | Brand key(s) in `brandLogos.js` | Commons source | License | Artist/credit |
| --- | --- | --- | --- | --- |
| `nivea.svg` | `NIVEA` (parent of `NIVEA BABY`/`NIVEA MEN`/`NIVEA SUN`, no dedicated sub-line mark found) | [NIVEA_logo_2021.svg](https://commons.wikimedia.org/wiki/File:NIVEA_logo_2021.svg) | Public domain (marked `trademarked`) | Beiersdorf AG |
| `colgate.svg` | `Colgate` | [Colgate_logo_red.svg](https://commons.wikimedia.org/wiki/File:Colgate_logo_red.svg) | Public domain (marked `trademarked`) | Colgate |
| `loreal.svg` | `L'ORÉAL PARiS` | [L'Oréal_logo.svg](<https://commons.wikimedia.org/wiki/File:L'Oréal_logo.svg>) | Public domain (marked `trademarked`) | L'Oréal |
| `durex.svg` | `durex` | [Durex_logo.svg](https://commons.wikimedia.org/wiki/File:Durex_logo.svg) | Public domain (marked `trademarked`) | Unknown author, credited to durex.co.uk |
| `adidas.svg` | `adidas` | [Adidas_2022_logo.svg](https://commons.wikimedia.org/wiki/File:Adidas_2022_logo.svg) | Public domain (marked `trademarked`) | Adidas AG |
| `rexona.svg` | `Rexona` | [Rexona_logo_2018.svg](https://commons.wikimedia.org/wiki/File:Rexona_logo_2018.svg) | Public domain (marked `trademarked`) | Unilever |
| `maybelline.svg` | `MAYBELLINE NEW YORK` | [Maybelline-Logo.svg](https://commons.wikimedia.org/wiki/File:Maybelline-Logo.svg) | Public domain (marked `trademarked`) | L'Oréal |
| `soliver.svg` | `s.Oliver` | [S.Oliver_Logo_2010.svg](<https://commons.wikimedia.org/wiki/File:S.Oliver_Logo_2010.svg>) | Public domain (marked `trademarked`) | Unknown author (Commons category confirms the S.Oliver Group/Würzburg connection) |
| `tomtailor.svg` | `TOM TAILOR` | [Tom_Tailor_Logo_2020.svg](https://commons.wikimedia.org/wiki/File:Tom_Tailor_Logo_2020.svg) | Public domain (marked `trademarked`) | TOM TAILOR E-Commerce GmbH |
| `frosch.svg` | `Frosch` | [Frosch_logo.svg](https://commons.wikimedia.org/wiki/File:Frosch_logo.svg) | **VRTS-confirmed permission** from the rights holder (stronger than a bare PD-textlogo tag) | Werner & Mertz |
| `oralb.svg` | `Oral-B` | [Oral-B_Logo_2024.svg](https://commons.wikimedia.org/wiki/File:Oral-B_Logo_2024.svg) | Public domain (marked `trademarked`) | Procter & Gamble |
| `garnier.svg` | `Garnier` (synthetic family key - `GARNIER mineral`/`Garnier Men`/`Garnier Skin Active` all fall back to it; no bare "Garnier" is ever scraped) | [Garnier_wordmark.svg](https://commons.wikimedia.org/wiki/File:Garnier_wordmark.svg) | Public domain (marked `trademarked`) | L'Oréal |
| `philipsavent.svg` | `PHILIPS AVENT` | [Philips_AVENT_logo.svg](https://commons.wikimedia.org/wiki/File:Philips_AVENT_logo.svg) | Public domain (marked `trademarked`) | Philips AVENT |
| `vileda.svg` | `vileda` | [Vileda_Logo_2024.svg](https://commons.wikimedia.org/wiki/File:Vileda_Logo_2024.svg) | Public domain (marked `trademarked`) | Vileda GmbH (Freudenberg) |
| `moschino.svg` | `Moschino` | [Moschino_logo.svg](https://commons.wikimedia.org/wiki/File:Moschino_logo.svg) | Public domain (marked `trademarked`) | Moschino |
| `dolcegabbana.svg` | `DOLCE&GABBANA` | [Dolce_&_Gabbana.svg](<https://commons.wikimedia.org/wiki/File:Dolce_%26_Gabbana.svg>) | Public domain (marked `trademarked`) | Unknown author |
| `hugoboss.svg` | `HUGO BOSS` | [Hugo_Boss_logo_2021.svg](https://commons.wikimedia.org/wiki/File:Hugo_Boss_logo_2021.svg) | Public domain (marked `trademarked`) | Hugo Boss AG |
| `maxfactor.svg` | `MAX FACTOR` | [MaxFactor_logo.svg](https://commons.wikimedia.org/wiki/File:MaxFactor_logo.svg) | Public domain (marked `trademarked`) | Max Factor |
| `hipp.svg` | `HiPP` | [HIPP-Logo.svg](https://commons.wikimedia.org/wiki/File:HIPP-Logo.svg) | Public domain (marked `trademarked`) | Unknown author (de.wikipedia link confirms the Hipp baby-food company) |
| `mexx.svg` | `Mexx` | [Mexx_Logo.svg](https://commons.wikimedia.org/wiki/File:Mexx_Logo.svg) | Public domain (marked `trademarked`) | Unknown author (de.wikipedia link confirms Mexx the fashion company) |

"Public domain (trademarked)" here means the *file's own copyright status*
per its Commons license tag (usually because a simple wordmark/geometric
mark falls below the originality threshold) - it says nothing about the
trademark itself, which stays the respective company's and is used here
under the referential/nominative-use reasoning in Findings.md, not because
of the file's copyright tag.

**Checked and rejected: `Dove-logo-2012.svg`.** Turned up in an initial
Commons search for "Dove logo svg" and was used as a stand-in shape in the
private layout-mockup Artifact earlier in this feature's discussion - but
its own `extmetadata` (`ObjectName: Dove-logo-2012`,
`ImageDescription: Logo of Document Freedom Day 2013`, `Artist: FSFE`)
shows it's the Free Software Foundation Europe's Document Freedom Day
mascot, an unrelated dove-the-bird logo that only coincidentally shares
the filename - not Unilever's Dove soap-brand mark. Confirmed by opening
the file directly, not just trusting the search snippet. No confirmed
freely-licensed Unilever Dove logo was found on a follow-up Commons
category check or via English Wikipedia's own "Dove (toiletries)" article
(no Commons-hosted image on that page as of this check) - left uncurated
rather than guessing. `Dove MEN+CARE`/`Dove` stay text-only until a real
source turns up.

**Real-catalogue frequency pass (2026-09-11).** Counted raw brand strings
across all 10 published per-country list files (300 slots, 99 distinct
strings) to pick the next brands to curate by actual display frequency
rather than convenience. Findings.md ("Brand-logo implementation, first
slice") has the full table; summary here:

- *Added:* `adidas`, `Rexona`, `MAYBELLINE NEW YORK`, `s.Oliver` - all
  verified via `extmetadata` before downloading, same process as above.
- *Checked, no verified free source found:* `CATRICE` (18/300 - the single
  most frequent uncurated brand at the time), `essence`, `OGX`, `Makeup
  Revolution`, `Police`, `Carefree`, `Violeta` (a genuine independent
  manufacturer, Violeta d.o.o. of Grude, Bosnia and Herzegovina, not a dm
  house brand - confirmed by web search - just no Commons file).
- *Checked and rejected: `bugatti`.* Every Commons hit for "bugatti logo"
  is the car manufacturer (Bugatti Chiron, radiator badge, etc.) - a
  completely different company from "bugatti" the German fashion/socks
  brand actually stocked here (bugatti GmbH). Same name-collision trap as
  Dove above, caught this time by checking before downloading rather than
  after.
- *Checked and excluded - dm's own private-label/cooperation brands, not
  third-party marks:* `Balea` (+ `PROFESSIONAL`), `alverde NATURKOSMETIK`,
  `trend !t up`, `ebelin`, `Profissimo`, `Dontodent`, `Denkmit`,
  `babylove`, `HALLOHEBAMME` (a dm cooperation with two independent
  midwives, not a third party's brand), `sundance`/`SUNDANCE` (reads like
  a standalone brand but is also a dm house line) - all confirmed via web
  search, not assumed. These stay gated on the same dm-logo permission as
  the chain logo, per the "Brand logo" README item, regardless of how
  often they appear.

**Full-catalogue pass, part 2 (2026-09-11/12) - covers the rest of the 99
distinct brand strings, dm's own included this time on explicit
instruction (accepting the risk the exclusion above describes, not a
change in the underlying legal reasoning).** Added 12 more third-party
brands (table above: TOM TAILOR, Frosch, Oral-B, Garnier, Philips AVENT,
vileda, Moschino, DOLCE&GABBANA, HUGO BOSS, MAX FACTOR, HiPP, Mexx).
Findings.md ("Brand-logo full-catalogue pass") has the complete
brand-by-brand breakdown; two things worth keeping here:

- *Every one of the 16 dm own-brand candidates checked (Balea, alverde,
  trend !t up, ebelin, Profissimo, Dontodent, Denkmit, babylove,
  HALLOHEBAMME, sundance, Mivolis, Dein Bestes, dmBio, Sanft&Sicher,
  Saugstark&Sicher, Balea PROFESSIONAL) has no Commons file at all* - so
  the ownership question this session raised turned out moot in practice:
  none of them could have been curated either way. Commons' coverage
  skews toward companies with independent notability (their own Wikipedia
  article, typically), which dm's internal house brands generally don't
  have - worth remembering if this list is revisited once dm's press-kit
  question resolves, since Commons alone won't be the source then either.
- *A second and third name-collision trap, both caught before
  downloading:* a `GARNIER` search's top hit was "Garnier Frères" - an
  unrelated 1900s French publishing house that happens to share a
  surname, not L'Oréal's Garnier (the real one was a different file
  further down the results); `EVELINE COSMETICS` search's only hit was
  "Ewelina Kosmetyczna.svg" - a Polish cosmetician's own small-business
  logo (Ewelina is a first name, "kosmetyczna" means "cosmetician"), not
  the actual Eveline Cosmetics company. Both rejected the same way as
  Dove/bugatti - reading the file's own `ObjectName`/`ImageDescription`/
  `Categories`, not the search snippet.
