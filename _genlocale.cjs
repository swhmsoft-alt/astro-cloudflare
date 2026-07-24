var a=require('fs');var c=a.readFileSync('src/pages/industries/index.astro','utf8');  
c=c.replace('Astro.currentLocale','Astro.props.locale');  
c=c.replace('../../layouts','../../../layouts');  
c=c.replace('../../i18n','../../../i18n');  
c=c.replace('../../config','../../../config');  
c=c.replace('../../lib','../../../lib');  
c=c.replace('---','---\n\nexport async function getStaticPaths(){return [\"en\",\"de\",\"ja\",\"fr\",\"es\",\"pt\",\"it\",\"ko\",\"nl\",\"pl\",\"ru\",\"ar\",\"pt-br\",\"tr\",\"cs\",\"sv\"].map(function(l){return{params:{locale:l},props:{locale:l}}})}');  
a.writeFileSync('src/pages/[locale]/industries/index.astro',c);  
console.log('Locale page created'); 
