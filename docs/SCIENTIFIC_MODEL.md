# Scientific model and thermodynamic provenance

Version 1.0.0 · RagabLabs · references checked 16 October 2026.

The application is a browser-local educational thermodynamics environment.
It does not prescribe acid mixing operations, reactor setpoints, addition
rates, handling procedures or safety limits. It is not a kinetic, control,
phase-equilibrium or runaway model.

## Sign, system and reference

- The chemical system is the reacting material. Reaction and mixing enthalpies
  are **system changes**, negative for an exothermic contribution.
- `Qin` is heat transferred into that system; cooling removal is `−Qin`.
  A signed removal can be negative (heating). Separate heating/cooling cards
  use `max(Qin,0)` / `max(−Qin,0)`.
- Independent contributions must share one specified reference temperature,
  phase convention and batch basis. All reaction extents are moles of the
  written reaction, not automatically moles of an arbitrary feed species.
- Closed constant-pressure processes with pV work only use `Qin = ΔH`.
  Steady-flow balances use outlet minus inlet enthalpy with negligible kinetic
  and potential energy and no shaft work. Calculator 16 reports a specified
  batch-equivalent energy, not power; Calculator 17 takes actual power.
- Reference reaction enthalpy plus sensible corrections and net mixing
  enthalpy are a **decomposition** of the same energy change, not additional
  chemical energy on top of already-complete absolute product enthalpies.

The complete model decomposition is:

```text
Qin = ξ ΔrH(Tref) + ΔHmix,net(Tref)
      + Σj mf,j ∫Tref^Tout Cp,j dT
      − Σj mi,j ∫Tref^Tin Cp,j dT
```

`ΔHmix,net` must be the final-minus-initial mixing contribution on the same
reference basis and exclude reaction and sensible heat already represented.

## Units and numerical representation

Internal extensive basis: kg, kJ, mol, K, kW, kg/s and s. Specific heat is
kJ/(kg K). Reaction Cp differences are input internally in J/(mol K), and their
integrals are divided by 1000 before combining with kJ/mol reaction enthalpy.

| Conversion | Value |
|---|---:|
| lb → kg | 0.45359237 |
| cal_th → J | 4.184 |
| Btu_IT → kJ | 1.05505585262 |
| Btu_th → kJ | 1.054350264488889 |
| Btu_IT/lb → kJ/kg | 2.326 |
| Btu_IT/(lb °F) → kJ/(kg K) | 4.1868 |
| Absolute °F → K | (°F − 32) × 5/9 + 273.15 |
| Temperature interval °F → K | interval × 5/9 |

The UI converts the existing physical value when an input unit changes.
Output unit changes only affect the selected result display; plots and report
units remain explicitly labeled in their standard output units.

The source lecture reverses the direction of an energy-per-mass conversion.
`1 cal_th/g ≈ 1.79879622 Btu_IT/lb`, while
`1 Btu_IT/lb ≈ 0.55592734 cal_th/g`. IT and thermochemical Btu/calorie
conventions are distinguished rather than mixed silently. Constants derive
from NIST SP 811 Appendix B.8 and the definitions underlying its footnotes:
<https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8>

Numbers use IEEE-754 double precision. Display uses seven significant digits;
exports retain unrounded numeric values. Very small displayed residuals are
shown as zero below 1e−10, while raw exports preserve the residual. Exact
numerical closure is not a measure of experimental/model uncertainty.

## Selected standard liquid formation data

At 298.15 K, standard pure liquid species:

| Species | ΔfH° (kJ/mol) | Reported uncertainty | Selected provenance |
|---|---:|---:|---|
| C6H6(l) | 49.0 | ±0.9 | NIST WebBook; Roux et al., 2008 review |
| HNO3(l) | −173.28 | ±0.18 | Argonne ATcT v1.130; Ruscic & Bross, 2023 |
| C6H5NO2(l) | 12.5 | ±0.54 | NIST WebBook; Lebedeva et al., 1971; Pedley reanalysis, 1986 |
| H2O(l) | −285.830 | ±0.040 | NIST WebBook; CODATA review |

Sources:

- <https://webbook.nist.gov/cgi/cbook.cgi?ID=C71432&Mask=2>
- <https://atct.anl.gov/Thermochemical%20Data/version%201.130/species/?species_number=1208>
- <https://webbook.nist.gov/cgi/cbook.cgi?ID=C98953&Mask=2>
- <https://webbook.nist.gov/cgi/cbook.cgi?ID=C7732185&Mask=2>

