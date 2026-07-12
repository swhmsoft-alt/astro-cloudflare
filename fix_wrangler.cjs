const fs = require("fs");
const path = "c:\\Users\\User\\Desktop\\astro-cloudflare-starter-main\\wrangler.jsonc";
let content = fs.readFileSync(path, "utf8");
content = content.replace(/\t"r2_buckets":\s*\[[\s\S]*?\]\s*,?\s*/g, "");
fs.writeFileSync(path, content, "utf8");
console.log("Done");

