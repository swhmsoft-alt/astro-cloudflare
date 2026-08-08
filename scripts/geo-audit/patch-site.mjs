import { readFile, writeFile } from "node:fs/promises";
const p = process.cwd() + "/astro.config.ts";
let c = await readFile(p, "utf8");
if (c.includes("site: siteConfig.url")) { console.log("ALREADY"); }
else { const a = c.replace("export default defineConfig({", "export default defineConfig({\n  site: siteConfig.url,"); await writeFile(p, a, "utf8"); console.log(JSON.stringify({ changed: a !== c })); }
