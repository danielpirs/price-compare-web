# price-compare-web

Frontend for [Preisly](https://preisly.eu) - a personal, non-commercial project
comparing dm drugstore prices across Croatia, Slovenia, Austria, Germany and
Hungary.

This repo holds only the published static site (`index.html`, `legal.html`)
and the price-comparison data it reads (`data/*.json`) - plain HTML/CSS/
vanilla JS, no build step, no framework. It's hosted via GitHub Pages.

The scraper, database, and aggregator that produce the `data/*.json` files
live in a separate, private repo -
[`price-compare`](https://github.com/danielpirs/price-compare) - which also
publishes the JSON here nightly. See that repo's README for how the data is
collected and aggregated.

See [`legal.html`](legal.html) for the disclaimer, privacy notice, and
contact.

`npm test` runs the frontend test suite (`npm run test:unit` for the pure
render-logic tests, `npm run test:e2e` for the Playwright smoke tests) - see
[`price-compare`](https://github.com/danielpirs/price-compare)'s README for
the full test strategy.
