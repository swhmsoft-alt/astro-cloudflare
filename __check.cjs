var fs = require("fs");
var t = fs.readFileSync("src/pages/well-known/llms.txt.ts", "utf8");
var lines = t.split("\n");
console.log("Total lines:", lines.length);
console.log("Line 24:", JSON.stringify(lines[23]));
console.log("Line 25:", JSON.stringify(lines[24]));
var chr = lines[23].charCodeAt(lines[23].length - 1);
console.log("Line 24 last char code:", chr, "char:", JSON.stringify(String.fromCharCode(chr)));