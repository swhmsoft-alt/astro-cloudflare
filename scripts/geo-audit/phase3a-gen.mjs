import { readFile, writeFile } from "node:fs/promises";
const ROOT = process.cwd();
// slug -> { type, clarity, dataReal, srcReal, srcSupports, auth, party, rec }
const M = {
 "ti-6al-4v-material-properties": { type: "material-property", clarity: "high", dataReal: "yes", srcReal: "yes", srcSupports: "yes", auth: "HIGH", party: "third", rec: "CITATION_ASSET" },
 "grade-23-material-properties": { type: "material-property", clarity: "high", dataReal: "yes", srcReal: "yes", srcSupports: "yes", auth: "HIGH", party: "third", rec: "CITATION_ASSET" },
 "grade-2-properties": { type: "material-property", clarity: "high", dataReal: "yes", srcReal: "yes", srcSupports: "yes", auth: "MEDIUM", party: "third", rec: "CLEAN" },
 "grade-9-properties": { type: "material-property", clarity: "high", dataReal: "yes", srcReal: "yes", srcSupports: "yes", auth: "MEDIUM", party: "third", rec: "CLEAN" },
 "grade-1-properties": { type: "material-property", clarity: "high", dataReal: "yes", srcReal: "yes", srcSupports: "yes", auth: "MEDIUM", party: "third", rec: "CLEAN" },
 "grade-3-properties": { type: "material-property", clarity: "high", dataReal: "yes", srcReal: "yes", srcSupports: "yes", auth: "MEDIUM", party: "third", rec: "CLEAN" },
 "grade-4-properties": { type: "material-property", clarity: "high", dataReal: "yes", srcReal: "yes", srcSupports: "yes", auth: "MEDIUM", party: "third", rec: "CLEAN" },
 "grade-7-properties": { type: "material-property", clarity: "high", dataReal: "yes", srcReal: "yes", srcSupports: "yes", auth: "MEDIUM", party: "third", rec: "CLEAN" },
 "grade-12-properties": { type: "material-property", clarity: "high", dataReal: "yes", srcReal: "yes", srcSupports: "yes", auth: "MEDIUM", party: "third", rec: "CLEAN" },
 "ti-10-2-3-properties": { type: "material-property", clarity: "high", dataReal: "yes", srcReal: "yes", srcSupports: "yes", auth: "MEDIUM", party: "third", rec: "CLEAN" },
 "grade-5-milling-parameters": { type: "cutting-parameter", clarity: "high", dataReal: "yes", srcReal: "yes", srcSupports: "yes", auth: "MEDIUM", party: "third", rec: "STRENGTHEN" },
 "5-axis-machining-data": { type: "cutting-parameter", clarity: "medium", dataReal: "yes", srcReal: "yes", srcSupports: "yes", auth: "MEDIUM", party: "third", rec: "STRENGTHEN" },
 "cnc-turning-parameters": { type: "cutting-parameter", clarity: "medium", dataReal: "yes", srcReal: "yes", srcSupports: "yes", auth: "MEDIUM", party: "third", rec: "STRENGTHEN" },
 "grade-5-turning-parameters": { type: "cutting-parameter", clarity: "medium", dataReal: "yes", srcReal: "yes", srcSupports: "yes", auth: "MEDIUM", party: "third", rec: "STRENGTHEN" },
 "titanium-drilling-data": { type: "cutting-parameter", clarity: "medium", dataReal: "yes", srcReal: "yes", srcSupports: "yes", auth: "MEDIUM", party: "third", rec: "STRENGTHEN" },
 "wire-edm-parameters": { type: "cutting-parameter", clarity: "medium", dataReal: "yes", srcReal: "yes", srcSupports: "yes", auth: "MEDIUM", party: "third", rec: "STRENGTHEN" },
 "dmls-parameters": { type: "process-capability", clarity: "medium", dataReal: "yes", srcReal: "yes", srcSupports: "yes", auth: "MEDIUM", party: "third", rec: "STRENGTHEN" },
 "grade-5-milling-roughing-data": { type: "cutting-parameter", clarity: "medium", dataReal: "yes", srcReal: "partial", srcSupports: "partial", auth: "LOW", party: "first", rec: "VERIFY_OR_REWRITE" },
 "5-axis-tolerances": { type: "tolerance", clarity: "high", dataReal: "yes", srcReal: "partial", srcSupports: "partial", auth: "MEDIUM", party: "mixed", rec: "VERIFY" },
 "machining-tolerances": { type: "tolerance", clarity: "high", dataReal: "yes", srcReal: "partial", srcSupports: "partial", auth: "MEDIUM", party: "mixed", rec: "VERIFY" },
 "bead-blasting-surface-roughness": { type: "surface-roughness", clarity: "high", dataReal: "yes", srcReal: "yes", srcSupports: "yes", auth: "MEDIUM", party: "third", rec: "CLEAN" },
 "surface-finish-comparison": { type: "surface-roughness", clarity: "high", dataReal: "yes", srcReal: "partial", srcSupports: "partial", auth: "LOW", party: "first", rec: "VERIFY_OR_REWRITE" },
 "titanium-anodizing-properties": { type: "surface-roughness", clarity: "high", dataReal: "yes", srcReal: "partial", srcSupports: "partial", auth: "LOW", party: "first", rec: "VERIFY" },
 "titanium-surface-roughness-standards": { type: "surface-roughness", clarity: "high", dataReal: "yes", srcReal: "yes", srcSupports: "yes", auth: "MEDIUM", party: "third", rec: "CLEAN" },
 "titanium-corrosion-data": { type: "material-property", clarity: "high", dataReal: "yes", srcReal: "yes", srcSupports: "yes", auth: "MEDIUM", party: "third", rec: "CLEAN" },
 "titanium-fatigue-data": { type: "material-property", clarity: "high", dataReal: "yes", srcReal: "yes", srcSupports: "yes", auth: "MEDIUM", party: "third", rec: "CLEAN" },
 "titanium-inspection-data": { type: "inspection", clarity: "high", dataReal: "yes", srcReal: "yes", srcSupports: "partial", auth: "MEDIUM", party: "mixed", rec: "VERIFY" },
 "titanium-welding-data": { type: "process-capability", clarity: "medium", dataReal: "yes", srcReal: "yes", srcSupports: "yes", auth: "MEDIUM", party: "third", rec: "CLEAN" },
 "titanium-cost-data": { type: "cost", clarity: "high", dataReal: "partial", srcReal: "no", srcSupports: "no", auth: "LOW", party: "first", rec: "REWRITE_OR_DROP" },
};
const get = (s, k) => { const m = s.match(new RegExp("^\\s*" + k + ":\\s*(.*)$", "m")); return m ? m[1].trim().replace(/^["']|["']$/g, "") : ""; };
const dir = ROOT + "/src/content/derived/evidence";
const names = await (await import("node:fs/promises")).readdir(dir);
const rows = [];
for (const fn of names.filter(n => n.endsWith(".md"))) { const s = await readFile(dir + "/" + fn, "utf8"); const slug = fn.replace(/\.md$/, ""); const m = M[slug] || {}; const src = get(s, "source"); const url = get(s, "sourceUrl"); const dp = (s.match(/^\s*-\s+property:/gm) || []).length; const ext = url.startsWith("http"); const int = url.startsWith("/"); rows.push({ slug, claim_type: m.type || "", claim_clarity: m.clarity || "", data_point_reality: m.dataReal || "", source: src, source_reality: m.srcReal || "", source_supports_claim: m.srcSupports || "", source_authority: m.auth || "", party: m.party || "", citation_ready: ext ? "YES" : "NO", external_url: ext ? url : "", internal_stub: int ? url : "", related_materials: get(s, "materials").replace(/\[|\]|\"/g, ""), related_processes: get(s, "processes").replace(/\[|\]|\"/g, ""), related_standards: get(s, "relatedStandards").replace(/\[|\]|\"/g, ""), recommendation: m.rec || "REVIEW" }); }
const csv = (rows, cols) => [cols.join(","), ...rows.map(r => cols.map(c => { const v = (r[c] === undefined ? "" : String(r[c])); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(","))].join("\n");
await writeFile(ROOT + "/audit/geo-phase3a-evidence-authority.csv", csv(rows, ["slug","claim_type","claim_clarity","data_point_reality","source","source_reality","source_supports_claim","source_authority","party","citation_ready","external_url","internal_stub","related_materials","related_processes","related_standards","recommendation"]));
const byRec = {}; rows.forEach(r => byRec[r.recommendation] = (byRec[r.recommendation] || 0) + 1);
console.log(JSON.stringify({ total: rows.length, citationReady: rows.filter(r => r.citation_ready === "YES").length, byRecommendation: byRec }, null, 2));
