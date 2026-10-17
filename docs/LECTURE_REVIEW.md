# Review of the supplied lecture

Primary source: **Thermodynamic of nitration process**, credited on its cover
to Associate Prof. Dr. Ghada Kadry. The attached PPTX contains **15 slides**.
Text extraction was supplemented by full-slide rendering and visual inspection
of the image-based equations, stream diagrams and mixed-acid enthalpy chart.
The original PPTX and figures remain in the user's source files, not this
project's MIT code distribution.

## Slide mapping

| Slides | Inspected content | Implementation |
|---|---|---|
| 1–2 | Title, exothermic nitration, heat capacity, cooling importance | Home, scientific context and model limitations |
| 3 | Qcooling = Qnitration + Qdilution; ΔH = Hfinal − Hinitial; sign discussion | Calculators 12, 16, 19 and 20 |
| 4 | Reference enthalpy plus product/feed sensible terms; 32°F reference; unit statements | Full reference balance and explicit unit corrections |
| 5–7 | 10 lb mixed acid; 48% HNO3, 32% H2SO4, 20% H2O; add 15 lb water; dilution at 65°C; total acidity and water-free nitric fraction | Calculators 6–11; dry-basis ratio support |
| 8 | Image of enthalpy and specific-heat chart against total acid %, with dry HNO3 curves | Source reviewed; no falsely precise numerical dataset extracted |
| 9–11 | Final mass 25 lb; total acidity and water-free nitric formulas repeated | Composition mass-balance reference tests |
| 12 | Repeated chart image | Same data-quality decision as slide 8 |
| 13–14 | Benzene mononitration example, feed diagram, acid composition and Cp values | Reaction basis, lecture metadata and reference comparison |
| 15 | Balanced benzene + HNO3 → nitrobenzene + water; heat capacities | Stoichiometry and explicit reaction extent |

## Example 1: composition result

The inspected image text in slide 5 specifies dilution at **65°C**; this is
not a universal reference temperature. Initial and final bookkeeping values:

| Component | Initial mass (lb) | Final mass (lb) | Final mass (%) |
|---|---:|---:|---:|
| HNO3 | 4.8 | 4.8 | 19.2 |
| H2SO4 | 3.2 | 3.2 | 12.8 |
| H2O | 2.0 | 17.0 | 68.0 |
| Total | 10.0 | 25.0 | 100.0 |

Initial total acidity = 80%; final total acidity = 32%.
The dry/water-free HNO3 fraction stays 4.8/(4.8+3.2) = 60%.
In SI, multiply every lb mass by 0.45359237; the percentages are unchanged.
The 10 + 15 example in the app uses kg for convenient demonstration, which
preserves all percentages; the unit-invariance regression also evaluates
exactly the original 10 lb + 15 lb mass basis.

The scanned graph contains families of enthalpy and Cp curves, approximate
markings and no machine-readable table or complete source/range/uncertainty
metadata. Therefore the app does **not** assert an exact heat of dilution for
this example based on a graph reading. Calculator 11 requires user-supplied
endpoint or table data. Its displayed default h values are explicitly synthetic.

## Example 2: supplied inputs and remaining data gaps

| Input | Supplied lecture value |
|---|---:|
| Benzene charge | 10,000 lb |
| Mixed acid | 23,300 lb |
| HNO3 | 36.1 mass % |
| H2SO4 | 62.8 mass % |
| H2O | 1.1 mass % |
| Reaction temperature | 90°F = 305.37222 K |
| Heat of nitration magnitude | 790.6 Btu/lb benzene |
| Heat reference | 71.6°F = 295.15 K |
| Cp benzene | 0.4 Btu/(lb °F) |
| Cp nitric acid | 0.42 Btu/(lb °F) |
| Cp nitrobenzene | 0.3 Btu/(lb °F) |
| Cp water | 1 Btu/(lb °F) |

Using the explicitly selected Btu_IT convention, the lecture reaction release
corresponds to 1838.9356 kJ/kg benzene or 143.6425698 kJ/mol benzene. The system
reaction enthalpy is the negative of this release magnitude. The lecture does
not identify its Btu convention, so IT is a stated project assumption rather
than a claim about the original author's intent.

The supplied slides do not give a complete sulfuric-acid/mixed-acid Cp law,
validated initial/final dilution enthalpies, all feed temperatures, conversion
or a complete final numerical heat balance. Missing data are not invented to
claim an exact cooling answer. The integrated example uses its own clearly
labeled illustrative Cp/mixing/conversion inputs, not a purported full solution
to this incompletely specified lecture problem.

## Corrections and clarifications

1. The slide 4 statement “(BTU/lb) = 1.8 cal/g” reverses conversion direction.
   NIST conversions give `1 cal_th/g ≈ 1.79880 Btu_IT/lb` and
   `1 Btu_IT/lb ≈ 0.555927 cal_th/g`.
2. `Δ1°C = Δ1.8°F` applies to **temperature intervals**. Absolute temperature
   conversion requires the 32°F offset. The app treats the two differently.
3. For constant-pressure closed systems with only pV work, **heat into the
   system** equals ΔH, including sensible terms. **Heat removed** has the
   opposite sign. The application's equation does not claim that Qin = ΔH
   requires zero temperature change.
4. A 32°F enthalpy zero is a reference choice, distinct from the 298.15 K
   standard formation dataset. All contribution references must be aligned.
5. Low heat capacity amplifies temperature rise for a given heat release; it
   is not itself the thermodynamic cause of heat of dilution.
6. Heat capacity of a body and specific heat capacity per unit mass are
   distinguished in labels and result units.
