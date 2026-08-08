import { readFile, writeFile } from "node:fs/promises";
const p = process.cwd() + "/src/components/sections/RelatedContent.astro";
let c = await readFile(p, "utf8");
const a = c.replace('["materials", "processes", "industries", "standards", "surfaceFinishes", "evidence", "cases"]', '["materials", "processes", "industries", "standards", "surfaceFinishes", "evidence", "cases", "procurement", "applications"]');
const b = a.replace('  cases: "/cases/",', '  cases: "/cases/",\n  procurement: "/procurement/",\n  applications: "/applications/",');
await writeFile(p, b, "utf8");
console.log(JSON.stringify({ listChanged: c !== a, pathChanged: a !== b }));
