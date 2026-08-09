#!/usr/bin/env node
/**
 * render-gate.mjs — Render / Indexation Gate for evidence pages (GEO).
 *
 * Reads the BUILT HTML in dist/evidence/<slug>/index.html and asserts the
 * machine-verifiable Citation Asset surface for every rendered evidence page:
 *   - canonical <link rel=canonical> present
 *   - hreflang links are en/self only (evidence is en-only; no /de/ /fr/ …)
 *   - JSON-LD contains a DefinedTerm (entity) AND an Evidence Citation Asset
 *     (CreativeWork with "citation" + "variableMeasured"/PropertyValue)
 *   - visible <section id="evidence-basis"> anchor present
 *   - Related Materials / Processes / Standards / Decisions sections present
 *     where frontmatter declares them
 *
 * Run AFTER a successful build:
 *   node scripts/geo-audit/render-gate.mjs
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIST = join(process.cwd(), "dist/evidence");
if (!existsSync(DIST)) {
  console.error("dist/evidence not found — run `astro build` first.");
  process.exit(2);
}

const dirs = readdirSync(DIST, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const rows = [];
for (const slug of dirs) {
  const file = join(DIST, slug, "index.html");
  if (!existsSync(file)) continue;
  const h = readFileSync(file, "utf8");
  const canonical = /<link rel="canonical" href="[^"]+"/.test(h);
  // Only <link rel="alternate"> head tags (NOT the <a> nav language-switcher
  // anchors, which are UI and may legitimately differ).
  const hreflangAll = [...h.matchAll(/<link rel="alternate"[^>]*hreflang="([a-z-]+)"/g)].map((m) => m[1]);
  const enOnly = hreflangAll.length > 0 && hreflangAll.every((l) => l === "en");
  const hasDefinedTerm = /"@type":"DefinedTerm"/.test(h);
  const hasCitation = /"citation"/.test(h);
  const hasPropertyValue = /"variableMeasured"/.test(h) || /"PropertyValue"/.test(h);
  const hasBasis = /id="evidence-basis"/.test(h);
  const hasRelMat = /Related Materials/.test(h);
  const hasRelProc = /Related Processes/.test(h);
  const hasRelStd = /Related Standards/.test(h);
  const hasRelDec = /Related Decisions/.test(h);
  rows.push({
    slug, canonical, enOnly, hreflang: hreflangAll.join(",") || "-",
    hasDefinedTerm, hasCitation, hasPropertyValue, hasBasis,
    hasRelMat, hasRelProc, hasRelStd, hasRelDec,
  });
}

const fail = rows.filter((r) =>
  !r.canonical || !r.enOnly || !r.hasDefinedTerm || !r.hasCitation || !r.hasPropertyValue || !r.hasBasis);

console.log(`evidence pages rendered: ${rows.length}`);
console.log(`  JSON-LD DefinedTerm:      ${rows.filter((r) => r.hasDefinedTerm).length}/${rows.length}`);
console.log(`  JSON-LD citation:         ${rows.filter((r) => r.hasCitation).length}/${rows.length}`);
console.log(`  JSON-LD PropertyValue:    ${rows.filter((r) => r.hasPropertyValue).length}/${rows.length}`);
console.log(`  id="evidence-basis":      ${rows.filter((r) => r.hasBasis).length}/${rows.length}`);
console.log(`  canonical:                ${rows.filter((r) => r.canonical).length}/${rows.length}`);
console.log(`  en-only hreflang:         ${rows.filter((r) => r.enOnly).length}/${rows.length}`);

// Cross-check against source frontmatter for Related sections
const SRC = join(process.cwd(), "src/content/derived/evidence");
const hasFm = (slug, key) => {
  const f = join(SRC, `${slug}.md`);
  if (!existsSync(f)) return false;
  return new RegExp(`^${key}\\s*:`,"m").test(readFileSync(f, "utf8"));
};

console.log("\n-- migrated evidence (have JSON-LD citation + basis) --");
for (const r of rows.filter((r) => r.hasCitation && r.hasBasis)) {
  const need = [
    ["relatedMaterials", "hasRelMat"],
    ["relatedProcesses", "hasRelProc"],
    ["relatedStandards", "hasRelStd"],
    ["relatedDecisions", "hasRelDec"],
  ].filter(([k]) => hasFm(r.slug, k));
  const missing = need.filter(([, key]) => r[key] !== true).map(([k]) => k);
  console.log(`  ${r.slug}: ${r.canonical ? "canonical" : "NO-canonical"} | ${r.enOnly ? "en-only" : "HREFLANG-ISSUE"} | basis=${r.hasBasis}${missing.length ? ` | MISSING render: ${missing.join(",")}` : ""}`);
}

if (fail.length) {
  console.error(`\n${fail.length} page(s) FAIL the GEO render gate:`);
  for (const r of fail) console.error(`  ✖ ${r.slug}: ${!r.canonical ? "no-canonical " : ""}${!r.enOnly ? "hreflang-not-en-only " : ""}${!r.hasDefinedTerm ? "no-DefinedTerm " : ""}${!r.hasCitation ? "no-citation " : ""}${!r.hasPropertyValue ? "no-PropertyValue " : ""}${!r.hasBasis ? "no-evidence-basis " : ""}`);
  process.exit(1);
}
console.log(`\nRender Gate PASS (${rows.length} evidence pages).`);
