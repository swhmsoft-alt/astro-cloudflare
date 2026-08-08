import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, basename } from "node:path";
const ROOT=process.cwd(), OUT=join(ROOT,"audit");
const walk=async(dir)=>{const a=[];const s=async(d)=>{let e;try{e=await readdir(d,{withFileTypes:true});}catch{return;}for(const x of e){const p=join(d,x.name);if(x.isDirectory())await s(p);else if(p.endsWith(".md"))a.push(p);}};await s(dir);return a;};
const csv=(rows,cols)=>[cols.join(","),...rows.map(r=>cols.map(c=>{const v=(r[c]===undefined?"":String(r[c]));return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;}).join(","))].join("\n");
const hasKey=(raw,k)=>{const m=raw.match(new RegExp("^\\s*"+k+":","m"));return !!m;};
const valOf=(raw,k)=>{const m=raw.match(new RegExp("^\\s*"+k+":\\s*(.*)$","m"));return m?m[1].trim().replace(/^["']|["']$/g,""):"";};
// CASES
const cf=await walk(join(ROOT,"src/content/derived/cases"));
const cr=[];
for(const f of cf){const raw=await readFile(f,"utf8");const slug=basename(f).replace(/\.md$/,"");const prov=["source","source_url","sourceUrl","verified","case_type","caseType","source_type","first_party","client","oem","reference","origin"].filter(k=>hasKey(raw,k));cr.push({slug,title:valOf(raw,"title"),industry:valOf(raw,"industry"),application:valOf(raw,"application"),material:valOf(raw,"material"),tolerance:valOf(raw,"tolerance"),quantity:valOf(raw,"quantity"),leadTime:valOf(raw,"leadTime"),hasProvenance:prov.length>0,provenanceKeys:prov.join("|")});}
await writeFile(join(OUT,"cases-reality.csv"),csv(cr,["slug","title","industry","application","material","tolerance","quantity","leadTime","hasProvenance","provenanceKeys"]));
// EVIDENCE
const ef=await walk(join(ROOT,"src/content/derived/evidence"));
const er=[];
for(const f of ef){const raw=await readFile(f,"utf8");const slug=basename(f).replace(/\.md$/,"");const dp=(raw.match(/^\s*-\s+property:/gm)||[]).length;const source=valOf(raw,"source");const sourceUrl=valOf(raw,"sourceUrl");const st=(raw.match(/^\s*-\s+(ASTM|AMS|ISO|AS9100|NADCAP)[A-Z0-9 -]*/gm)||[]).length;er.push({slug,title:valOf(raw,"title"),category:valOf(raw,"evidenceCategory"),source,sourceUrl,standardsHint:st,dataPoints:dp,faqs:(raw.match(/^\s*-\s+question:/gm)||[]).length,citationReady:!!(source&&sourceUrl&&dp>0),hasSource:!!source,hasSourceUrl:!!sourceUrl,hasData:dp>0});}
await writeFile(join(OUT,"evidence-source-reality.csv"),csv(er,["slug","title","category","source","sourceUrl","standardsHint","dataPoints","faqs","citationReady","hasSource","hasSourceUrl","hasData"]));
console.log(JSON.stringify({cases:cr.length,casesWithProvenance:cr.filter(c=>c.hasProvenance).length,evidence:er.length,evidenceWithSource:er.filter(e=>e.hasSource).length,evidenceWithSourceUrl:er.filter(e=>e.hasSourceUrl).length,evidenceWithData:er.filter(e=>e.hasData).length,evidenceCitationReady:er.filter(e=>e.citationReady).length},null,2));
