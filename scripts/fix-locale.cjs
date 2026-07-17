var fs=require('fs');  
var q=String.fromCharCode(34);  
var src=q+'../../../';  
var dst=q+'../../../../';  
var files=['src/pages/[locale]/knowledge/cases/[slug].astro','src/pages/[locale]/knowledge/evidence/[slug].astro'];  
for(var i=0;i<files.length;i++){var p=files[i];var c=fs.readFileSync(p,'utf8');var n=c.split(src).join(dst);if(c!==n){fs.writeFileSync(p,n);console.log('FIXED: '+p)}else{console.log('NO CHANGE: '+p)}}  
