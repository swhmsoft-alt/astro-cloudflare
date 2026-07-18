var fs=require('fs');  
var q=String.fromCharCode(34);  
var o1='Astro.currentLocale';  
var n1='Astro.props.locale';  
function fx(p){var c=fs.readFileSync(p,'utf8');c=c.split(q+'../../').join(q+'../../../').split(o1).join(n1);fs.writeFileSync(p,c);console.log(p)}  
fx('src/pages/[locale]/knowledge/cases.astro');  
fx('src/pages/[locale]/knowledge/evidence.astro');  
fx('src/pages/[locale]/knowledge/materials/index.astro');  
fx('src/pages/[locale]/knowledge/processes/index.astro');  
