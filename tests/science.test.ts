import {describe,it,expect} from 'vitest';
import {calculators} from '../src/data/calculators';
import {calculate} from '../src/science/calculate';
import {ScienceError,type FormValues,type CpModel} from '../src/science/types';
import {formationEnthalpy,reactionRelease,enthalpyDifference,kirchhoff,MW} from '../src/science/reaction';
import {composition,blend,dilute,acidity,targetBlend,dilutionHeat,interpolateEnthalpy,mixtureCp} from '../src/science/mixtures';
import {sensible,adiabatic,combined,heatingCooling,nitratorBalance,coolingWater,dutyAtConversion,batchBalance,cpAt} from '../src/science/thermal';
import {integratedBalance,type IntegratedInput} from '../src/science/integrated';
import {convert,temperatureInterval,LB_KG} from '../src/science/units';
const example=(id:number)=>structuredClone(calculators[id-1].example);
const run=(id:number,patch:Partial<FormValues>={})=>calculate(id,{...example(id),...patch} as FormValues);
const metric=(id:number,key:string,patch:Partial<FormValues>={})=>run(id,patch).metrics.find(m=>m.key===key)!.value;
const error=(fn:()=>unknown,code:string)=>{try{fn();throw Error('Expected a scientific validation error');}catch(e){expect(e).toBeInstanceOf(ScienceError);expect((e as ScienceError).code).toBe(code);}};
const cp:CpModel={kind:'linear',c0:2,c1:0.002,tref:298.15,min:273.15,max:373.15};
const acid={mass:10,nitric:.48,sulfuric:.32,water:.2};
const hf={benzene:49,nitric:-173.28,nitrobenzene:12.5,water:-285.83};
const integrated:IntegratedInput={benzene:1,acid:{mass:3,nitric:.361,sulfuric:.628,water:.011},conversion:.75,dh:-149.05,mixing:-100,ti:298.15,tf:318.15,tref:298.15,cp:{benzene:1.7,nitric:1.8,sulfuric:1.5,water:4.184,nitrobenzene:1.5},min:293.15,max:333.15};
// Each calculator gets four distinct numerical/validation checks below,
// plus a physically equivalent input-unit test in the final parameterized suite.
describe('01 Standard reaction enthalpy',()=>{
 it('matches the selected sourced formation data',()=>expect(formationEnthalpy(hf).dh).toBeCloseTo(-149.05,8));
 it('zero extent has no total enthalpy',()=>expect(formationEnthalpy(hf,0).total).toBe(0));
 it('rejects nonfinite formation data',()=>error(()=>formationEnthalpy({...hf,water:NaN}),'finite'));
 it('reaction enthalpy is invariant to elemental reference shifts for balanced atoms',()=>{const shifted={benzene:hf.benzene+6*3+6*2,nitric:hf.nitric+2+5+3*7,nitrobenzene:hf.nitrobenzene+6*3+5*2+5+2*7,water:hf.water+2*2+7};expect(formationEnthalpy(shifted).dh).toBeCloseTo(formationEnthalpy(hf).dh,9);});
});
describe('02 Reaction heat release',()=>{
 it('scales feed mass and incomplete conversion',()=>expect(metric(2,'released')).toBeCloseTo(10*1000/78.1118*.75*149.05,7));
 it('zero conversion gives zero release',()=>expect(metric(2,'released',{conversion:0})).toBe(0));
 it('rejects conversion above 100%',()=>error(()=>run(2,{conversion:101}),'fraction'));
 it('extent respects the reactant stoichiometric coefficient',()=>expect(reactionRelease(1,100,.5,-200,2).extent).toBe(2.5));
});
describe('03 Enthalpy difference',()=>{
 it('matches m times the specific difference',()=>expect(metric(3,'delta')).toBe(350));
 it('equal states give zero difference',()=>expect(enthalpyDifference(10,2,2).delta).toBe(0));
 it('rejects a negative mass',()=>error(()=>enthalpyDifference(-1,0,5),'nonnegative'));
 it('common enthalpy-zero shifts leave the difference invariant',()=>expect(enthalpyDifference(10,980,1015).delta).toBe(enthalpyDifference(10,-20,15).delta));
});
describe('04 Sensible heat',()=>{
 it('integrates linear Cp exactly',()=>expect(metric(4,'q')).toBeCloseTo(404,8));
 it('equal temperatures give zero heat',()=>expect(sensible(10,cp,298.15,298.15).q).toBe(0));
 it('blocks a temperature outside the fit',()=>error(()=>sensible(10,cp,298.15,400),'range'));
 it('reversing the path reverses heat',()=>expect(sensible(10,cp,318.15,298.15).q).toBeCloseTo(-sensible(10,cp,298.15,318.15).q,9));
});
describe('05 Kirchhoff correction',()=>{
 it('integrates a linear reaction Cp difference',()=>expect(metric(5,'dh')).toBeCloseTo(-149.226,8));
 it('the reference temperature returns the original enthalpy',()=>expect(kirchhoff(-100,300,300,5,.1,290,350).dh).toBe(-100));
 it('rejects out-of-range temperatures',()=>error(()=>kirchhoff(-100,300,400,5,0,290,350),'range'));
 it('the derivative equals reaction ΔCp in kJ/mol/K',()=>{const a=kirchhoff(-100,300,310.001,5,.1,290,350),b=kirchhoff(-100,300,309.999,5,.1,290,350);expect((a.dh-b.dh)/.002).toBeCloseTo(.006,7);});
});
describe('06 Component composition',()=>{
 it('recovers 48/32/20 percent',()=>expect(metric(6,'nitric')).toBe(48));
 it('supports pure water as a boundary',()=>expect(composition({hno3:0,h2so4:0,water:2}).waterFraction).toBe(1));
 it('rejects an empty mixture',()=>error(()=>composition({hno3:0,h2so4:0,water:0}),'positive'));
 it('mass fractions sum to unity',()=>expect(composition({hno3:2.3,h2so4:8.7,water:3.6}).sum).toBeCloseTo(1,12));
});
describe('07 Acid blending',()=>{
 it('reproduces the lecture composition path 10 + 15 mass units',()=>expect(metric(7,'nitric')).toBeCloseTo(19.2,10));
 it('a zero-mass second stream does not change composition',()=>expect(blend([acid,{mass:0,nitric:0,sulfuric:0,water:1}]).nitric).toBe(.48));
 it('rejects inconsistent stream fractions',()=>error(()=>blend([{mass:10,nitric:.7,sulfuric:.4,water:.2}]),'composition'));
 it('conserves each component independently',()=>{const o=blend([acid,{mass:5,nitric:.3,sulfuric:.6,water:.1}]);expect(o.hno3).toBeCloseTo(6.3);expect(o.h2so4).toBeCloseTo(6.2);expect(o.water).toBeCloseTo(2.5);expect(o.total).toBe(15);});
});
describe('08 Dilution composition',()=>{
 it('10 plus 15 gives 32% total acid',()=>expect(metric(8,'nitric')+metric(8,'sulfuric')).toBeCloseTo(32,9));
 it('zero added water preserves the initial state',()=>expect(dilute(acid,0).total).toBe(10));
 it('rejects a negative added-water mass',()=>error(()=>dilute(acid,-1),'nonnegative'));
 it('preserves both acid masses at all dilutions',()=>{for(const water of [1,5,50]){const o=dilute(acid,water);expect(o.hno3).toBe(4.8);expect(o.h2so4).toBe(3.2);}});
});
describe('09 Total acidity',()=>{
 it('returns formal total acid mass fraction',()=>expect(metric(9,'acidity')).toBe(80));
 it('reports undefined acid/water ratio at zero water',()=>expect(acidity({hno3:1,h2so4:2,water:0}).acidWaterRatio).toBeNull());
 it('rejects negative component mass',()=>error(()=>acidity({hno3:-1,h2so4:2,water:1}),'nonnegative'));
 it('acid fraction and water fraction close unity',()=>{const o=acidity({hno3:3,h2so4:5,water:4});expect(o.acidity+o.waterFraction).toBeCloseTo(1,12);expect(o.anhydrousNitric).toBe(3/8);});
});
describe('10 Target concentration',()=>{
 it('requires ten mass units of water to halve 48% nitric',()=>expect(metric(10,'required')).toBeCloseTo(10,9));
 it('returns zero addition for an already-achieved unique target',()=>expect(targetBlend(acid,{nitric:0,sulfuric:0,water:1},.48).required).toBe(0));
 it('rejects a target above both streams',()=>error(()=>targetBlend(acid,{nitric:0,sulfuric:0,water:1},.6),'impossible'));
 it('closes the selected component balance',()=>{const o=targetBlend(acid,{nitric:.8,sulfuric:.1,water:.1},.6);expect(o.nitric).toBeCloseTo(.6,12);expect(o.hno3).toBeCloseTo(acid.mass*acid.nitric+o.required*.8,12);});
});
describe('11 Dilution enthalpy',()=>{
 it('computes the declared synthetic endpoint balance',()=>expect(metric(11,'released')).toBeCloseTo(675,9));
 it('a no-dilution identical state has zero enthalpy change',()=>expect(dilutionHeat(10,0,-70,0,-70).delta).toBe(0));
 it('blocks table extrapolation',()=>error(()=>interpolateEnthalpy([{fraction:.2,h:-35},{fraction:.8,h:-70}],.1),'range'));
 it('table and endpoint modes agree at matched endpoint data',()=>expect(metric(11,'released',{dilutionMode:'table'})).toBeCloseTo(metric(11,'released'),9));
});
describe('12 Combined thermal contributions',()=>{
 it('combines signed terms on one energy basis',()=>expect(metric(12,'released')).toBe(1250));
 it('allows exact cancellation without undefined shares',()=>{const o=combined(-100,100);expect(o.delta).toBe(0);expect(o.reactionShare).toBe(.5);});
 it('rejects nonfinite energy input',()=>error(()=>combined(Infinity,-1),'finite'));
 it('absolute shares add to one for a nonzero magnitude',()=>{const o=combined(-300,100);expect(o.reactionShare+o.mixingShare).toBe(1);expect(o.released).toBe(200);});
});
describe('13 Adiabatic estimate',()=>{
 it('solves a constant-Cp hand reference',()=>expect(adiabatic(10,{...cp,c1:0},300,500,.75).tf).toBeCloseTo(318.75,8));
 it('zero conversion returns initial temperature',()=>expect(adiabatic(10,cp,298.15,500,0).tf).toBeCloseTo(298.15,9));
 it('rejects a solution beyond the user validity interval',()=>error(()=>adiabatic(10,cp,298.15,1e6,1),'range'));
 it('the numerical enthalpy integral closes the heat balance',()=>expect(Math.abs(adiabatic(10,cp,298.15,500,.75).residual)).toBeLessThan(1e-8));
});
describe('14 Mixture heat capacity',()=>{
 it('matches an independently weighted mean',()=>expect(metric(14,'cp')).toBeCloseTo(.48*1.8+.32*1.5+.2*4.184,10));
 it('a single component gives its own Cp',()=>expect(mixtureCp([{mass:3,cp:2.5}]).cp).toBe(2.5));
 it('rejects a nonpositive component capacity',()=>error(()=>mixtureCp([{mass:3,cp:0}]),'positive'));
 it('component capacity contributions sum to total',()=>{const o=mixtureCp([{mass:2,cp:1.5},{mass:3,cp:4}]);expect(o.contributions.reduce((a,b)=>a+b,0)).toBe(o.capacity);expect(o.mass*o.cp).toBe(o.capacity);});
});
describe('15 Heating/cooling energy',()=>{
 it('stream mode returns kW rather than batch kJ',()=>expect(metric(15,'q',{basis:'flow',flow:2})).toBeCloseTo(80.8,9));
 it('identical states need no heating or cooling',()=>expect(heatingCooling(10,cp,298.15,298.15).q).toBe(0));
 it('does not silently ignore a phase change',()=>error(()=>heatingCooling(10,cp,298.15,318.15,true),'phase'));
 it('signed heat splits exclusively into heating or cooling',()=>{const o=heatingCooling(10,cp,318.15,298.15);expect(o.heating).toBe(0);expect(o.cooling).toBeCloseTo(404,9);expect(o.q).toBe(o.heating-o.cooling);});
});
describe('16 Isothermal balance',()=>{
 it('includes feed and product sensible terms',()=>expect(metric(16,'cooling')).toBe(1200));
 it('endothermic balance correctly reports heating',()=>expect(nitratorBalance(100,10,0,20).heating).toBe(130));
 it('rejects nonfinite contributions',()=>error(()=>nitratorBalance(0,NaN,0,0),'finite'));
 it('the complete enthalpy balance closes',()=>{const o=nitratorBalance(-1000,-200,100,250);expect(o.qSystem).toBe(-1050);expect(o.residual).toBe(0);expect(o.cooling-o.heating).toBe(-o.qSystem);});
});
describe('17 Cooling water',()=>{
 it('matches power/(Cp ΔT)',()=>expect(metric(17,'flow')).toBeCloseTo(100/(4.184*10),10));
 it('zero heat load requires zero flow',()=>expect(coolingWater(0,4.184,293.15,303.15).flow).toBe(0));
 it('rejects a zero water temperature rise',()=>error(()=>coolingWater(100,4.184,300,300),'positive'));
 it('recovered coolant power equals the specified load',()=>expect(coolingWater(123.4,4.184,294.15,310.15).absorbed).toBeCloseTo(123.4,11));
});
describe('18 Duty versus conversion',()=>{
 it('uses declared conversion-dependent mixing',()=>expect(metric(18,'cooling')).toBeCloseTo(1317.875,9));
 it('zero conversion retains a mixing and sensible intercept',()=>expect(dutyAtConversion(10,-100,0,-50,-200,10).signedRemoval).toBe(40));
 it('rejects a negative conversion',()=>error(()=>dutyAtConversion(10,-100,-.1,0,0,0),'fraction'));
 it('curve slope agrees with the specified analytic derivative',()=>{const a=dutyAtConversion(10,-100,.2,-50,-200,10),b=dutyAtConversion(10,-100,.7,-50,-200,10);expect((b.signedRemoval-a.signedRemoval)/.5).toBeCloseTo(1200,10);});
});
describe('19 Batch energy balance',()=>{
 it('compares independent measured heat with the requirement',()=>expect(metric(19,'residual')).toBe(0));
 it('identical nonreacting states require zero heat',()=>expect(batchBalance(100,100,0,0,0).requiredQ).toBe(0));
 it('rejects nonfinite measured heat',()=>error(()=>batchBalance(100,100,0,0,NaN),'finite'));
 it('a measurement mismatch survives the algebraic balance',()=>{const o=batchBalance(100,250,-1000,-200,-1000);expect(o.requiredQ).toBe(-1050);expect(o.residual).toBe(50);expect(o.final-o.initial).toBe(o.requiredQ);});
});
describe('20 Integrated balance',()=>{
 it('reaction extent matches feed mass and conversion',()=>expect(metric(20,'extent')).toBeCloseTo(1000/78.1118*.75,10));
 it('zero conversion consumes no acid and forms no product',()=>{const o=integratedBalance({...integrated,conversion:0});expect(o.final.nitric).toBe(o.initial.nitric);expect(o.final.nitrobenzene).toBe(0);});
 it('rejects HNO3-limited impossible conversion',()=>error(()=>integratedBalance({...integrated,acid:{mass:1,nitric:.01,sulfuric:.8,water:.19}}),'stoichiometry'));
 it('closes mass and verifies a separately supplied heat',()=>{const o=integratedBalance(integrated);expect(o.totalFinal).toBeCloseTo(o.totalFeed,12);expect(o.massClosure).toBeCloseTo(100,10);expect(o.final.sulfuric).toBe(o.initial.sulfuric);const checked=integratedBalance({...integrated,measuredQ:o.qSystem+10});expect(checked.energyResidual).toBeCloseTo(10,10);});
});
// One numerical input-unit invariance check for every calculator, including
// different unit dimensions and a multiple-stream common-mass-unit change.
const unitCases:[number,string,string,string][]=[
 [1,'hfB','J/mol','dh'],[2,'mass','lb','released'],[3,'hi','cal_th/g','delta'],[4,'tf','°F','q'],[5,'dcp','kJ/(mol·K)','dh'],[6,'mNit','g','nitric'],[7,'streams','lb','nitric'],[8,'addedWater','lb','nitric'],[9,'mWater','g','acidity'],[10,'acidMass','lb','required'],[11,'hf','Btu_IT/lb','released'],[12,'reaction','J','released'],[13,'released','Btu_IT','final'],[14,'cpN','J/(kg·K)','cp'],[15,'cp','Btu_IT/(lb·°F)','q'],[16,'feedSensible','MJ','cooling'],[17,'duty','W','flow'],[18,'n0','kmol','cooling'],[19,'measuredQ','Btu_th','residual'],[20,'tf','°F','q']
];
describe('Physical input-unit invariance for all 20 calculators',()=>{
 it.each(unitCases)('calculator %i: %s converted to %s preserves %s',(id,key,unit,resultKey)=>{const c=calculators[id-1],v=example(id),f=c.fields.find(f=>f.key===key)!;if(key==='streams'){v.streams=(v.streams as typeof acid[]).map(s=>({...s,mass:convert(s.mass,'mass','kg',unit)}));}else{v[key]=convert(Number(v[key]),f.dimension!,String(v[key+'Unit']),unit);}v[key+'Unit']=unit;const before=metric(id,resultKey);expect(calculate(id,v).metrics.find(m=>m.key===resultKey)!.value).toBeCloseTo(before,7);});
});
// Additional regression checks from lecture review and numerical edge cases.
describe('Reference and robustness regressions',()=>{
 it('corrects the reversed lecture Btu/lb ↔ cal/g factor',()=>{expect(convert(1,'specificEnergy','Btu_IT/lb','cal_th/g')).toBeCloseTo(2.326/4.184,12);expect(convert(1,'specificEnergy','cal_th/g','Btu_IT/lb')).toBeCloseTo(1.7987962167,9);});
 it('keeps thermochemical and International Table Btu distinct',()=>expect(convert(1,'energy','Btu_IT','kJ')).not.toBe(convert(1,'energy','Btu_th','kJ')));
 it('temperature differences do not include an absolute offset',()=>expect(temperatureInterval(18,'°F','K')).toBe(10));
 it('converts absolute Fahrenheit correctly',()=>expect(convert(71.6,'temperature','°F','K')).toBeCloseTo(295.15,12));
 it('matches the inspected lecture dilution mass basis in lb',()=>{const a={mass:10*LB_KG,nitric:.48,sulfuric:.32,water:.2};const o=dilute(a,15*LB_KG);expect(o.total).toBeCloseTo(25*LB_KG,12);expect(o.nitric).toBeCloseTo(.192,12);});
 it('keeps the lecture reaction heat separate from standard formation data',()=>{const perMol=convert(790.6,'specificEnergy','Btu_IT/lb','kJ/kg')*MW.benzene/1000;expect(perMol).toBeCloseTo(143.64256980008,7);expect(perMol).not.toBeCloseTo(149.05,1);});
 it('NIST Shomate water Cp matches approximately 4.18 kJ/kg/K near 298.15 K',()=>expect(cpAt({kind:'water',min:298,max:500},298.15)).toBeCloseTo(4.184,1));
 it('Shomate integral has the derivative Cp',()=>{const w:CpModel={kind:'water',min:298,max:500};expect(sensible(1,w,300,300.001).q/.001).toBeCloseTo(cpAt(w,300.0005),5);});
 it('Shomate range is enforced even when caller widens metadata',()=>error(()=>cpAt({kind:'water',min:200,max:600},250),'range'));
 it('negative Cp inside a linear interval is rejected at its endpoint',()=>error(()=>sensible(1,{...cp,c1:-1},298.15,320),'positive'));
 it('rejects duplicate concentration nodes',()=>error(()=>interpolateEnthalpy([{fraction:.2,h:-1},{fraction:.2,h:-2}],.2),'table'));
 it('rejects table/acid dry-ratio mismatch',()=>error(()=>run(11,{dilutionMode:'table',dryRatio:50}),'composition'));
 it('rejects unknown source provenance',()=>error(()=>run(11,{sourceName:''}),'source'));
 it('rejects an enthalpy comparison without reference',()=>error(()=>run(3,{referenceName:''}),'source'));
 it('distinguishes nonunique and unreachable concentration targets',()=>error(()=>targetBlend(acid,{nitric:.48,sulfuric:.32,water:.2},.48),'underdetermined'));
 it('no-reaction integrated mass model conserves both sensible paths',()=>{const o=integratedBalance({...integrated,conversion:0,mixing:0,ti:300,tf:300});expect(o.qSystem).toBeCloseTo(0,12);});
 it('integrated stoichiometry conserves C, H, N, O, S atoms',()=>{const o=integratedBalance(integrated);const atoms=(m:typeof o.initial)=>{const b=m.benzene*1000/MW.benzene,n=m.nitric*1000/MW.nitric,p=m.nitrobenzene*1000/MW.nitrobenzene,w=m.water*1000/MW.water,s=m.sulfuric*1000/98.079;return [6*(b+p),6*b+n+5*p+2*w+2*s,n+p,3*n+2*p+w+4*s,s];};atoms(o.initial).forEach((a,j)=>expect(atoms(o.final)[j]).toBeCloseTo(a,10));});
 it('all 20 example pathways produce finite metrics and chart values',()=>{for(const c of calculators){const r=calculate(c.id,structuredClone(c.example));r.metrics.forEach(m=>expect(Number.isFinite(m.value)).toBe(true));r.chart?.points.forEach(p=>{expect(Number.isFinite(p.y)).toBe(true);if(p.y2!==undefined)expect(Number.isFinite(p.y2)).toBe(true);});}});
});
describe('Effective average thermal storage',()=>{it('average capacity times adiabatic rise recovers the prescribed heat',()=>{const o=adiabatic(10,cp,298.15,500,.75);expect(o.effectiveCapacity*o.deltaT).toBeCloseTo(375,10);expect(o.effectiveCapacity).toBeLessThan(o.capacity);});});
