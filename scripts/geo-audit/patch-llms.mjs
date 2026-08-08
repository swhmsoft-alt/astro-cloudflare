import { readFile, writeFile } from "node:fs/promises";
const p = process.cwd() + "/src/pages/llms.txt.ts";
let c = await readFile(p, "utf8");
const MAP = { "/knowledge/materials": "/grades", "/knowledge/processes": "/processes", "/knowledge/industries": "/industries", "/knowledge/standards": "/standards", "/knowledge/surface-finishes": "/finishes", "/knowledge/material-selection": "/select", "/knowledge/failure-analysis": "/failures", "/knowledge/heat-treatment": "/heat-treatment", "/knowledge/corrosion": "/corrosion", "/knowledge": "/grades" };
let o = c; for (const [k, v] of Object.entries(MAP)) c = c.split(k).join(v);
await writeFile(p, c, "utf8");
console.log(JSON.stringify({ changed: o !== c }));
