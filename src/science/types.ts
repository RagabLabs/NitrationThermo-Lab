export type Lang = 'en' | 'ar';
export type Text = { en: string; ar: string };
export const bi = (en: string, ar: string): Text => ({ en, ar });
export type ErrorCode = 'finite'|'nonnegative'|'positive'|'fraction'|'composition'|'temperature'|'range'|'capacity'|'impossible'|'underdetermined'|'table'|'source'|'phase'|'stoichiometry'|'unknown';
export class ScienceError extends Error { constructor(public code: ErrorCode) { super(code); this.name = 'ScienceError'; } }
export type AcidMass = { hno3: number; h2so4: number; water: number };
export type Stream = { mass: number; nitric: number; sulfuric: number; water: number };
export type CpModel = { kind: 'linear'; c0: number; c1: number; tref: number; min: number; max: number } | { kind: 'water'; min: number; max: number };
export type Metric = { key: string; label: Text; value: number; unit: string };
export type Step = { label: Text; expression: string };
export type PlotPoint = { x: number | string; y: number; y2?: number };
export type ChartSpec = { kind: 'line'|'bar'; title: Text; xLabel: Text; yLabel: Text; series: Text[]; points: PlotPoint[] };
export type Calculation = { metrics: Metric[]; steps: Step[]; interpretation: Text; warnings: Text[]; chart?: ChartSpec; table?: { headers: Text[]; rows: (string|number)[][] }; sourceIds: string[] };
export type FormValues = Record<string, string | number | boolean | Stream[]>;
export type UnitDimension = 'mass'|'energy'|'specificEnergy'|'molarEnergy'|'cp'|'molarCp'|'molarCpSlope'|'cpSlope'|'temperature'|'amount'|'power'|'massFlow'|'time'|'capacity';
export type Field = { key: string; label: Text; value: number|string; dimension?: UnitDimension; unit?: string; min?: number; max?: number; help?: Text; options?: { value: string; label: Text }[]; text?: boolean; table?: boolean };
export type Calculator = { id: number; group: number; name: Text; description: Text; equation: string; fields: Field[]; example: FormValues; assumptions: Text[]; sourceIds: string[] };
