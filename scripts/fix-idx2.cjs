var fs=require('fs');  
var q=String.fromCharCode(34);  
var files=fs.readdirSync('src/pages/[locale]').filter(f=>f.endsWith('.astro')).map(f=>'src/pages/[locale]/'+f);  
function walk(d){var es=fs.readdirSync(d);for(var i=0;i<es.length;i++){var p=d+'/'+es[i];var s=fs.statSync(p);if(s.isDirectory()){walk(p)}else if(p.endsWith('.astro')){files.push(p)}}}  
walk('src/pages/[locale]');  
for(var i=0;i<files.length;i++){var c=fs.readFileSync(files[i],'utf8');var n=c.replace(new RegExp('from'+q+'\\.\\.\\/','g'),'from'+q+'../../');if(c!==n){fs.writeFileSync(files[i],n);console.log('F: '+files[i].substring(20))}}  
