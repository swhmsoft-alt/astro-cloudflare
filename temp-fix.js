const fs = require('fs');  
const c = fs.readFileSync('src/content.config.ts', 'utf8');  
const idx = c.indexOf('icon: z.string().optional()');  
console.log('found at:', idx);  
