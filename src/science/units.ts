import { ScienceError, type UnitDimension } from './types';
import { finite, temperature } from './validation';
export const BTU_IT_KJ = 1.05505585262;
export const BTU_TH_KJ = 1.054350264488889;
export const LB_KG = 0.45359237;
// Internal basis: kg, kJ, mol, K, kW, kg/s, s. ΔT conversions never use an offset.
export const unitFactors: Record<Exclude<UnitDimension,'temperature'>, Record<string, number>> = {
 mass: { kg:1, g:0.001, lb:LB_KG },
 energy: { kJ:1, J:0.001, MJ:1000, cal_th:0.004184, kcal_th:4.184, Btu_IT:BTU_IT_KJ, Btu_th:BTU_TH_KJ },
 specificEnergy: { 'kJ/kg':1,'J/kg':0.001,'cal_th/g':4.184,'Btu_IT/lb':2.326,'Btu_th/lb':BTU_TH_KJ/LB_KG },
 molarEnergy: { 'kJ/mol':1,'J/mol':0.001,'kcal_th/mol':4.184,'kJ/kmol':0.001 },
 cp: { 'kJ/(kg·K)':1,'J/(kg·K)':0.001,'cal_th/(g·K)':4.184,'Btu_IT/(lb·°F)':4.1868,'Btu_th/(lb·°F)':4.184 },
 molarCp: { 'J/(mol·K)':1,'kJ/(mol·K)':1000 },
 molarCpSlope: { 'J/(mol·K²)':1,'kJ/(mol·K²)':1000 },
 cpSlope: { 'kJ/(kg·K²)':1,'J/(kg·K²)':0.001 },
 amount: { mol:1,kmol:1000 }, power:{ kW:1,W:0.001,'kJ/h':1/3600,'Btu_IT/h':BTU_IT_KJ/3600 },
 massFlow: { 'kg/s':1,'kg/h':1/3600,'lb/h':LB_KG/3600 },time:{ s:1,min:60,h:3600 },
 capacity: { 'kJ/K':1,'J/K':0.001 }
};
export function unitsFor(d:UnitDimension):string[] { return d === 'temperature' ? ['°C','K','°F'] : Object.keys(unitFactors[d]); }
export function toBase(n:number,d:UnitDimension,u:string):number {
 finite(n);
 if(d==='temperature') { const k=u==='K'?n:u==='°C'?n+273.15:u==='°F'?(n-32)*5/9+273.15:NaN; return temperature(k); }
 const f=unitFactors[d][u]; if(!f)throw new ScienceError('unknown'); return finite(n*f);
}
export function fromBase(n:number,d:UnitDimension,u:string):number {
 finite(n); if(d==='temperature') { temperature(n); if(u==='K')return n;if(u==='°C')return n-273.15;if(u==='°F')return (n-273.15)*9/5+32;throw new ScienceError('unknown'); }
 const f=unitFactors[d][u]; if(!f)throw new ScienceError('unknown');return n/f;
}
export const convert=(n:number,d:UnitDimension,from:string,to:string)=>fromBase(toBase(n,d,from),d,to);
export function temperatureInterval(n:number,from:'K'|'°C'|'°F',to:'K'|'°C'|'°F') { finite(n);return n*(from==='°F'?5/9:1)/(to==='°F'?5/9:1); }
