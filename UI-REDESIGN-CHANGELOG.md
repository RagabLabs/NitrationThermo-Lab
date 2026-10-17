# NitrationThermo Lab — UI Redesign v2.0.0

**RagabLabs · Thermal Energy Observatory · 17 October 2026**

This release redesigns the existing application. It retains the same twenty
calculators and four original scientific groups. No calculator, thermodynamic
property model or reaction was added or replaced.

## Visual identity

- Replaced the former light split hero and generic calculator-card grid with
  a graphite thermal-instrument header, an original jacketed-reactor diagram,
  a five-topic energy explorer and an indexed calculator catalogue.
- Replaced the old navy/teal interface palette with Thermal Graphite #222831,
  Heat Orange #E97832, Energy Amber #F3B34C, Cooling Blue #3D9BC9,
  Warm Ivory #FAF9F6 and Soft Gray #EEF1F3.
- Used darker thermal/cooling ink variants for small text and plot strokes,
  retaining contrast instead of putting low-contrast orange text on white.
- The default page remains predominantly light. The hero is graphite; the
  original optional dark theme is retained and restyled throughout.
- Added a project-native vector mark and coordinated SVG favicon.

## Typography and reading

- Arabic now uses **IBM Plex Sans Arabic**; English uses **Inter** and
  scientific mathematics uses **KaTeX**. Fonts are hosted in the build.
- Hero type: 48–60 px; section headings: 30–36 px; calculator titles: 28–30 px.
- Body: 18 px; input labels: 18 px; values: 19 px; mathematical equations:
  23–24 px; result numerals: 36–42 px; secondary interface text: 15–16 px.
- Increased Arabic line height and field spacing. Numeric quantities and unit
  controls remain distinct LTR elements inside either interface direction.
- Equations reflow at top-level expression boundaries according to the
  available width. Unbreakable expressions remain fully reachable in a
  keyboard-focusable scroll area with a visible hint and scrollbar.
- Added expandable symbol definitions and their SI/reference units.

## Original thermal graphics and interaction

- Added an SVG reactor vessel, symbolic temperature indicator, cooling jacket,
  coolant inlet/outlet and outward heat-transfer arrows.
- `Qremove = −Qin` is explicit. The diagram shows the sign convention;
  it does not invent temperature measurements, operating rates or duties.
- Added **Understand the Energy of Nitration** with five working topics:
  reaction heat, dilution heat, sensible heat, cooling duty and energy balance.
- Each topic has an explanation, equation, qualitative diagram and links to
  existing calculators. No synthetic numeric reactor dashboard was introduced.
- The topic control supports mouse, touch, roving keyboard focus, arrow keys,
  Home/End and appropriate tab/panel ARIA relationships.
- Added distinct category glyphs for enthalpy, composition, thermal effects
  and the reactor/cooling balance. Group identities come from the original data.

## Thermodynamic Analysis Workspace

- Added breadcrumbs, current instrument position and working previous/next
  calculator navigation without changing the existing hash routes.
- Moved the scientific overview and a full-width equation panel ahead of
  the input/result workspace.
- Gave the relevant main result its own larger panel while retaining every
  original result. Thermal quantities use warm styling; cooling uses blue;
  general mass/composition quantities remain neutral.
- Signed energy results also have text/icon badges, so sign and meaning do
  not depend on colour alone. The original numerical values are unchanged.
- Restyled the computed plots with 16 px axes/legends, visible units,
  contrasting solid/dashed lines, tooltips and the original accessible data
  tables. Cooling plots use the cooling palette.
- Restyled worked solutions, interpretations, warnings, assumptions,
  source references, empty/loading states and report controls.
- Preserved input-unit conversion, examples/reset, validation, output units,
  clipboard copy, JSON/CSV/text exports and browser print/PDF.

## Responsive and accessibility work

- Tested widths 360, 390, 768, 1024 and 1440 px in English and Arabic.
- Wide screens use two workspace columns. Narrow screens use wide vertical
  fields and result panels without shrinking the core text.
- Long tables and mathematical expressions scroll within their own regions,
  rather than widening the entire page.
- Added reliable focus management for skip navigation and hero section links,
  strong focus indicators, keyboard topic controls and reduced-motion support.
- Tested equivalent 200% browser-zoom geometry: 720 CSS pixels at DPR 2,
  rendering to 1440 physical pixels. This tests zoom-equivalent reflow and
  reading size; it is not a claim of physical-device testing.
- Automated axe WCAG A/AA checks cover home, integrated workspace and source
  page in both languages and both colour themes. See `docs/VALIDATION.md`
  for the executed final counts and the scope of these checks.

## Scientific preservation

The following were kept **byte-for-byte unchanged**:

- Every original file in `src/science/`.
- Original calculator specifications, equations and data in `src/data/`.
- Report/export implementation in `src/export/report.ts`.
- `vite.config.ts`, including `/NitrationThermo-Lab/` base.
- `.github/workflows/deploy.yml`.
- The original 119-test scientific suite.

Preservation was checked against the original v1 delivery ZIP, as well as
pre-redesign SHA-256 fixtures. Forty-four saved input cases compare complete
results, working steps, source labels, comparison tables and chart points.
Twenty equation tests verify that visual reflow preserves the original tokens,
term order and valid KaTeX at three wrapping thresholds. JSON fixtures normalize
signed zero like the unchanged report format; byte hashes additionally preserve
the engine's exact floating-point implementation.

**The UI package is v2.0.0. The retained scientific/export protocol remains the
original version.** No suspected scientific issue was silently repaired during
this design task. Existing documented scientific assumptions and limitations
remain applicable.

## Final validation and delivery

Final executed results: **196 Vitest tests passed** (119 original scientific,
44 complete-output comparisons, 13 protected-file checks and 20 equation checks),
and **100 Playwright interface tests passed**, with zero failures/skips/flaky
results. All 12 automated accessibility page/theme/language audits reported
no violations. TypeScript, production build and asset/base checks passed.
Read `docs/VALIDATION.md` and `qa/validation-summary.json` for details. The package includes the complete source, lockfile, original and new
tests, prebuilt `dist/`, font licenses, scientific documentation and unchanged
GitHub Pages workflow. It excludes `node_modules`, browser binaries, test
screenshots and temporary test traces.

Delivery filename:
`NitrationThermo-Lab-UI-Redesign-v2.0.0.zip`.

Repository name and expected URL are unchanged:
`NitrationThermo-Lab` and
<https://ragablabs.github.io/NitrationThermo-Lab/>.
The ZIP is prepared for deployment; no live publication is implied.

## Packaging repair — 17 October 2026

The first uploaded v2 archive was truncated and lacked its ZIP end record.
The replacement is rebuilt from the complete working project. No interface or
scientific calculation is changed by this repair. The replacement includes
`PACKAGE-CONTENTS.sha256` for checking every payload file after extraction.
Archive CRC, file hashes, extraction and a build from the extracted source are
checked before redelivery.
