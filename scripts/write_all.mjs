const fs = require('fs');  
const b64 = process.argv[2];  
const out = process.argv[3];  
fs.writeFileSync(out, Buffer.from(b64, 'base64'));  
console.log('written:', out); 
