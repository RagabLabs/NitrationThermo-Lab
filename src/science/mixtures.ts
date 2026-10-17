import { type AcidMass, type Stream, ScienceError } from './types';
import { finite, nonnegative, positive, fraction } from './validation';
export function composition(m:AcidMass){Object.values(m).forEach(nonnegative);const total=positive(m.hno3+m.h2so4+m.water);const nitric=m.hno3/total,sulfuric=m.h2so4/total,water=m.water/total;return {...m,total,nitric,sulfuric,waterFraction:water,sum:nitric+sulfuric+water};}
export function validateStream(s:Stream){nonnegative(s.mass);[s.nitric,s.sulfuric,s.water].forEach(fraction);if(Math.abs(s.nitric+s.sulfuric+s.water-1)>1e-8)throw new ScienceError('composition');return s;}
export function blend(streams:Stream[]){if(streams.length<1)throw new ScienceError('composition');streams.forEach(validateStream);return composition(streams.reduce((m,s)=>({hno3:m.hno3+s.mass*s.nitric,h2so4:m.h2so4+s.mass*s.sulfuric,water:m.water+s.mass*s.water}),{hno3:0,h2so4:0,water:0}));}
export function dilute(s:Stream,addedWater:number){validateStream(s);nonnegative(addedWater);const result=blend([s,{mass:addedWater,nitric:0,sulfuric:0,water:1}]);return {...result,ratio:s.mass===0?null:addedWater/s.mass};}
export function acidity(m:AcidMass){const c=composition(m),acid=m.hno3+m.h2so4;return {...c,acid,acidity:acid/c.total,acidWaterRatio:m.water===0?null:acid/m.water,anhydrousNitric:acid===0?null:m.hno3/acid};}
export function targetBlend(initial:Stream,added:Omit<Stream,'mass'>,target:number,component:'nitric'|'sulfuric'|'water'='nitric'){
 validateStream(initial);validateStream({...added,mass:0});positive(initial.mass);fraction(target);
 const a=initial[component],b=added[component];
 if(Math.abs(b-target)<1e-12){if(Math.abs(a-target)<1e-12)throw new ScienceError('underdetermined');throw new ScienceError('impossible');}
 const required=initial.mass*(target-a)/(b-target);if(required < -1e-9)throw new ScienceError('impossible');
 const mass=Math.max(0,required);return {...blend([initial,{...added,mass}]),required:mass};
}
export type EnthalpyPoint={fraction:number;h:number};
export function interpolateEnthalpy(points:EnthalpyPoint[],x:number){
 fraction(x);if(points.length<2)throw new ScienceError('table');
 points.forEach((p,i)=>{fraction(p.fraction);finite(p.h);if(i && p.fraction<=points[i-1].fraction)throw new ScienceError('table');});
 if(x<points[0].fraction || x>points.at(-1)!.fraction)throw new ScienceError('range');
 for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];if(x<=b.fraction)return a.h+(b.h-a.h)*(x-a.fraction)/(b.fraction-a.fraction);}
 throw new ScienceError('range');
}
export function dilutionHeat(mass:number,water:number,hi:number,hw:number,hf:number){positive(mass);nonnegative(water);[hi,hw,hf].forEach(finite);const finalMass=mass+water,initial=mass*hi+water*hw,final=finalMass*hf,delta=final-initial;return {finalMass,initial,final,delta,released:-delta,perMass:-delta/finalMass};}
export function mixtureCp(components:{mass:number;cp:number}[]){if(!components.length)throw new ScienceError('composition');components.forEach(c=>{nonnegative(c.mass);positive(c.cp);});const total=positive(components.reduce((s,c)=>s+c.mass,0)),capacity=components.reduce((s,c)=>s+c.mass*c.cp,0);return {mass:total,cp:capacity/total,capacity,contributions:components.map(c=>c.mass*c.cp)};}