Only this explicitly selected small set of values is included. Nitrobenzene’s
source also lists conflicting older records; the selected reanalyzed record
is identified instead of treating the entire page as one recommended value.
Reported uncertainties are retained as source metadata, with their original
source conventions. They are not assumed to be independent standard deviations
or propagated into a falsely precise combined confidence interval.

The balanced reference reaction is:

```text
C6H6(l) + HNO3(l) → C6H5NO2(l) + H2O(l)
ΔrH° = [12.5 − 285.830] − [49.0 − 173.28]
      = −149.05 kJ/mol of reaction
```

The sulfuric-acid component is a spectator in this single-reaction balance.
The model does not infer its acid catalytic activity or ionic speciation.
Standard pure-liquid formation data are not a ternary-solution enthalpy model.

Molar masses used for atom-consistent species mass bookkeeping:
78.1118, 63.0129, 123.1094 and 18.0153 g/mol respectively. The nitric-acid
molar mass is rounded from the external source to a precision consistent with
the other values; reactant and product molar-mass sums both equal
141.1247 g/mol.

## Heat-capacity laws

The custom law is `Cp(T) = c0 + c1 (T − Tref)`, in kJ/(kg K). Its exact
sensible integral is:

```text
Δh = c0 (Tf − Ti) + c1/2 [(Tf − Tref)^2 − (Ti − Tref)^2]
Q = m Δh
```

The user supplies the phase, data provenance and validity interval.
Endpoints of the linear Cp law must remain positive; linearity means this
also enforces positivity throughout the interval. No extrapolation is allowed.
The example acid Cp values and their validity intervals are **synthetic
illustrative model inputs**, not measured mixed-acid correlations.

The optional liquid-water model uses the NIST/Chase (1998) Shomate form:

```text
t = T / 1000
Cp,molar = A + B t + C t² + D t³ + E/t²  [J/(mol K)]
Hprimitive = A t + B t²/2 + C t³/3 + D t⁴/4 − E/t  [kJ/mol]
```

Coefficients: A = −203.6060, B = 1523.290, C = −3196.413,
D = 2474.455, E = 3.855326. The source also reports F = −256.5478,
G = −488.7163 and H = −285.8304; F−H cancels in temperature differences.
Cp is divided by MW = 18.0153 g/mol to yield kJ/(kg K); molar enthalpy
changes are multiplied by `1000/MW` to yield kJ/kg.

The stated coefficient range is **298–500 K**. A maintained liquid phase is
required; pressure and liquid stability are not solved. In particular, the
upper fit range does **not** imply liquid water is stable at 1 bar up to
500 K. The source does not specify a fit uncertainty. The application blocks
outside-range requests even if external metadata is widened.

## Calculator definitions and limits

| # | Equation / calculation | Important condition |
|---|---|---|
| 01 | ΣνΔfH° products − ΣνΔfH° reactants; total = ξ ΔrH° | Fixed atom-balanced liquid reaction; reference 298.15 K |
| 02 | n0 = 1000m/M; ξ = n0 X/ν; ΔHr = ξ ΔrH | 0 ≤ X ≤ 1, ν > 0, sufficient other reactants assumed |
| 03 | ΔH = m(hf − hi) | Shared enthalpy zero and phase; zero-mass extensive change allowed |
| 04 | Q = m∫Cp dT; compare with a second constant-Cp material | Same declared phase/range; no latent heat |
| 05 | ΔrH(T) = ΔrH(Tr) + [ΔCp0 ΔT + b ΔT²/2]/1000 | ΔCp = products − reactants in J/(mol K); user linear law |
| 06 | wi = mi/Σmi | Nonnegative component masses and positive total |
| 07 | mf = Σms; mf wi,f = Σms wi,s | Every stream sums to unity; UI supports ≥2 streams |
| 08 | mf = mi + mw; both acid masses unchanged | Composition only; positive initial stream in UI |
| 09 | A = (mHNO3+mH2SO4)/mtotal | Formal mass acidity, not pH; no-water ratio undefined |
| 10 | madd = mi(wtarget − wi)/(wadd − wtarget) | One selected target; finite nonnegative solution only |
| 11 | ΔHdil = mf hf − ma hi − mw hw | Common zero, same specified isothermal data temperature |
| 12 | ΔH = ΔHr + ΔHdil; release = −ΔH | Shares compare absolute magnitudes, not a possibly cancelling net |
| 13 | m∫Ti^Tad Cp dT = X Qrelease,100% | Prescribed heat at Ti, single phase; no kinetics or phase change |
| 14 | Cp,mix = Σmi Cp,i/Σmi | Ideal mass-weighted approximation, no excess Cp |
| 15 | Batch Q = m∫Cp dT; stream power = ṁ∫Cp dT | Stated phase transition rejects the model instead of omitting latent heat |
| 16 | Qin = ΔHr + ΔHmix + Hsens,out − Hsens,in | No shaft work or accumulation; consistent reference/batch energy basis |
| 17 | ṁwater = cooling power/[Cp (Tout − Tin)] | Tout > Tin; flow does not establish exchanger feasibility |
| 18 | Qin(X) = n0 X ΔrH + a + bX + ΔHsens | User linear mixing model, specified fixed sensible term |
| 19 | Qreq = Hsens,f − Hsens,i + ΔHr + ΔHmix | Normalized initial chemical reference = 0; measured residual = Qmeas − Qreq |
| 20 | Final species = initial + stoichiometric ξ change; full reference energy balance | HNO3 sufficiency checked; constant user Cp; no phase-equilibrium prediction |

