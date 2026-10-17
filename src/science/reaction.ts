import { finite, nonnegative, positive, fraction, temperature } from './validation';
import { ScienceError } from './types';
// One mole of reaction: C6H6(l) + HNO3(l) -> C6H5NO2(l) + H2O(l).
export const MW = { benzene:78.1118, nitric:63.0129, nitrobenzene:123.1094, water:18.0153 };
export function formationEnthalpy(hf: { benzene:number; nitric:number; nitrobenzene:number; water:number },extent=1) {
 Object.values(hf).forEach(finite);nonnegative(extent);
 const dh=hf.nitrobenzene+hf.water-hf.benzene-hf.nitric;
 return {dh,total:extent===0?0:dh*extent,released:-dh*extent,reactants:hf.benzene+hf.nitric,products:hf.nitrobenzene+hf.water};
}
export function reactionRelease(mass:number,molarMass:number,conversion:number,dh:number,nu=1){
 nonnegative(mass);positive(molarMass);fraction(conversion);finite(dh);positive(nu);
 const initialMoles=mass*1000/molarMass,extent=initialMoles*conversion/nu,total=extent*dh;
 return { initialMoles,extent,total,released:-total,perMass:mass===0?0:-total/mass };
}
export function enthalpyDifference(mass:number,hi:number,hf:number){nonnegative(mass);finite(hi);finite(hf);return {initial:mass*hi,final:mass*hf,delta:mass*(hf-hi)};}
export function kirchhoff(dh0:number,t0:number,t:number,dcp0:number,dcpSlope:number,min:number,max:number){
 [dh0,dcp0,dcpSlope,min,max].forEach(finite);temperature(t0);temperature(t);
 if(min<=0 || max<min || t<min || t>max || t0<min || t0>max)throw new ScienceError('range');
 const dt=t-t0,correction=(dcp0*dt+0.5*dcpSlope*dt*dt)/1000;
 return {dh:dh0+correction,deltaCp:dcp0+dcpSlope*dt,correction};
}
