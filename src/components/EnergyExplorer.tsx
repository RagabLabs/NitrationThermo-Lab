import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,Info} from 'lucide-react';
import type {Lang} from '../science/types';
import {thermalTopics} from '../ui/thermal-content';
import {calculators} from '../data/calculators';
import {view} from '../i18n/redesign';
import {Equation} from './Equation';
import {TopicDiagram} from './ThermalGraphics';
export function EnergyExplorer({lang}:{lang:Lang}){
 const [index,setIndex]=useState(0),refs=useRef<(HTMLButtonElement|null)[]>([]),topic=thermalTopics[index];
 const [horizontal,setHorizontal]=useState(false);
 useEffect(()=>{const query=matchMedia('(min-width:601px) and (max-width:800px)');const update=()=>setHorizontal(query.matches);update();query.addEventListener('change',update);return()=>query.removeEventListener('change',update);},[]);
 const choose=(i:number,focus=false)=>{setIndex(i);if(focus)refs.current[i]?.focus();};
 return <section className="energy-explorer section-space" id="energy"><div className="container"><div className="section-intro"><span className="eyebrow">02 / {view.direction[lang]}</span><h2>{view.energyTitle[lang]}</h2><p>{view.energyIntro[lang]}</p></div><div className="energy-explorer-grid"><div role="tablist" aria-label={view.contribution[lang]} aria-orientation={horizontal?'horizontal':'vertical'} className="energy-topics">{thermalTopics.map((t,i)=><button type="button" role="tab" id={`energy-tab-${t.id}`} aria-controls="energy-panel" aria-selected={index===i} tabIndex={index===i?0:-1} className={index===i?'selected':''} key={t.id} ref={n=>{refs.current[i]=n;}} onClick={()=>choose(i)} onKeyDown={e=>{const forward=e.key==='ArrowDown'||e.key===(lang==='ar'?'ArrowLeft':'ArrowRight'),back=e.key==='ArrowUp'||e.key===(lang==='ar'?'ArrowRight':'ArrowLeft');if(forward||back){e.preventDefault();choose((i+(forward?1:thermalTopics.length-1))%thermalTopics.length,true);}if(e.key==='Home'){e.preventDefault();choose(0,true);}if(e.key==='End'){e.preventDefault();choose(thermalTopics.length-1,true);}}}><span className="topic-number">0{i+1}</span><span className="topic-name">{t.name[lang]}</span><span className="topic-symbol" dir="ltr">{t.tag}</span></button>)}</div><div id="energy-panel" role="tabpanel" aria-labelledby={`energy-tab-${topic.id}`} className={`energy-topic-panel tone-${topic.tone}`} data-testid="energy-topic-panel"><div className="energy-topic-body"><div><span className="section-label">{view.contribution[lang]}</span><h3>{topic.title[lang]}</h3><p>{topic.description[lang]}</p></div><TopicDiagram topic={topic.id} lang={lang}/></div><Equation formula={topic.equation} lang={lang}/><p className="educational-note"><Info size={19}/>{topic.note[lang]}</p><div className="related-tools"><h4>{view.related[lang]}</h4><div>{topic.calculators.map(id=><a href={`#/calculator/${id}`} key={id}><span>{String(id).padStart(2,'0')}</span>{calculators[id-1].name[lang]}<ArrowUpRight size={18}/></a>)}</div></div></div></div></div></section>;
}
