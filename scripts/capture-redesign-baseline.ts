import {writeFileSync,readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {calculators} from '../src/data/calculators';
import {calculate} from '../src/science/calculate';
import type {FormValues} from '../src/science/types';
const snapshots=calculators.map(c=>({id:c.id,name:c.name,input:structuredClone(c.example),output:calculate(c.id,c.example)}));
const variants:[number,Partial<FormValues>][]=[[1,{extent:2.5}],[2,{conversion:0}],[2,{conversion:35}],[3,{hf:25}],[4,{tf:55}],[4,{cpKind:'water'}],[5,{tf:35}],[6,{mWater:7}],[7,{streams:[{mass:12,nitric:.5,sulfuric:.3,water:.2},{mass:8,nitric:.1,sulfuric:.4,water:.5}]}],[8,{addedWater:30}],[9,{mNit:0}],[10,{targetPct:12}],[11,{dilutionMode:'table'}],[12,{reaction:100,mixing:-100}],[13,{conversion:0}],[13,{cpKind:'water'}],[14,{waterPct:40,nitricPct:28,sulfuricPct:32}],[15,{basis:'flow',flow:2}],[16,{productSensible:2000}],[17,{duty:250}],[18,{conversion:0}],[19,{measuredQ:-1000}],[20,{conversion:0}],[20,{verifyQ:'measured',measuredQ:-1200}]];
for(const [id,patch] of variants){const c=calculators[id-1],input={...structuredClone(c.example),...patch} as FormValues;snapshots.push({id,name:c.name,input,output:calculate(id,input)});}
const files=[...readdirSync('src/science').map(f=>'src/science/'+f),...readdirSync('src/data').map(f=>'src/data/'+f),'src/export/report.ts','vite.config.ts','.github/workflows/deploy.yml'];
const hashes=Object.fromEntries(files.map(p=>[p,createHash('sha256').update(readFileSync(p)).digest('hex')]));
writeFileSync('tests/fixtures/pre-redesign-results.json',JSON.stringify(snapshots,null,2));
writeFileSync('tests/fixtures/preserved-file-hashes.json',JSON.stringify(hashes,null,2));
console.log(`Frozen ${snapshots.length} complete result/chart snapshots and ${files.length} scientific/export/deployment file hashes.`);
