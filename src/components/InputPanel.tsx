import type { Calculator, Field, FormValues, Lang, Stream } from '../science/types';
import {convert,unitsFor} from '../science/units';
import {ui} from '../i18n/ui';
import {Plus,Trash2} from 'lucide-react';
type Props={c:Calculator;v:FormValues;lang:Lang;set:(v:FormValues)=>void};
export function InputPanel({c,v,lang,set}:Props){
 const change=(key:string,value:FormValues[string])=>set({...v,[key]:value});
 const changeUnit=(f:Field,next:string)=>{const previous=String(v[f.key+'Unit']??f.unit);let val=v[f.key];try{if(f.table && Array.isArray(val))val=val.map(s=>({...s,mass:convert(s.mass,'mass',previous,next)}));else if(val!=='' && f.dimension)val=Number(convert(Number(val),f.dimension,previous,next).toPrecision(12));}catch{/* Keep an incomplete or invalid value editable. */}set({...v,[f.key]:val,[f.key+'Unit']:next});};
 const hidden=(key:string)=>{
  if(['cp','cpSlope','tref','tmin','tmax'].includes(key) && v.cpKind==='water' && [4,13,15].includes(c.id))return true;
  if(c.id===11){if(['hi','hf'].includes(key) && v.dilutionMode==='table')return true;if(['enthalpyTable','dryRatio'].includes(key) && v.dilutionMode!=='table')return true;}
  if(c.id===15 && (key==='mass'&&v.basis==='flow' || key==='flow'&&v.basis!=='flow'))return true;
  if(c.id===20 && key==='measuredQ' && v.verifyQ!=='measured')return true;
  return false;
 };
 return <div className="field-grid">{c.fields.filter(f=>!hidden(f.key)).map(f=>f.table?<div className="stream-editor full-width" key={f.key}>
 <div className="stream-heading"><label htmlFor="streams-unit">{f.label[lang]}</label><select id="streams-unit" aria-label={lang==='en'?'Streams mass unit':'وحدة كتلة التيارات'} value={String(v.streamsUnit)} onChange={e=>changeUnit(f,e.target.value)}>{unitsFor('mass').map(u=><option key={u}>{u}</option>)}</select></div>
 {(v.streams as Stream[]).map((s,index)=><fieldset className="stream-row" key={index}><legend>{ui.stream[lang]} {index+1}</legend><div className="stream-fields">{(['mass','nitric','sulfuric','water'] as const).map(key=><label key={key}>{key==='mass'?`${ui.mass[lang]} (${v.streamsUnit})`:key==='nitric'?'HNO₃ (%)':key==='sulfuric'?'H₂SO₄ (%)':'H₂O (%)'}<input type="number" step="any" dir="ltr" aria-label={`${key==='mass'?ui.mass[lang]:key==='nitric'?'HNO₃':key==='sulfuric'?'H₂SO₄':'H₂O'} ${index+1}`} value={key==='mass'?s[key]:Number((s[key]*100).toPrecision(10))} onChange={e=>{const a=structuredClone(v.streams as Stream[]);a[index][key]=Number(e.target.value)/(key==='mass'?1:100);change('streams',a);}}/></label>)}</div><button type="button" className="text-button" disabled={(v.streams as Stream[]).length<=2} onClick={()=>change('streams',(v.streams as Stream[]).filter((_,j)=>j!==index))}><Trash2 size={17}/>{ui.remove[lang]}</button></fieldset>)}
 <button type="button" className="secondary-button" onClick={()=>change('streams',[...(v.streams as Stream[]),{mass:1,nitric:0,sulfuric:0,water:1}])}><Plus size={18}/>{ui.addStream[lang]}</button></div>:
 <div key={f.key} className={`field ${f.text?'full-width':''}`}><label htmlFor={`field-${f.key}`}>{f.label[lang]}</label>{f.options?<select id={`field-${f.key}`} value={String(v[f.key])} onChange={e=>change(f.key,e.target.value)}>{f.options.map(o=><option value={o.value} key={o.value}>{o.label[lang]}</option>)}</select>:f.text?f.key==='enthalpyTable'?<textarea id={`field-${f.key}`} dir="ltr" rows={5} value={String(v[f.key])} onChange={e=>change(f.key,e.target.value)}/>:<input type="text" id={`field-${f.key}`} value={String(v[f.key])} onChange={e=>change(f.key,e.target.value)}/>:<div className="quantity-input" dir="ltr"><input id={`field-${f.key}`} type="number" inputMode="decimal" step="any" dir="ltr" value={v[f.key] as string|number} onChange={e=>change(f.key,e.target.value)}/>{f.dimension&&<select value={String(v[f.key+'Unit']??f.unit)} aria-label={`${f.label[lang]} — ${ui.unit[lang]}`} onChange={e=>changeUnit(f,e.target.value)} dir="ltr">{unitsFor(f.dimension).map(u=><option value={u} key={u}>{u}</option>)}</select>}</div>}{f.help&&<p className="field-help">{f.help[lang]}</p>}</div>)}</div>;
}
