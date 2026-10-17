import type { Calculation, Calculator, Lang, FormValues } from '../science/types';
import { fmt } from '../science/calculate';
import { sources } from '../data/sources';
import { ui, categoryText } from '../i18n/ui';
export function reportText(c:Calculator,r:Calculation,v:FormValues,lang:Lang){
 const lines=[`NitrationThermo Lab — RagabLabs`,`${String(c.id).padStart(2,'0')} · ${c.name[lang]}`,new Date().toISOString(),'',ui.inputs[lang]];
 for(const f of c.fields)lines.push(`${f.label[lang]}: ${Array.isArray(v[f.key])?JSON.stringify(v[f.key]):v[f.key]} ${v[f.key+'Unit']??''}`);
 lines.push('',ui.model[lang],c.equation,'',ui.results[lang],...r.metrics.map(m=>`${m.label[lang]}: ${fmt(m.value)} ${m.unit}`),'',ui.steps[lang],...r.steps.flatMap((s,i)=>[`${i+1}. ${s.label[lang]}`,s.expression]),'',ui.interpret[lang],r.interpretation[lang],'',ui.assumptions[lang],...c.assumptions.map(a=>a[lang]),...r.warnings.map(w=>w[lang]),'',ui.references[lang],...r.sourceIds.map(id=>{const a=sources.find(s=>s.id===id)!;return `${a.title[lang]} — ${a.url} — ${a.note[lang]}`;}),'',ui.safetyText[lang]);return lines.join('\n');
}
const csvCell=(v:unknown)=>'"'+String(v).replaceAll('"','""')+'"';
export function csvReport(c:Calculator,r:Calculation,lang:Lang){
 const rows:unknown[][]=[[c.name[lang]],['RagabLabs'],lang==='en'?['Label','Value','Unit']:['البيان','القيمة','الوحدة'],...r.metrics.map(m=>[m.label[lang],m.value,m.unit])];
 if(r.table)rows.push([],r.table.headers.map(h=>h[lang]),...r.table.rows.map(row=>row.map(v=>typeof v==='string'?categoryText[v]?.[lang]??v:v)));
 if(r.chart)rows.push([],[r.chart.xLabel[lang],...r.chart.series.map(s=>s[lang])],...r.chart.points.map(p=>[typeof p.x==='string'?categoryText[p.x]?.[lang]??p.x:p.x,p.y,...(p.y2===undefined?[]:[p.y2])]));
 return '\uFEFF'+rows.map(row=>row.map(csvCell).join(',')).join('\r\n');
}
export function downloadReport(c:Calculator,r:Calculation,v:FormValues,lang:Lang,format:'json'|'csv'|'txt'){
 const content=format==='json'?JSON.stringify({application:'NitrationThermo Lab',version:'1.0.0',calculator:c.id,name:c.name,generatedAt:new Date().toISOString(),language:lang,input:v,signConvention:ui.sign,modelEquation:c.equation,results:r,assumptions:c.assumptions,sources:sources.filter(s=>r.sourceIds.includes(s.id))},null,2):format==='csv'?csvReport(c,r,lang):reportText(c,r,v,lang);
 const url=URL.createObjectURL(new Blob([content],{type:format==='json'?'application/json':format==='csv'?'text/csv;charset=utf-8':'text/plain;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download=`nitrationthermo-${String(c.id).padStart(2,'0')}-${lang}.${format}`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
