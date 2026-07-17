import fs from 'fs';  
import path from 'path';  
const __dirname = path.dirname(new URL(import.meta.url).pathname);  
const dir = path.join(process.cwd(), 'src', 'i18n');  
const enPath = path.join(dir, 'en.json');  
let enRaw = JSON.parse(fs.readFileSync(enPath, 'utf8'));  
enRaw['nav.pricing'] = 'Pricing';  
fs.writeFileSync(enPath, JSON.stringify(enRaw, null, 2) + '\n');  
console.log('Updated en.json with nav.pricing');  
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'en.json');  
for (const f of files) {  
  const fp = path.join(dir, f);  
  let loc = JSON.parse(fs.readFileSync(fp, 'utf8'));  
  let changed = false;  
  for (const key of Object.keys(enRaw)) {  
    if (!(key in loc)) {  
      loc[key] = enRaw[key];  
      changed = true;  
    }  
  }  
  for (const key of Object.keys(loc)) {  
    if (!(key in enRaw)) {  
      delete loc[key];  
      changed = true;  
    }  
  }  
  if (changed) {  
    fs.writeFileSync(fp, JSON.stringify(loc, null, 2) + '\n');  
    console.log('Updated ' + f);  
  } else {  
    console.log(f + ' - OK');  
  }  
} 
