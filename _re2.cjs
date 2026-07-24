var a=require('fs');  
var c=a.readFileSync('src/registry.json','utf8');  
var n=String.fromCharCode(10);  
var sp=String.fromCharCode(32);  
var q=String.fromCharCode(34);  
var lines=c.split(n);  
var out=[]; 
for(var i=0;;i++){if(i>=lines.length)break  
out.push(lines[i])  
if(lines[i].indexOf('Guides Detail')>=0){ 
var entry=sp+sp+sp+sp+'{'+sp+q+'name'+q+':'+sp+q+'Industries Index'+q  
entry+=','+sp+q+'path'+q+':'+sp+q+'src/pages/industries/index.astro'+q 
