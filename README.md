# NitrationThermo Lab — RagabLabs

**UI v2.0.0 — Thermal Energy Observatory**

**Nitration Thermodynamics & Heat Balance Laboratory** — twenty browser-based educational
calculators, Arabic RTL and English LTR. React + TypeScript + Vite, Tailwind CSS,
Recharts, KaTeX and Lucide. No backend, account or paid API is required.

The v2 redesign keeps the original scientific engine, source datasets, formula
strings, report/export protocol, units, validation and GitHub Pages configuration
unchanged. See `UI-REDESIGN-CHANGELOG.md` for the design and executed checks.

## التشغيل السريع

تحتاج Node.js 22 وnpm. افتح مجلد المشروع الذي يحتوي على `package.json` ثم:

```bash
npm ci
npm run dev
```

افتح الرابط الذي يظهر، مع المسار `/NitrationThermo-Lab/`.
للتأكد من نسخة الإنتاج:

```bash
npm test
npm run build
node scripts/check-dist.mjs
npm run preview
```

لا تفتح `index.html` بالنقر المزدوج؛ تطبيق Vite يحتاج خادم ملفات محليًا أو
استضافة GitHub Pages. يوجد مجلد `dist/` مبني وجاهز ضمن ZIP، والكود الكامل معه.

الحزمة المصححة تتضمن `PACKAGE-CONTENTS.sha256` ببصمات الملفات للتحقق من
اكتمالها بعد فك الضغط. استُبعد `node_modules/` عمدًا؛ يُثبّت بالأمر `npm ci`.

## النشر على GitHub Pages

1. فك ZIP. أنشئ مستودعًا باسم **NitrationThermo-Lab** داخل حساب `ragablabs`
   إذا أردت الرابط المتوقع أدناه.
2. ارفع **محتويات** مجلد المشروع إلى جذر المستودع، بما فيها `.github/workflows/`
   و`package.json` و`package-lock.json` و`src/`. لا ترفع ZIP كما هو، ولا ترفع
   `node_modules/`. لا تضع المشروع داخل مجلد إضافي داخل المستودع.
3. من **Settings → Pages → Build and deployment → Source** اختر
   **GitHub Actions**.
4. ارفع التغييرات إلى الفرع `main` أو شغّل workflow من **Actions →
   Test and deploy GitHub Pages → Run workflow**.
5. ينفذ workflow الاختبارات والبناء وفحص الأصول واختبارات المتصفح قبل النشر.

الرابط المتوقع **بعد تنفيذ النشر بنجاح**:
<https://ragablabs.github.io/NitrationThermo-Lab/>

هذا رابط متوقع فقط؛ لم يُنشأ مستودع ولم يحدث نشر عام أثناء إعداد هذه الحزمة.
تم ضبط Vite base على `/NitrationThermo-Lab/`. إذا غيرت اسم المستودع فعدّل
`base` في `vite.config.ts` و`baseURL` و`webServer.url` في
`playwright.config.ts` و`base` في `scripts/check-dist.mjs` معًا.

التوجيه بالـhash (`#/calculator/20`) يحافظ على عمل الروابط المباشرة في Pages
دون إعادة كتابة من الخادم. ملفات الخطوط والمعادلات ذاتية الاستضافة ضمن البناء؛
لا يعتمد تشغيل الحسابات على اتصال بمصدر خارجي بعد تحميل الصفحة وأصولها.
لا يُدَّعى وجود service worker أو تثبيت PWA أو تشغيل دون تحميل أولي.

## استخدام الحاسبات

- افتح أي حاسبة، وراجع الافتراضات والمصدر. القيم الافتراضية جاهزة لتجربة المعادلة؛
  اضغط **تحميل مثال** لإعادتها أو **مسح المدخلات** لإدخال بيانات جديدة.
- اختر وحدة لكل كمية؛ يُحوِّل تغيير الوحدة القيمة مع الحفاظ على الكمية الفيزيائية.
- اضغط **احسب**. تظهر النتائج وخطوات الحل والتفسير والرسم وجدول بياناته.
- يمكن تغيير وحدة عرض كل نتيجة مناسبة، وتصدير JSON أو CSV أو نص، أو نسخ التقرير
  أو استخدام **طباعة / PDF**. التصدير يتضمن آخر مدخلات حُسبت، حتى لو تغير النموذج
  بعد ذلك. حافظ على إعدادات ورق مناسبة عند استخدام طباعة المتصفح.
- يُحفظ اختيار اللغة والوضع اللوني محليًا. لا تُرسل المدخلات إلى خادم، ولا تُحفظ
  الحسابات بين الجلسات. احفظ التقرير عند الحاجة.
- في الحاسبة 11 اختر إنثالبي الحالتين، أو أدخل جدولًا عند نسبة ثابتة للحمضين
  اللامائيين. لا توجد قاعدة معتمدة تلقائية لإنثالبي الأحماض الثلاثية.
- في الحاسبة 20 يمكن مقارنة الحرارة المقاسة بالحمل المطلوب؛ الإغلاق الجبري وحده
  ليس تحققًا تجريبيًا مستقلًا.

## Important scientific basis

System enthalpy changes are signed: **exothermic ΔH < 0**. Heat **into** the
chemical system is positive. Cooling removal has the opposite sign:

```text
Qin = reaction enthalpy + net mixing enthalpy
      + product sensible enthalpy − feed sensible enthalpy
Qremoved = −Qin
```

