import {useEffect,useRef,useState} from 'react';
import katex from 'katex';
import type {Lang} from '../science/types';
import {view} from '../i18n/redesign';
// Only presentation whitespace/line breaks are inserted. The catalog's original
// formula, scientific engine and exported model strings remain unchanged.
export function equationBlocks(formula:string,lineLength=50):string[]{
 return formula.split(/\\qquad/).map(block=>{
  const clean=block.trim();if(clean.length<lineLength)return clean;
  const terms:string[]=[];let braces=0,parentheses=0,last=0;
  for(let i=0;i<clean.length;i++){
   const ch=clean[i];if(ch==='{')braces++;else if(ch==='}')braces--;else if(ch==='(')parentheses++;else if(ch===')')parentheses--;
   if(i>0&&braces===0&&parentheses===0&&(ch==='+'||ch==='−'||ch==='-')){terms.push(clean.slice(last,i));last=i;}
  }
  terms.push(clean.slice(last));if(terms.length===1)return clean;
  const lines:string[]=[];let current='';for(const term of terms){if(current.length+term.length>lineLength&&current){lines.push(current);current=term;}else current+=term;}if(current)lines.push(current);
  return lines.length>1?String.raw`\begin{aligned}`+lines.map(x=>'&'+x).join(String.raw`\\`)+String.raw`\end{aligned}`:clean;
 });
}
export function Equation({formula,lang='en'}:{formula:string;lang?:Lang}){
 const ref=useRef<HTMLDivElement>(null),[scroll,setScroll]=useState(false),[lineLength,setLineLength]=useState(50);
 useEffect(()=>{const node=ref.current;if(!node)return;const check=()=>setScroll([...node.querySelectorAll<HTMLElement>('.math-line')].some(n=>n.scrollWidth>n.clientWidth+1));const update=()=>{setLineLength(Math.max(35,Math.min(120,Math.floor(node.clientWidth/10))));requestAnimationFrame(check);};const observer=new ResizeObserver(update);observer.observe(node);update();document.fonts?.ready.then(update);return()=>observer.disconnect();},[formula,lineLength]);
 return <div className="equation-container"><div className="equation" dir="ltr" data-testid="equation" ref={ref}>{equationBlocks(formula,lineLength).map((line,i)=><div className="math-line" tabIndex={0} role="group" aria-label={`${lang==='ar'?'تعبير رياضي':'Mathematical expression'} ${i+1}`} key={i} dangerouslySetInnerHTML={{__html:katex.renderToString(line,{throwOnError:false,displayMode:true,strict:'ignore',output:'htmlAndMathml'})}}/>)}</div>{scroll&&<p className="equation-scroll-hint">↔ {view.equationHint[lang]}</p>}</div>;
}
