import { readFile, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";
const ROOT = process.cwd();
const walk = async (dir, acc=[]) => { let e; try { e = await readdir(dir, { withFileTypes: true }); } catch { return acc; } for (const x of e) { const p = join(dir, x.name); if (x.isDirectory()) await walk(p, acc); else if (p.endsWith(".astro") || p.endsWith(".ts")) acc.push(p); } return acc; };
const MAP = { "/knowledge/materials/": "/grades/", "/knowledge/processes/": "/processes/", "/knowledge/industries/": "/industries/", "/knowledge/standards/": "/standards/", "/knowledge/surface-finishes/": "/finishes/", "/knowledge/evidence/": "/evidence/", "/knowledge/procurement/": "/procurement/", "/knowledge/cases/": "/compare/", "/knowledge/material-selection/": "/select/", "/knowledge/failure-analysis/": "/failures/", "/knowledge/heat-treatment/": "/heat-treatment/", "/knowledge/corrosion/": "/corrosion/" };
const files = await walk(join(ROOT, "src/pages"));
files.push(join(ROOT, "src/pages/llms.txt.ts"));
let changed = 0;
for (const f of files) { let c = await readFile(f, "utf8"); let orig = c; for (const [k, v] of Object.entries(MAP)) c = c.split(k).join(v); if (c !== orig) { await writeFile(f, c, "utf8"); changed++; console.log("patched", f); } }
console.log("TOTAL_CHANGED", changed);
