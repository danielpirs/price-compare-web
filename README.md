# price-compare-web

Frontend for [Preisly](https://preisly.eu) - a personal, non-commercial project
comparing dm drugstore prices across Croatia, Slovenia, Austria, Germany and
Hungary.

This repo holds only the published static site and the price-comparison
data it reads - plain HTML/CSS/vanilla JS, no build step, no framework. The
actual site lives under [`docs/`](docs/) (`docs/index.html`,
`docs/legal.html`, `docs/render.js`/`docs/legal.js`, `docs/data/*.json`,
`docs/assets/*.png`) - GitHub Pages' own "/docs" source option, so the repo
root stays free for tooling (`test/`, `package.json`, CI) instead of mixing
in with the served site.

The scraper, database, and aggregator that produce the `docs/data/*.json`
files live in a separate, private repo -
[`price-compare`](https://github.com/danielpirs/price-compare) - which also
publishes the JSON here nightly. See that repo's README for how the data is
collected and aggregated.

See [`docs/legal.html`](docs/legal.html) for the disclaimer, privacy
notice, and contact.

`npm test` runs the frontend test suite (`npm run test:unit` for the pure
render-logic tests, `npm run test:e2e` for the Playwright smoke tests) - see
[`price-compare`](https://github.com/danielpirs/price-compare)'s README for
the full test strategy.
