import {access, readFile, readdir} from 'node:fs/promises';
import {dirname, join, relative, resolve} from 'node:path';

const projectRoot=resolve(new URL('..',import.meta.url).pathname);
const root=resolve(projectRoot,process.env.SITE_DIR||'dist/preview');
const failures=[];
let references=0;

async function walk(dir){
 const out=[];
 for(const entry of await readdir(dir,{withFileTypes:true})){
  const full=join(dir,entry.name);
  if(entry.isDirectory()) out.push(...await walk(full)); else if(entry.name.endsWith('.html')) out.push(full);
 }
 return out;
}

function internalFile(url){
 const path=url.split('#',1)[0].split('?',1)[0];
 if(!path) return null;
 if(path.startsWith('/')){
  if(path.endsWith('/')) return join(root,path,'index.html');
  return join(root,path);
 }
 return null;
}

const files=await walk(root);
for(const path of files){
 const name=relative(root,path);
 const html=await readFile(path,'utf8');
 const clean=html.replace(/<!--[\s\S]*?-->/g,'');
 const ids=[...clean.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 const dup=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
 if(dup.length) failures.push(`${name}: duplicate IDs ${dup.join(', ')}`);
 if((clean.match(/<main\b/g)||[]).length!==1) failures.push(`${name}: expected exactly one main`);
 if((clean.match(/<h1\b/g)||[]).length!==1) failures.push(`${name}: expected exactly one h1`);
 if(!/<a class="skip-link" href="#main">/.test(clean)) failures.push(`${name}: missing skip link`);
 if(/<script[^>]+src="https?:\/\//i.test(clean)) failures.push(`${name}: remote script`);
 for(const match of clean.matchAll(/<(?:a|img|script|link)\b[^>]*?\b(?:href|src)="([^"]+)"/gi)){
  const target=match[1];
  if(/^(?:https?:|mailto:|tel:|data:)/i.test(target)) continue;
  references++;
  if(target.startsWith('#')){
   if(!ids.includes(target.slice(1))) failures.push(`${name}: missing local fragment ${target}`);
   continue;
  }
  const [url,fragment]=target.split('#',2);
  let destination;
  if(url.startsWith('/')) destination=internalFile(url);
  else destination=resolve(dirname(path),url||name.split('/').at(-1));
  try{await access(destination);}catch{failures.push(`${name}: missing ${target}`);continue;}
  if(fragment && destination.endsWith('.html')){
   const other=await readFile(destination,'utf8');
   if(!new RegExp(`\\bid=["']${fragment.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}["']`).test(other)) failures.push(`${name}: missing target fragment ${target}`);
  }
 }
}

const redirects=await readFile(join(root,'_redirects'),'utf8');
for(const line of redirects.trim().split('\n')){
 const [from,to,status]=line.trim().split(/\s+/);
 if(status!=='301') failures.push(`redirect ${from}: status is not 301`);
 const destination=internalFile(to);
 try{await access(destination);}catch{failures.push(`redirect ${from}: target ${to} missing`);}
}
const sitemap=await readFile(join(root,'sitemap.xml'),'utf8');
if(sitemap.includes('/404/')) failures.push('sitemap includes 404 route');
if(!sitemap.includes('https://fotosafe.weidisoft.net/en/')) failures.push('sitemap missing English home');

if(failures.length){
 console.error(`Site validation failed (${failures.length}):`);
 failures.forEach(item=>console.error(`- ${item}`));
 process.exit(1);
}
console.log(`Site validation passed: ${files.length} HTML files, ${references} local references, ${redirects.trim().split('\n').length} redirects.`);
