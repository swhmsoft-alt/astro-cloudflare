var fs=require('fs');  
var q=String.fromCharCode(34);  
var LOCS=['en','de','ja','fr','es','pt','it','ko','nl','pl','ru','ar','pt-br','tr','cs','sv'];  
var GSP='\nexport async function getStaticPaths(){return ['+LOCS.map(l=>q+l+q).join(',')+'].map(function(l){return{params:{locale:l},props:{locale:l}}})}';  
var SKIP={'_EntityDetail.astro':1,'_EntityPillar.astro':1,'pages.astro':1,'sections.astro':1};  
function walk(d){var es=fs.readdirSync(d);var out=[];for(var i=0;i<es.length;i++){var p=d+'/'+es[i];if(es[i]==='[locale]')continue;var s=fs.statSync(p);if(s.isDirectory()){out=out.concat(walk(p))}else if(p.endsWith('.astro')){out.push(p)}}return out}  
var files=walk('src/pages');  
var done=0;  
for(var i=0;i<files.length;i++){var src=files[i];var name=src.split('/').pop();if(SKIP[name])continue;var tgt=src.replace('src/pages/','src/pages/[locale]/');var dir=tgt.substring(0,tgt.lastIndexOf('/'));if(!fs.existsSync(dir))fs.mkdirSync(dir,{recursive:true});var c=fs.readFileSync(src,'utf8');c=c.replace('Astro.currentLocale','Astro.props.locale');c=c.split('from '+q+'../').join('from '+q+'../../');if(c.indexOf('getStaticPaths')>=0){c=c.replace('params: { slug: e.id }','params: { slug: e.id, locale: e.data.locale }').replace('params: { slug: e.id.replace(/\\.md$/, '+q+''+q+') }','params: { slug: e.id.replace(/\\.md$/, '+q+''+q+'), locale: e.data.locale }').replace('params: { slug: service.data.slug }','params: { slug: service.data.slug, locale: service.data.locale }');}else{var pos=c.indexOf('\n');c=c.substring(0,pos+1)+GSP+'\n'+c.substring(pos+1);}fs.writeFileSync(tgt,c);done++;console.log('OK: '+tgt.substring(20))}  
