import {useId} from 'react';
import type {Lang} from '../science/types';
import {view} from '../i18n/redesign';
export function ObservatoryMark(){return <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true"><rect width="48" height="48" rx="10" fill="#222831"/><path d="M13 13h22M15 13v20q9 7 18 0V13M11 24h6M31 24h6" fill="none" stroke="#FAF9F6" strokeWidth="2"/><path d="M20 32V20m5 12V17m5 15V23" stroke="#E97832" strokeWidth="2.5"/><path d="M11 36h6m16 0h5" stroke="#3D9BC9" strokeWidth="2"/></svg>;}
export function ReactorDiagram({lang,compact=false}:{lang:Lang;compact?:boolean}){
 const uid=useId().replaceAll(':',''),heat=uid+'heat',cool=uid+'cool';
 return <div className={`reactor-diagram ${compact?'compact':''}`}>
 <div className="reactor-caption"><span>{view.schematic[lang]}</span><span aria-hidden="true">ΣH</span></div>
 <svg viewBox="0 0 640 470" role="img" aria-label={lang==='en'?'Educational reactor: heat flows outward into a cooling jacket; coolant enters at the bottom and leaves at the top; T is a symbolic temperature indicator.':'مفاعل تعليمي: تنتقل الحرارة إلى الخارج نحو غلاف التبريد، ويدخل سائل التبريد من أسفل ويخرج من أعلى، وT رمز لمؤشر درجة الحرارة.'}>
 <defs><marker id={heat} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#E97832"/></marker><marker id={cool} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#7CC9EE"/></marker><pattern id={uid+'grid'} width="26" height="26" patternUnits="userSpaceOnUse"><path d="M26 0H0V26" fill="none" stroke="#fff" strokeWidth=".5" opacity=".09"/></pattern></defs>
 <rect width="640" height="470" fill={`url(#${uid}grid)`}/><g fill="none">
 <path d="M168 142v219q0 38 43 38h197q42 0 42-38V142" stroke="#7CC9EE" strokeWidth="3"/><path d="M185 142v211q0 29 31 29h187q30 0 30-29V142" stroke="#7CC9EE" strokeWidth="1.5" opacity=".45"/>
 <rect x="204" y="84" width="210" height="281" rx="54" fill="#30343A" stroke="#F4F1E9" strokeWidth="3"/>
 <path d="M206 229q26-12 52 0t52 0t52 0t50 0v83q0 49-54 49h-96q-54 0-54-49Z" fill="#E97832" fillOpacity=".13" stroke="none"/>
 <path d="M208 231q26-12 52 0t52 0t52 0t47 0" stroke="#E97832" strokeWidth="2"/>
 <path d="M309 45v204m-43 0h86m-75 21h64" stroke="#F4F1E9" strokeWidth="3"/><rect x="285" y="28" width="48" height="26" rx="6" fill="#30343A" stroke="#F4F1E9" strokeWidth="2"/>
 <path d="M115 357h53v-39" stroke="#7CC9EE" strokeWidth="3" markerEnd={`url(#${cool})`}/><path d="M450 161v-53h99" stroke="#7CC9EE" strokeWidth="3" markerEnd={`url(#${cool})`}/><path d="M219 400v26m181-26v26M204 428h212" stroke="#C2C7CE" strokeWidth="3"/>
 <path className="heat-path" d="M248 278h-64" stroke="#E97832" strokeWidth="3" markerEnd={`url(#${heat})`}/><path className="heat-path" d="M367 278h66" stroke="#E97832" strokeWidth="3" markerEnd={`url(#${heat})`}/><path className="heat-path" d="M248 312h-64" stroke="#E97832" strokeWidth="3" markerEnd={`url(#${heat})`}/><path className="heat-path" d="M367 312h66" stroke="#E97832" strokeWidth="3" markerEnd={`url(#${heat})`}/>
 <path d="M456 231h76" stroke="#7CC9EE" strokeWidth="2" markerEnd={`url(#${cool})`}/>
 <path d="M75 198h150" stroke="#E97832" strokeWidth="2" strokeDasharray="6 6" markerEnd={`url(#${heat})`}/>
 <path d="M365 153h115v-67" stroke="#F3B34C" strokeWidth="2"/><rect x="455" y="43" width="52" height="44" rx="7" fill="#30343A" stroke="#F3B34C" strokeWidth="2"/>
 <circle cx="365" cy="153" r="6" fill="#F3B34C" stroke="none"/>
 </g><g fill="#F4F1E9" fontFamily="Inter,sans-serif" fontSize="26"><text x="472" y="74">T</text><text x="47" y="205">Q<tspan baselineShift="sub" fontSize="18">in</tspan></text><text x="539" y="239">Q<tspan baselineShift="sub" fontSize="18">remove</tspan></text></g>
 <g fill="#E97832"><circle cx="260" cy="298" r="4"/><circle cx="290" cy="322" r="3"/><circle cx="330" cy="294" r="4"/><circle cx="351" cy="325" r="3"/></g>
 </svg><div className="reactor-convention" dir="ltr">Q<sub>remove</sub> = −Q<sub>in</sub></div><div className="reactor-legend"><span><i className="legend-vessel"/>{view.vessel[lang]}</span><span><i className="legend-cool"/>{view.jacket[lang]}</span><span><i className="legend-heat"/>{view.heatTransfer[lang]}</span><span><i className="legend-temperature"/>{view.temperature[lang]}</span></div>
 <div className="coolant-notes"><span>↗ {view.coldIn[lang]}</span><span>↗ {view.warmOut[lang]}</span></div></div>;
}
export function CategoryGlyph({group}:{group:number}){
 return <svg viewBox="0 0 100 64" width="88" height="58" fill="none" aria-hidden="true">{group===0?<><path d="M9 8v48h82" stroke="currentColor" opacity=".5"/><path d="M18 20h24l26 24h20" stroke="currentColor" strokeWidth="3"/><path d="M80 25v14m-5-5 5 6 5-6" stroke="currentColor" strokeWidth="2"/></>:group===1?<><path d="M10 15h23v33H10zM65 15h24v33H65z" stroke="currentColor" strokeWidth="2"/><path d="M10 31h23m32 0h24M38 31h21m-6-5 6 5-6 5" stroke="currentColor" strokeWidth="2"/><path d="M14 38h15m40 0h15m-70 5h15m40 0h15" stroke="currentColor" opacity=".6"/></>:group===2?<><path d="M10 44h80M20 21c14-20 15 36 29 17s19-16 31-7" stroke="currentColor" strokeWidth="3"/><path d="M20 54V34m30 20V42m30 12V28" stroke="currentColor" strokeWidth="2" opacity=".5"/></>:<><rect x="28" y="10" width="43" height="43" rx="12" stroke="currentColor" strokeWidth="2"/><path d="M20 16v39h59V16M6 44h14m59-23h15M49 5v27m-9 0h18" stroke="currentColor" strokeWidth="2"/><path d="M40 41H24m34 0h16" stroke="currentColor" strokeWidth="3"/></>}</svg>;
}
export function TopicDiagram({topic,lang}:{topic:string;lang:Lang}){
 if(topic==='cooling')return <ReactorDiagram lang={lang} compact/>;
 return <div className={`topic-diagram topic-${topic}`} role="img" aria-label={`${lang==='en'?'Qualitative energy schematic':'رسم طاقة توضيحي'}: ${topic}`}>
 {topic==='reaction'?<><div className="enthalpy-plot"><span className="axis-H">H</span><div className="enthalpy-level reactant-level"/><div className="enthalpy-drop"><span>ΔHᵣ &lt; 0</span><b>↓</b></div><div className="enthalpy-level product-level"/></div><div className="diagram-labels"><span>{lang==='en'?'Reactants: higher H':'المتفاعلات: إنثالبي أعلى'}</span><span>{lang==='en'?'Products: lower H':'النواتج: إنثالبي أقل'}</span></div></>:
 topic==='dilution'?<><div className="mix-diagram"><div><span>mₐ, hᵢ</span><b>{lang==='en'?'Acid solution':'محلول الأحماض'}</b></div><span className="mix-plus">+</span><div><span>m<sub>w</sub>, h<sub>w</sub></span><b>{lang==='en'?'Water stream':'تيار الماء'}</b></div><span className="mix-arrow">↓</span><div className="mix-final"><span>m𝒻, h𝒻</span><b>{lang==='en'?'Final solution':'المحلول النهائي'}</b></div></div><p className="diagram-footnote">{lang==='en'?'Enthalpy data required — no numerical heat assumed.':'تلزم بيانات إنثالبي — لا تُفترض حرارة عددية.'}</p></>:
 topic==='sensible'?<><div className="temperature-path"><span>Tᵢ</span><div className="temperature-trace"><i/><i/><i/><i/><i/></div><span>T𝒻 &gt; Tᵢ</span></div><div className="stored-energy"><span>+Q</span><b>{lang==='en'?'Sensible energy increase':'زيادة الطاقة المحسوسة'}</b></div><p className="diagram-footnote">Cₚ &gt; 0 · {lang==='en'?'specified single phase':'طور واحد محدد'}</p></>:
 <><div className="balance-diagram"><div><span>ΔHᵣ</span><span>ΔHₘᵢₓ</span><span>ΔHₛₑₙₛ</span></div><b className="balance-arrow">↓</b><strong>Qᵢₙ = ΣΔH</strong><span className="balance-equivalent">Qᵣₑₘₒᵥₑ = −Qᵢₙ</span></div><p className="diagram-footnote">{lang==='en'?'Common reference · each contribution counted once':'مرجع مشترك · كل مساهمة تُحسب مرة واحدة'}</p></>}
 <span className="qualitative-note">{view.qualitative[lang]}</span></div>;
}