Under constant pressure with only pV work, a closed-system heat input equals
its enthalpy change, including sensible heat. The lecture’s negative sign is
interpreted as heat removed by cooling. Isothermal conditions alone do not
justify dropping feed/product sensible corrections relative to another
reference temperature.

Standard formation data are for the balanced reaction:

```text
C6H6(l) + HNO3(l) → C6H5NO2(l) + H2O(l)
```

The selected NIST + Argonne ATcT liquid reference values at 298.15 K give
**−149.05 kJ/mol of reaction**. The lecture’s **790.6 Btu/lb benzene at 71.6°F**
is a separate dataset, approximately **−143.64257 kJ/mol**, and is not silently
combined with standard formation values.

The lecture conversion direction is corrected:

```text
1 Btu_IT/lb = 2.326 kJ/kg ≈ 0.55592734 cal_th/g
1 cal_th/g ≈ 1.79879622 Btu_IT/lb
```

**All Cp models, dilution enthalpies and validity intervals that are not
explicitly sourced are illustrative user inputs.** No universal acid-dilution
constant or invented ternary property surface is provided. The NIST liquid
water Shomate range (298–500 K) requires a maintained liquid phase; it does not
imply liquid stability at 1 bar over the entire interval.

## Calculator collection

| # | Calculator | Core model |
|---|---|---|
| 01 | Standard Heat of Nitration | Hess’s law; fixed balanced liquid reaction |
| 02 | Reaction Heat Release | Mass → amount → extent using conversion and ν |
| 03 | Enthalpy Difference | Shared-reference specific enthalpy difference |
| 04 | Sensible Heat | Linear Cp(T) integral or NIST water Shomate |
| 05 | Temperature-Dependent Reaction Enthalpy | Kirchhoff integral |
| 06 | Mixed Acid Composition | Formal component mass fractions |
| 07 | Mixed Acid Blending | Any number of stream component balances |
| 08 | Acid Dilution Composition | Conserved acid masses on water addition |
| 09 | Total Acidity | Formal acid mass percentage, not pH |
| 10 | Acid Concentration Target Solver | One component target, finite added stream |
| 11 | Acid Dilution Heat | Endpoint enthalpies or user-table interpolation |
| 12 | Combined Nitration and Dilution Heat | Sum of signed reference contributions |
| 13 | Adiabatic Temperature Rise | Bisection on the enthalpy integral |
| 14 | Heat Capacity of a Mixture | Ideal mass-weighted estimate |
| 15 | Heating and Cooling Energy | Single-phase batch or steady-stream sensible heat |
| 16 | Isothermal Nitrator Heat Balance | Reaction + net mixing + sensible terms |
| 17 | Cooling Water Requirement | Power / prescribed water enthalpy rise |
| 18 | Cooling Duty vs Conversion | Explicit reaction + a+bX mixing law |
| 19 | Batch Nitrator Energy Balance | Two-state balance and measured-Q residual |
| 20 | Integrated Nitration Thermodynamic Balance | Species balances + linked reference energy balance |

## Tests

The v2 suite retains the original 119 scientific tests, adds 44 full-output
comparison cases, 13 protected-file checks and 20 equation-preservation checks.
Additional browser tests cover the five requested widths, keyboard interaction,
zoom-equivalent reflow and axe accessibility audits. Do not regenerate the
pre-redesign fixtures merely to make a failed preservation test pass.


```bash
npm test
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

`tests/science.test.ts` provides at least five tests for each calculator
(reference, boundary, invalid input, physical unit invariance and consistency),
plus regression tests. Playwright tests cover both a 1440px English desktop
and a 390px Arabic mobile viewport, all calculators, both themes, storage,
errors, examples, reset, plots, table data, stream editing, units, copy,
exports, asset requests and screenshots. See `docs/VALIDATION.md` for the
actual executed results and any limitations; commands here are reproducible
instructions, not a claim that every platform/browser was tested.

## Structure

```text
src/science/       Typed calculation engine, validation and unit conversion
src/data/          Calculator specifications, examples and source metadata
src/i18n/          English/Arabic interface and scientific error translations
src/components/    Inputs, equations, charts, results and scientific SVG
src/export/        JSON, CSV and text reports
src/App.tsx        Hash navigation, laboratory collection and calculator pages
src/styles.css     Responsive light/dark typography and print styling
tests/             Numerical reference and conservation tests
e2e/               Playwright interface tests
scripts/           Production-asset/base-path checks
.github/workflows/ GitHub Pages build, test and deployment
docs/              Scientific basis, lecture review, validation and font licenses
dist/              Prebuilt static output, included in the delivery ZIP only
```

Active interface fonts: **IBM Plex Sans Arabic**, **Inter**, and **KaTeX**.
The font sizes and warm thermal/cooling design tokens are in `src/styles.css`.
The interactive energy explorer is educational and does not add calculations or
invent reactor measurements. Current calculator hash routes are preserved.

For UI changes and accessibility scope, read `UI-REDESIGN-CHANGELOG.md` and
`docs/ACCESSIBILITY.md`.

For the full model and provenance, read `docs/SCIENTIFIC_MODEL.md` and
`docs/LECTURE_REVIEW.md`. Code license: MIT; see `THIRD_PARTY_NOTICES.md` for
third-party fonts, libraries and data.

**Educational and research use only. This is not a validated reactor safety,
control or plant-design system. No results define safe operating limits or
predict runaway dynamics.**
