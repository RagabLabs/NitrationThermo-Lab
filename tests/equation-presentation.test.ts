import {describe,it,expect} from 'vitest';
import katex from 'katex';
import {calculators} from '../src/data/calculators';
import {equationBlocks} from '../src/components/Equation';
function tokens(s:string){return s.replaceAll('\\begin{aligned}','').replaceAll('\\end{aligned}','').replaceAll('\\qquad','').replaceAll('\\\\','').replaceAll('&','').replace(/\s/g,'');}
describe('Scientific equations retain every original token after visual reflow',()=>{
 it.each(calculators)('$id — $name.en has identical symbols, order and terms',c=>{for(const limit of [35,50,120]){const blocks=equationBlocks(c.equation,limit);expect(tokens(blocks.join(''))).toBe(tokens(c.equation));for(const block of blocks)expect(()=>katex.renderToString(block,{throwOnError:true})).not.toThrow();}});
});
