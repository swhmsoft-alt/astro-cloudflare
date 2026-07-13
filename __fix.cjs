var fs = require("fs");
var bs = String.fromCharCode(92);
var fs_c = String.fromCharCode(47); // forward slash
// Fix line 5: replace(//$/) -> replace(/\/$/)
var c = fs.readFileSync("src/pages/well-known/llms.txt.ts", "utf8");
c = c.replace("replace(/" + bs + "$/", "replace(" + fs_c + bs + "$/");
fs.writeFileSync("src/pages/well-known/llms.txt.ts", c, "utf8");
console.log("Fixed. Line 5:", JSON.stringify(c.split("\n")[4]));