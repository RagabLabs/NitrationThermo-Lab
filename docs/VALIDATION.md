# Validation — UI Redesign v2.0.0

Final checks completed for the 17 October 2026 release. These are executed
results, not planned checks. The original scientific model remains v1 and is
covered by `docs/SCIENTIFIC_MODEL.md`.

| Check | Final result |
|---|---|
| Original numerical/scientific tests | **119 passed** |
| Complete pre/post calculation snapshots | **44 passed** |
| Scientific/data/export/deployment SHA-256 checks | **13 passed** |
| Equation token/order/KaTeX preservation tests | **20 passed**, at three wrapping thresholds each |
| Total Vitest tests | **196 passed, 0 failed** |
| Playwright interface tests | **100 passed, 0 failed, 0 skipped, 0 flaky** |
| TypeScript check | Passed |
| Production Vite build | Passed |
| Local production HTML/CSS/font asset checks | Passed |
| Original GitHub Pages base | Preserved: `/NitrationThermo-Lab/` |
| Original delivery comparison | **14 files byte-identical**, including the original scientific test file |

The condensed machine-readable record is `qa/validation-summary.json`.

## Preservation evidence

The full calculation object from each of 44 saved input cases matches the
pre-redesign fixture: metrics, values, units, working, interpretations,
comparison tables, source labels and chart data. No numeric plot points were
replaced with decorative values. JSON snapshots canonicalize signed zero in
the same way as the unchanged JSON export. File-byte comparisons additionally
verify the original floating-point implementation.

All original `src/science/` and `src/data/` files, the exporter,
`vite.config.ts` and deployment workflow match both their pre-redesign hashes
and the original delivery ZIP. The original 119-test file also matches that ZIP.
The equation formatter is presentation only: twenty tests preserve every
original formula token and order at wrapping thresholds 35, 50 and 120, and
validate each resulting KaTeX block.

## Interface coverage

The retained interface suite calculates all twenty examples in desktop English
and mobile Arabic, with valid formulas, computed charts, chart data, unit
changes, examples/reset, validation, exports, clipboard, search, grouping,
source navigation, theme/language persistence and no runtime errors.

Additional redesign checks cover:

- 360, 390, 768, 1024 and 1440 px in both languages, including the home page,
  energy explorer and integrated calculator;
- the five thermal topics, explanations, valid equations and related links;
- keyboard arrow/Home/End tab interaction, focus and route preservation;
- skip links, breadcrumbs and previous/next calculator navigation;
- hero section links that move keyboard focus to their working section;
- separate result units and preservation of the last-calculated export data;
- reduced-motion preference and full dark/light theme behavior;
- equation reachability and no unnecessary horizontal page overflow;
- source/asset loading under the production GitHub Pages base.

## Resize and accessibility

A dedicated Chromium context tests equivalent 200% browser-zoom geometry:
**720 CSS px, device pixel ratio 2**, producing **1440-pixel-wide captures**.
Tests explicitly assert DPR and CSS width, retain 19 px input values and at
least 34 px results, verify page reflow and ensure valid equations. This is
zoom-equivalent rendering emulation, not a browser-toolbar interaction.

Four audit tests run axe WCAG 2 A/AA and WCAG 2.1 AA checks across three page
states each (home, integrated workspace, sources), covering both languages
and both themes: **12 analyzed page/theme/language combinations, no reported
violations**. Keyboard interaction, focus and representative colour contrasts
were also checked. See `docs/ACCESSIBILITY.md` for scope and W3C references.

## Visual review

Reviewed screenshots of the observatory hero, reactor heat arrows, thermal
explorer, indexed catalogue, integrated input/result workspace, mobile Arabic,
light/dark palettes, formula wrapping, five widths and zoom-equivalent output.
The mobile integrated equation now wraps over terms while preserving the
original expression. Heat arrows point outward into the cooling jacket and
the removal sign convention is explicit. Screenshots and temporary traces
were used for internal QA and are not part of the ZIP.

## Reproduce

```bash
npm ci
npm test
npm run build
node scripts/check-dist.mjs
npx playwright install --with-deps chromium
npm run test:e2e
```

Tests ran on headless Chromium 153.0.8010.0 on Linux. The suite supports a
compatible installed browser through `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`;
normal execution uses Playwright's installed Chromium. Browser binaries and
`node_modules` are excluded from the package.

## Limits

Viewport and zoom tests are browser emulation, not physical mobile hardware.
Safari, Firefox and dedicated screen-reader combinations were not run.
Automated audits are not an external accessibility certification. Browser
print/PDF remains available but print pagination was not separately certified.
No live GitHub Pages deployment was performed; the production build, asset
paths, routing base and original workflow were verified. No new scientific
validation of real reactor data is implied by a UI redesign.
