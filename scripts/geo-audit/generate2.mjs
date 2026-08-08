import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
const OUT = join(process.cwd(), "audit");
const raw = JSON.parse(await readFile(join(OUT, "raw-data.json"), "utf8"));
const entries = raw.entries;
const rendered = new Set(raw.renderedCollections);
const csv = (rows, cols) => [cols.join(","), ...rows.map(r => cols.map(c => { const v = (r[c] === undefined ? "" : String(r[c])); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(","))].join("\n");
const roleByKind = { Material: "Entity Detail", Process: "Entity Detail", Industry: "Entity Detail", Standard: "Entity Detail", Finish: "Entity Detail", SelectionGuide: "Engineering Decision", FailureMode: "Entity Detail (Problem)", Corrosion: "Entity Detail (Problem)", Evidence: "Evidence", Comparison: "Comparison", Procurement: "Procurement", Guide: "Guide", CaseStudy: "Evidence (CaseStudy)", Application: "Entity Detail (Application)", Blog: "Guide/Other", FAQ: "Reference" };
const stageByKind = { Material: "Requirement/Selection", Process: "Process Selection", Industry: "Requirement", Standard: "Requirement/Certification", Finish: "Design/Finishing", SelectionGuide: "Decision", FailureMode: "Problem", Corrosion: "Problem", Evidence: "Decision/Verification", Comparison: "Decision", Procurement: "Procurement", Guide: "Design/Process", CaseStudy: "Evidence", Application: "Requirement", Blog: "Learn", FAQ: "Learn" };
function igScore(e) { let s = 20; if (e.tables >= 1) s += 10; if (e.tables >= 3) s += 10; if (e.quickAnswer) s += 10; if (e.dataPoints) s += 15; if (e.properties) s += 10; if (e.source || e.sourceUrl) s += 15; if (e.checklist) s += 10; if ((e.relatedEntityCount || 0) >= 3) s += 5; if (e.words >= 400) s += 5; if (e.words >= 900) s += 5; if (e.faqs) s += 5; return Math.min(95, s); }
const pp = entries.map(e => { const isRend = rendered.has(e.collection); let act = "KEEP (rendered)"; if (!isRend) act = e.words < 60 ? "WIRE (thin - deepen then render)" : "WIRE (add route + render)"; else if (e.words < 60) act = "DEEPEN or MERGE"; return { file: e.file, collection: e.collection, slug: e.slug, route: e.route, primary_entity: e.slug, primary_intent: roleByKind[e.kind], page_role: roleByKind[e.kind], target_user: (e.collection === "procurement" ? "Procurement" : e.collection === "materials" || e.collection === "materialSelection" ? "Engineer/Designer" : "Engineer"), decision_stage: stageByKind[e.kind], unique_value: (e.dataPoints || e.source || e.properties) ? "quantitative data" : (e.tables >= 3 ? "structured tables" : e.quickAnswer ? "direct answer" : "reference"), overlap_risk: e.collection === "comparisons" || e.collection === "materialSelection" ? "HIGH (same-entity overlap)" : "LOW", recommended_action: act, info_gain: igScore(e), rendered: isRend ? "YES" : "NO" }; });
await writeFile(join(OUT, "page-purpose-audit.csv"), csv(pp, ["file","collection","slug","route","primary_entity","primary_intent","page_role","target_user","decision_stage","unique_value","overlap_risk","recommended_action","info_gain","rendered"]));
// content-overlap: entries sharing a slug entity across collections
const byEntity = {};
for (const e of entries) (byEntity[e.slug] = byEntity[e.slug] || []).push(e.collection);
const co = Object.entries(byEntity).filter(([slug, cols]) => cols.length > 1 && new Set(cols.map(c => roleByKind[entries.find(x=>x.collection===c&&x.slug===slug).kind])).size > 1).map(([slug, cols]) => ({ entity: slug, collections: cols.join(" | "), recommendation: cols.includes("comparisons") && cols.includes("materials") ? "DIFFERENTIATE (comparison vs definition)" : cols.includes("evidence") ? "KEEP (evidence distinct)" : "REVIEW" }));
await writeFile(join(OUT, "content-overlap.csv"), csv(co, ["entity","collections","recommendation"]));
// internal-link-graph: semantic edges from relations
const edges = new Map();
for (const e of entries) for (const ent of (e.entities || [])) { const k = e.collection + ":" + e.slug + "|" + ent; edges.set(k, { source_url: e.route, target_entity: ent, anchor: e.slug, relationship: "related_to", source_entity: e.slug, contextual_relevance: "high" }); }
await writeFile(join(OUT, "internal-link-graph.csv"), csv([...edges.values()], ["source_url","target_entity","anchor","relationship","source_entity","contextual_relevance"]));
console.log("done2");
