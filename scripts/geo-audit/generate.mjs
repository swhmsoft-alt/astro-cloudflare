import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
const ROOT = process.cwd();
const OUT = join(ROOT, "audit");
const raw = JSON.parse(await readFile(join(OUT, "raw-data.json"), "utf8"));
const entries = raw.entries;
const rendered = new Set(raw.renderedCollections);
const csv = (rows, cols) => [cols.join(","), ...rows.map(r => cols.map(c => { const v = (r[c] === undefined ? "" : String(r[c])); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(","))].join("\n");

const pageCols = ["file","collection","kind","slug","route","locale","title","words","tables","mdLinks","quickAnswer","properties","dataPoints","faqs","checklist","source","sourceUrl","relatedEntityCount","rendered"];
await writeFile(join(OUT, "page-inventory.csv"), csv(entries.map(e => ({ ...e, rendered: rendered.has(e.collection) ? "YES" : "NO" })), pageCols));

const occ = {};
for (const e of entries) for (const ent of (e.entities || [])) { (occ[ent] = occ[ent] || { count: 0, pages: new Set() }); occ[ent].count++; occ[ent].pages.add(e.collection + ":" + e.slug); }
const entRows = Object.entries(occ).map(([name, o]) => ({ entity: name, occurrence: o.count, pageCount: o.pages.size, firstPages: [...o.pages].slice(0, 6).join(" | ") })).sort((a, b) => b.occurrence - a.occurrence);
await writeFile(join(OUT, "entity-inventory.csv"), csv(entRows, ["entity","occurrence","pageCount","firstPages"]));

const epRows = [];
for (const e of entries) for (const ent of (e.entities || [])) epRows.push({ entity: ent, collection: e.collection, page: e.slug, route: e.route, relationship: "related_to" });
await writeFile(join(OUT, "entity-page-matrix.csv"), csv(epRows, ["entity","collection","page","route","relationship"]));

const nodes = new Map(); const edges = [];
for (const e of entries) { const id = e.collection + ":" + e.slug; if (!nodes.has(id)) nodes.set(id, { type: "Page", id, collection: e.collection, route: e.route, locale: e.locale }); for (const ent of (e.entities || [])) { if (!nodes.has(ent)) nodes.set(ent, { type: "Entity", id: ent }); edges.push({ from: id, to: ent, rel: "related_to" }); } }
await writeFile(join(OUT, "knowledge-graph.json"), JSON.stringify({ generatedAt: new Date().toISOString(), nodeCount: nodes.size, edgeCount: edges.length, nodes: [...nodes.values()], edges }, null, 2));

function igScore(e) { let s = 20; if (e.tables >= 1) s += 10; if (e.tables >= 3) s += 10; if (e.quickAnswer) s += 10; if (e.dataPoints) s += 15; if (e.properties) s += 10; if (e.source || e.sourceUrl) s += 15; if (e.checklist) s += 10; if ((e.relatedEntityCount || 0) >= 3) s += 5; if (e.words >= 400) s += 5; if (e.words >= 900) s += 5; if (e.faqs) s += 5; return Math.min(95, s); }
const igRows = entries.map(e => ({ file: e.file, collection: e.collection, slug: e.slug, words: e.words, tables: e.tables, quickAnswer: e.quickAnswer ? 1 : 0, dataPoints: e.dataPoints ? 1 : 0, source: (e.source || e.sourceUrl) ? 1 : 0, score: igScore(e) }));
await writeFile(join(OUT, "information-gain.csv"), csv(igRows, ["file","collection","slug","words","tables","quickAnswer","dataPoints","source","score"]));

function aiScore(e) { let s = 20; if (e.quickAnswer) s += 20; if (e.tables >= 1) s += 15; if (e.words >= 300) s += 10; if (e.faqs) s += 10; if (e.source || e.sourceUrl) s += 15; if (e.checklist || e.dataPoints) s += 10; return Math.min(95, s); }
const aiRows = entries.map(e => ({ file: e.file, collection: e.collection, slug: e.slug, quickAnswer: e.quickAnswer ? 1 : 0, tables: e.tables, faqs: e.faqs ? 1 : 0, source: (e.source || e.sourceUrl) ? 1 : 0, words: e.words, score: aiScore(e) }));
await writeFile(join(OUT, "ai-citation-readiness.csv"), csv(aiRows, ["file","collection","slug","quickAnswer","tables","faqs","source","words","score"]));

const renderedList = raw.renderedCollections.sort();
console.log("generated CSV/JSON artifacts");
