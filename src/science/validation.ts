import { ScienceError } from './types';
export const finite = (n: number) => { if (!Number.isFinite(n)) throw new ScienceError('finite'); return n; };
export const nonnegative = (n: number) => { finite(n); if (n < 0) throw new ScienceError('nonnegative'); return n; };
export const positive = (n: number) => { finite(n); if (n <= 0) throw new ScienceError('positive'); return n; };
export const fraction = (n: number) => { finite(n); if (n < 0 || n > 1) throw new ScienceError('fraction'); return n; };
export const temperature = (n: number) => { finite(n); if (n <= 0) throw new ScienceError('temperature'); return n; };
export const source = (s: string) => { if (!s.trim()) throw new ScienceError('source'); return s; };