### Ternary composition and dilution

The HNO3/H2SO4/H2O names describe **formal mass components**, not free
molecular concentrations, electrolyte speciation, pH or additive volumes.
Each stream must sum to 100% within 1e−8 in fractional units. A finite target
outside the accessible two-stream composition segment is rejected; an
identical initial/added/target composition is reported as underdetermined.

Calculator 11 deliberately contains **no validated ternary property surface**.
Its default enthalpies are synthetic values for demonstrating the balance.
User endpoints require the correct initial and final composition, isothermal
temperature and shared zero. The temperature is checked against user-stated
validity bounds; their provenance remains the user's responsibility.

Table mode interpolates linearly in **total acid mass fraction** along one
fixed dry-basis nitric ratio `mHNO3/(mHNO3+mH2SO4)`. The table must match the
feed's dry ratio and stated temperature. It is not interpolated in temperature
or generalized to another dry ratio. At least two strictly increasing
concentration nodes are required, with finite h in kJ/kg **solution**.
Initial and final concentrations must lie within the table; extrapolation is
rejected. `hw` uses the same enthalpy zero as the table. No constant is assumed
for every concentration and no lecture-graph pixel estimate is silently used.

### Adiabatic numerical solver

Bisection solves the enthalpy integral using 90 iterations over the declared
valid interval, relying on positive Cp for monotonicity. The requested energy
must lie between integral values at the lower and upper bounds. Otherwise no
temperature is returned. The conversion sensitivity plot runs from zero to
the selected conversion and applies the same solver and bounds at each point.
This is an endpoint energy estimate, not a time-domain or runaway simulation.

### Integrated material/energy balance

Let `ξ = (1000 mB / MB) X`. The model rejects `ξ > nHNO3,feed` rather than
clamping the user's requested conversion or returning negative nitric mass.
It retains unreacted benzene and excess nitric acid, conserves sulfuric acid,
and forms one mole each of nitrobenzene and water per mole of reaction.

All five species contribute to initial/final sensible enthalpy using the user
Cp values and actual species masses. The given reaction enthalpy is at Tref.
The user mixing input is a separate **net** reference contribution; it is
added once. No standard formation contribution is also added on top of the
provided reaction enthalpy.

Final overall mass fractions include organics. A separate residual-acid basis
renormalizes nitric acid, sulfuric acid and water only. This bookkeeping basis
is not a prediction of separate acid/organic phases or mutual solubility.

Material residual is `Σmfinal − Σmfeed`; closure percentage is
`100 Σmfinal/Σmfeed`. Default energy closure is algebraic because Qin was
calculated from the balance. The measured mode reports an independent
`Qmeasured − Qrequired` residual. Its absence or numerical zero must not be
presented as experimental validation.

## Interpretation and exclusions

No calculation estimates reaction kinetics, competing products, decomposition,
loss-of-cooling dynamics, phase equilibrium, pressure rise, heat-transfer area,
UA, operating limits, control-system performance or safe acid mixing methods.
Any such conclusions require additional validated data and models.

All custom data must be appropriate to their stated phase, composition,
reference and temperature range. User edits to standard data or reference
conditions transfer that provenance responsibility to the supplied source
entry. The application does not certify third-party datasets.
