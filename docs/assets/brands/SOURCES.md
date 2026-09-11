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
