import { MW } from './reaction';
import { blend, validateStream } from './mixtures';
import { type Stream, ScienceError } from './types';
import { fraction, nonnegative, positive, finite, temperature } from './validation';
import { nitratorBalance } from './thermal';
export type SpeciesMass = {benzene:number;nitric:number;sulfuric:number;water:number;nitrobenzene:number};
export type IntegratedInput = {benzene:number;acid:Stream;conversion:number;dh:number;mixing:number;ti:number;tf:number;tref:number;cp:SpeciesMass;min:number;max:number;measuredQ?:number};
export function integratedBalance(i:IntegratedInput){
 nonnegative(i.benzene);validateStream(i.acid);fraction(i.conversion);finite(i.dh);finite(i.mixing);[i.ti,i.tf,i.tref].forEach(temperature);
 finite(i.min);finite(i.max);if(i.min<=0 || i.max<i.min || [i.ti,i.tf,i.tref].some(t=>t<i.min || t>i.max))throw new ScienceError('range');
 Object.values(i.cp).forEach(positive);
 const nB=i.benzene*1000/MW.benzene,nN=i.acid.mass*i.acid.nitric*1000/MW.nitric,extent=nB*i.conversion;
 if(extent>nN+1e-9)throw new ScienceError('stoichiometry');
 const initial:SpeciesMass={benzene:i.benzene,nitric:i.acid.mass*i.acid.nitric,sulfuric:i.acid.mass*i.acid.sulfuric,water:i.acid.mass*i.acid.water,nitrobenzene:0};
 const final:SpeciesMass={benzene:Math.max(0,initial.benzene-extent*MW.benzene/1000),nitric:Math.max(0,initial.nitric-extent*MW.nitric/1000),sulfuric:initial.sulfuric,water:initial.water+extent*MW.water/1000,nitrobenzene:extent*MW.nitrobenzene/1000};
 const totalFeed=positive(i.benzene+i.acid.mass),totalFinal=Object.values(final).reduce((a,b)=>a+b,0);
 const sumCapacity=(m:SpeciesMass)=>Object.entries(m).reduce((s,[k,v])=>s+v*i.cp[k as keyof SpeciesMass],0);
 const feedSensible=sumCapacity(initial)*(i.ti-i.tref),productSensible=sumCapacity(final)*(i.tf-i.tref),reaction=extent*i.dh;
 const balance=nitratorBalance(reaction,i.mixing,feedSensible,productSensible);
 const finalAcid=final.nitric+final.sulfuric+final.water;
 return {initial,final,totalFeed,totalFinal,extent,reaction,mixing:i.mixing,feedSensible,productSensible,sensibleDelta:productSensible-feedSensible,...balance,massResidual:totalFinal-totalFeed,massClosure:100*totalFinal/totalFeed,energyResidual:i.measuredQ===undefined?balance.residual:finite(i.measuredQ)-balance.qSystem,maximumConversion:nB?Math.min(1,nN/nB):0,acidComposition:finalAcid?blend([{mass:finalAcid,nitric:final.nitric/finalAcid,sulfuric:final.sulfuric/finalAcid,water:final.water/finalAcid}]):null};
}
