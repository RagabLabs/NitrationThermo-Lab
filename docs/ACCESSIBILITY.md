# Accessibility and readability — UI v2.0.0

The interface uses semantic landmarks and headings, explicit field labels,
visible focus styles, keyboard-operable controls, Arabic RTL and English LTR.
Numbers and units retain LTR ordering within either language. Result meanings
use words, symbols and signs as well as colour.

## Contrast

Light-theme text uses graphite or accessible thermal/cooling ink colours rather
than low-contrast brand accents. Body text is 18 px. Secondary text is at least
15 px. Large mathematical/result type is retained instead of shrinking content
to fit a narrow box. Representative CSS colour-pair ratios were calculated
from relative luminance:

| Pair | Ratio |
|---|---:|
| Graphite text on warm ivory | 14.09:1 |
| Graphite text on orange primary button | 5.08:1 |
| Secondary text on soft grey | 6.10:1 |
| Thermal ink on thermal result background | 6.24:1 |
| Cooling ink on cooling result background | 5.94:1 |
| Input boundary on warm ivory | 3.48:1 |
| Dark-theme primary text on panel | 12.56:1 |
| Dark-theme secondary text on panel | 8.41:1 |

The contrast choices follow W3C guidance for normal text and meaningful
component/graphic boundaries:

- [W3C — Contrast (Minimum), SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [W3C — Non-text Contrast, SC 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)

## Keyboard, focus and motion

- Skip navigation focuses the current main content without changing routes.
- Hero links focus the destination section as they scroll.
- The energy explorer uses tabs, linked panel labels, roving focus, arrow keys,
  Home and End. Arrow directions account for RTL; orientation follows layout.
- Inputs, selects, report controls and previous/next links are keyboard usable.
- Wide chart tables and formula regions are independently focusable and named.
- Plots retain tooltips and an accessible numerical data table; series use
  solid/dashed patterns and text labels rather than colour alone.
- Smooth scrolling is disabled for `prefers-reduced-motion`.

## Resize and reflow

Automated tests cover widths 360, 390, 768, 1024 and 1440 px. The two-column
workspace stacks vertically and mobile result panels retain large type.
Equations wrap at top-level terms without changing the catalog formulas;
unbreakable formula fragments can be scrolled in their own keyboard area.
Tables scroll within their panel. The page itself does not widen to contain
those fragments.

Equivalent 200% browser-zoom geometry is tested using a 720 CSS-pixel viewport
at device scale factor 2, compared with a 1440-pixel physical viewport.
Tests assert DPR, CSS width, page overflow, input/result font sizes and valid
formula rendering. This is browser-rendering emulation rather than operating
a physical phone or a browser toolbar zoom menu.

- [W3C — Resize Text, SC 1.4.4](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)

## Audit scope

The Playwright suite runs axe with WCAG 2 A/AA and WCAG 2.1 AA tags on the
homepage, integrated calculator and reference page, in both languages and both
colour modes. It also tests keyboard interaction, focus and reduced motion.
Read `docs/VALIDATION.md` for final executed results. Automated audits and these
manual checks are not an external accessibility certification; assistive-tool
and physical-device combinations outside this recorded scope were not tested.
