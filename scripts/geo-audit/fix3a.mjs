import { readFile, writeFile } from "node:fs/promises";
const p = process.cwd() + "/audit/geo-phase3a-evidence-authority.csv";
let c = await readFile(p, "utf8");
const lines = c.split("\n");
const out = lines.map(l => {
  if (l.startsWith("ti-6al-4v-hardness-data,")) {
    const parts = l.split(",");
    // cols: slug(0) type(1) clarity(2) dataReal(3) source(4) srcReal(5) srcSupports(6) auth(7) party(8) citReady(9) ext(10) stub(11) relMat(12) relProc(13) relStd(14) rec(15)
    parts[1] = "material-property"; parts[2] = "high"; parts[3] = "yes"; parts[5] = "yes"; parts[6] = "yes"; parts[7] = "MEDIUM"; parts[8] = "third"; parts[15] = "CLEAN";
    return parts.join(",");
  }
  return l;
});
await writeFile(p, out.join("\n"), "utf8");
console.log(JSON.stringify({ fixed: out.some(l => l.startsWith("ti-6al-4v-hardness-data,") && l.endsWith(",CLEAN")) }));
