import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import golden from './fixtures/pre-redesign-results.json';
import preserved from './fixtures/preserved-file-hashes.json';
import {calculate} from '../src/science/calculate';
import type {FormValues} from '../src/science/types';
// Golden fixtures use JSON, which canonicalizes signed zero exactly like exports.
// File hashes separately guarantee the original floating-point engine is intact.
describe('UI-only redesign preserves original scientific behavior',()=>{
 it.each(golden.map((s,i)=>[i,s] as const))('snapshot %i matches all numbers, steps, labels and plot points',(_i,s)=>{expect(JSON.parse(JSON.stringify(calculate(s.id,s.input as unknown as FormValues)))).toEqual(s.output);});
 it.each(Object.entries(preserved))('%s remains byte-for-byte unchanged',(path,hash)=>{expect(createHash('sha256').update(readFileSync(path)).digest('hex')).toBe(hash);});
});
