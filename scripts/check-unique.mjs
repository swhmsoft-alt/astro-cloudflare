/**
 * check-unique.mjs — Detect duplicate/ambiguous entities
 */
import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CONTENT = resolve(ROOT, "src", "content");
const COLS = [
  { d: "core/materials", n: "materials" }, { d: "core/processes", n: "processes" },
  { d: "core/standards", n: "standards" }, { d: "core/equipment", n: "equipment" },
  { d: "core/surface-finishes", n: "surfaceFinishes" }, { d: "core/industries", n: "industries" },
  { d: "derived/evidence", n: "evidence" }, { d: "derived/comparisons", n: "comparisons" },
  { d: "derived/cases", n: "cases" }, { d: "derived/guides", n: "guides" },
  { d: "derived/procurement", n: "procurement" }, { d: "applications", n: "applications" },
];
function gf(d) { const p = resolve(CONTENT, d); if (!existsSync(p)) return []; return readdirSync(p).filter(f => f.endsWith(".md")).map(f => ({ slug: f.replace(/.md$/, ""), title: et(resolve(p, f)) })); }
function et(fp) { try { const r = readFileSync(fp, "utf-8"); const m = r.match(/^---\s*\n([\s\S]*?)\n---/); if (!m) return ""; const t = m[1].match(/title:\s*["']?(.+?)["']?(\r?\n|$)/); return t ? t[1].trim().replace(/^"(.+)"$/, "$1") : ""; } catch { return ""; } }
function n(s) { return s.toLowerCase().replace(/[^a-z0-9\u00C0-\u024F]/g, " ").replace(/\s+/g, " ").trim(); }
function sim(a, b) { const wa = new Set(n(a).split(" ").filter(Boolean)); const wb = new Set(n(b).split(" ").filter(Boolean)); if (wa.size === 0 && wb.size === 0) return 1; const inter = new Set([...wa].filter(w => wb.has(w))); return inter.size / (wa.size + wb.size - inter.size); }
let issues = 0;
console.log("\n[check-unique] A — Near-duplicate titles");
for (const { d, n } of COLS) { const f = gf(d); for (let i = 0; i < f.length; i++) for (let j = i + 1; j < f.length; j++) { const s = sim(f[i].title, f[j].title); if (s > 0.80 && s < 1.0) { console.log(`  ⚠  [${n}] "${f[i].title}" ≈ "${f[j].title}" (${(s*100).toFixed(0)}%)`); issues++; } } }
issues === 0 && console.log("  ✓ No near-duplicates");
console.log("\n[check-unique] B — Reverse comparisons");
const cf = gf("derived/comparisons"); const cm = new Map();
for (const f of cf) { const p = f.slug.split("-vs-"); if (p.length === 2) { const k = [p[0], p[1]].sort().join("-vs-"); if (!cm.has(k)) cm.set(k, []); cm.get(k).push(f.slug); } }
for (const [k, s] of cm) { if (s.length > 1) { console.log(`  ⚠  Reverse: ${s.join(" = ")}`); issues++; } }
issues === 0 && console.log("  ✓ No reverse comparisons");
console.log("\n[check-unique] C — Slug collision");
const sm = new Map();
for (const { d, n } of COLS) { for (const f of gf(d)) { if (!sm.has(f.slug)) sm.set(f.slug, []); sm.get(f.slug).push(n); } }
for (const [slug, cols] of sm) { if (cols.length > 1) { console.log(`  ⚠  Slug "${slug}" in: ${cols.join(", ")}`); issues++; } }
issues === 0 && console.log("  ✓ No slug collisions");
issues > 0 ? (console.log(`\n✗ ${issues} issue(s)`), process.exit(1)) : (console.log("\n✓ All unique"), process.exit(0));
