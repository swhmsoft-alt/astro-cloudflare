var fs=require('fs');  
var p='src/pages/[locale]/index.astro';echo 'Reading '+p;  
var c=fs.readFileSync(p,'utf8');echo 'Got '+c.length+' chars';  
c=c.replace('from'+String.fromCharCode(34)+'../../../','from'+String.fromCharCode(34)+'../../');echo 'Replaced';  
fs.writeFileSync(p,c);echo 'Written'; 
