import {readFile,stat,readdir} from 'node:fs/promises';
import {join} from 'node:path';
const base='/NitrationThermo-Lab/';
const html=await readFile('dist/index.html','utf8');
const assets=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]).filter(v=>v.startsWith(base));
if(!assets.length)throw new Error('Missing production assets / wrong base path');
for(const asset of assets)await stat(join('dist',asset.slice(base.length)));
const files=await readdir('dist/assets');
for(const file of files){if(!file.endsWith('.css'))continue;const css=await readFile(join('dist/assets',file),'utf8');for(const m of css.matchAll(/url\(([^)]+)\)/g)){const name=m[1].replaceAll(/["']/g,'');if(name.startsWith('data:'))continue;if(/^https?:/.test(name))throw new Error('Remote font asset');const local=name.startsWith(base)?join('dist',name.slice(base.length)):join('dist/assets',name);await stat(local);}}
if(/https?:\/\/.*\.(?:js|css)/.test(html))throw new Error('Remote runtime asset in production HTML');
console.log(`Verified ${assets.length} HTML asset references, local CSS font assets, GitHub Pages base ${base}`);
