var fs=require('fs');  
var q=String.fromCharCode(34);  
var b='src/pages/[locale]/knowledge';  
function fx(p,o,n){var c=fs.readFileSync(p,'utf8');c=c.split(o).join(n);fs.writeFileSync(p,c)}  
fx(b+'/materials/[slug].astro',q+'../../_EntityDetail',q+'../../../knowledge/_EntityDetail');  
fx(b+'/processes/[slug].astro',q+'../../_EntityDetail',q+'../../../knowledge/_EntityDetail');  
fx(b+'/materials/index.astro','../../_EntityPillar','../../../knowledge/_EntityPillar');  
fx(b+'/processes/index.astro','../../_EntityPillar','../../../knowledge/_EntityPillar');  
