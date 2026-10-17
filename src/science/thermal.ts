import { type CpModel, ScienceError } from './types';
import { finite, nonnegative, positive, temperature, fraction } from './validation';
const A=-203.606,B=1523.290,C=-3196.413,D=2474.455,E=3.855326;
const waterPrimitive=(T:number)=>{const t=T/1000;return A*t+B*t*t/2+C*t*t*t/3+D*t*t*t*t/4-E/t;};
export function cpAt(m:CpModel,t:number){
 temperature(t);finite(m.min);finite(m.max);if(m.min<=0 || m.max<m.min || t<m.min || t>m.max)throw new ScienceError('range');
 if(m.kind==='water'){if(t<298 || t>500)throw new ScienceError('range');const v=t/1000;return positive((A+B*v+C*v*v+D*v*v*v+E/v/v)/18.0153);}
 [m.c0,m.c1,m.tref].forEach(finite);return positive(m.c0+m.c1*(t-m.tref));
}
export function sensible(mass:number,m:CpModel,ti:number,tf:number){
 nonnegative(mass);cpAt(m,ti);cpAt(m,tf);
 const specific=m.kind==='water'?(waterPrimitive(tf)-waterPrimitive(ti))*1000/18.0153:m.c0*(tf-ti)+0.5*m.c1*((tf-m.tref)**2-(ti-m.tref)**2);
 return {q:mass*specific,specific,deltaT:tf-ti};
}
export function combined(reactionEnthalpy:number,mixingEnthalpy:number){finite(reactionEnthalpy);finite(mixingEnthalpy);const delta=reactionEnthalpy+mixingEnthalpy,totalMagnitude=Math.abs(reactionEnthalpy)+Math.abs(mixingEnthalpy);return {delta,released:-delta,reactionShare:totalMagnitude?Math.abs(reactionEnthalpy)/totalMagnitude:0,mixingShare:totalMagnitude?Math.abs(mixingEnthalpy)/totalMagnitude:0};}
export function adiabatic(mass:number,m:CpModel,ti:number,heatRelease:number,conversion=1){
 positive(mass);finite(heatRelease);fraction(conversion);cpAt(m,ti);cpAt(m,m.min);cpAt(m,m.max);
 const target=heatRelease*conversion;
 const lowEnergy=sensible(mass,m,ti,m.min).q,highEnergy=sensible(mass,m,ti,m.max).q;
 if(target<lowEnergy || target>highEnergy)throw new ScienceError('range');
 let lo=m.min,hi=m.max;for(let i=0;i<90;i++){const mid=(lo+hi)/2;if(sensible(mass,m,ti,mid).q<target)lo=mid;else hi=mid;}
 const tf=(lo+hi)/2;return {tf,deltaT:tf-ti,capacity:mass*cpAt(m,tf),effectiveCapacity:Math.abs(tf-ti)<1e-12?mass*cpAt(m,ti):target/(tf-ti),absorbed:sensible(mass,m,ti,tf).q,residual:sensible(mass,m,ti,tf).q-target};
}
export function heatingCooling(mass:number,m:CpModel,ti:number,tf:number,phaseChange=false){if(phaseChange)throw new ScienceError('phase');const r=sensible(mass,m,ti,tf);return {...r,heating:Math.max(r.q,0),cooling:Math.max(-r.q,0)};}
export function nitratorBalance(reaction:number,mixing:number,feedSensible:number,productSensible:number){[reaction,mixing,feedSensible,productSensible].forEach(finite);const qSystem=reaction+mixing+productSensible-feedSensible;return {qSystem,cooling:Math.max(-qSystem,0),heating:Math.max(qSystem,0),signedRemoval:-qSystem,residual:qSystem-reaction-mixing-productSensible+feedSensible};}
export function coolingWater(duty:number,cp:number,ti:number,tf:number){nonnegative(duty);positive(cp);temperature(ti);temperature(tf);if(tf<=ti)throw new ScienceError('positive');const deltaT=tf-ti,flow=duty/(cp*deltaT);return {flow,deltaT,absorbed:flow*cp*deltaT};}
export function dutyAtConversion(n0:number,dh:number,x:number,mix0:number,mixSlope:number,sensibleDelta:number){nonnegative(n0);finite(dh);fraction(x);[mix0,mixSlope,sensibleDelta].forEach(finite);const reaction=n0*x*dh,mixing=mix0+mixSlope*x;return {...nitratorBalance(reaction,mixing,0,sensibleDelta),reaction,mixing};}
export function batchBalance(hiSensible:number,hfSensible:number,reaction:number,mixing:number,measuredQ:number){[hiSensible,hfSensible,reaction,mixing,measuredQ].forEach(finite);const final=hfSensible+reaction+mixing,initial=hiSensible,requiredQ=final-initial;return {initial,final,reaction,mixing,requiredQ,residual:measuredQ-requiredQ};}
