var f = 'c:/Users/User/Desktop/astro-cloudflare-starter-main/src/content/core/processes/5-axis-machining.md';  
var fs = require('fs');  
var t = fs.readFileSync(f, 'utf8');  
t = t.replace('5-Axis CNC Machining for Titanium', 'What Is 5-Axis CNC Machining for Titanium? - Complete Process Guide');  
fs.writeFileSync(f, t, 'utf8');  
console.log('DONE');  
