import { readFileSync, writeFileSync, readdirSync } from \"node:fs\"; 
import { join } from \"node:path\";  
  
const dir = join(process.cwd(), \"src/i18n\");  
const enRaw = JSON.parse(readFileSync(join(dir, \"en.json\"), \"utf8\"));  
const enKeys = Object.keys(enRaw);  
  
const files = readdirSync(dir).filter(f=> f.endsWith(\".json\") && f !== \"en.json\"); 
for (const f of files) {  
  const loc = JSON.parse(readFileSync(join(dir, f), \"utf8\"));  
  let changed = false;  
  
  for (const key of enKeys) {  
    if (!(key in loc)) {  
      loc[key] = enRaw[key];  
      changed = true;  
    }  
  } 
  
  for (const key of Object.keys(loc)) {  
    if (!(key in enRaw)) {  
      delete loc[key];  
      changed = true;  
      console.log(\"  Removed extra key \" + key + \" from \" + f);  
    }  
  } 
  
  if (changed) {  
    const sorted = {};  
    for (const key of enKeys) {  
      if (key in loc) sorted[key] = loc[key];  
    }  
    for (const key of Object.keys(loc)) {  
      if (!(key in sorted)) sorted[key] = loc[key];  
    }  
    writeFileSync(join(dir, f), JSON.stringify(sorted, null, 2) + \"\n\");  
    console.log(\"Updated \" + f + \" -- added missing keys\");  
  } else {  
    console.log(f + \" -- already in sync\");  
  }  
} 
