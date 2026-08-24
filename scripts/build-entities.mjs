#!/usr/bin/env node
/**
 * build-entities.mjs
 *
 * Scans src/content/{core,derived,applications}/**\/*.md and emits a JSON
 * snapshot of every entity the site knows about: { key, collection,
 * url, filePath, title, exists, type }.
 *
 * Snapshot is written to scripts/audit/lib/.entities-snapshot.json so that
 * scripts/check-internal-links.mjs and the audit pipeline share one source
 * of truth. The script also prints a compact table to stdout.
 *
 * Usage:
 *   node scripts/build-entities.mjs
 *   node scripts/build-entities.mjs --json out.json
 */

import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, relative, sep, basename } from "node:path";
import {
  extractAliases,
  deriveSearchTerms,
  extractRelationships,
  extractFrontmatterKeys,
} from "./lib/relationships.mjs";

const ROOT = process.cwd();

const CONTENT_ROOTS = [
  "src/content/core/materials",
  "src/content/core/processes",
  "src/content/core/industries",
  "src/content/core/standards",
  "src/content/core/surface-finishes",
  "src/content/core/equipment",
  "src/content/core/heat-treatment",
  "src/content/core/failure-analysis",
  "src/content/core/selection",
  "src/content/core/corrosion",
  "src/content/derived/evidence",
  "src/content/derived/comparisons",
  "src/content/derived/procurement",
  "src/content/derived/guides",
  "src/content/derived/cases",
  "src/content/applications",
];

const COLLECTION_URL_PREFIX = {
  materials: "/grades/",
  processes: "/processes/",
  industries: "/industries/",
  standards: "/standards/",
  surfaceFinishes: "/finishes/",
  equipment: "/equipment/",
  heatTreatment: "/heat-treatment/",
  failureAnalysis: "/failure-analysis/",
  materialSelection: "/selection/",
  corrosion: "/corrosion/",
  evidence: "/evidence/",
  comparisons: "/comparisons/",
  procurement: "/procurement/",
  guides: "/guides/",
  cases: "/cases/",
  applications: "/applications/",
  blog: "/blog/",
};

// collection-prefix slug → collection-name (for "standards" → standards)
// explicit aliases for dirs whose slug != collection name
const DIR_TO_COLLECTION = {
  materials: "materials",
  processes: "processes",
  industries: "industries",
  standards: "standards",
  "surface-finishes": "surfaceFinishes",
  equipment: "equipment",
  "heat-treatment": "heatTreatment",
  "failure-analysis": "failureAnalysis",
  selection: "materialSelection",
  corrosion: "corrosion",
  evidence: "evidence",
  comparisons: "comparisons",
  procurement: "procurement",
  guides: "guides",
  cases: "cases",
  applications: "applications",
};

function contentDirToCollection(dirRel) {
  const parts = dirRel.split(/[\\/]/);
  return DIR_TO_COLLECTION[parts[parts.length - 1]] || null;
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return {};
  const out = {};
  const lines = m[1].split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) { i++; continue; }
    const km = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$/);
    if (!km) { i++; continue; }
    const key = km[1];
    let v = km[2].trim();
    // YAML block sequence: empty value + following lines start with "  - "
    if (v === "" && i + 1 < lines.length && /^\s*-\s/.test(lines[i + 1])) {
      const items = [];
      i++;
      while (i < lines.length && /^\s*-\s/.test(lines[i])) {
        const item = lines[i].replace(/^\s*-\s+/, "").trim();
        items.push(item.replace(/^["']|["']$/g, ""));
        i++;
      }
      out[key] = items;
      continue;
    }
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    )
      v = v.slice(1, -1);
    if (v === "" && line.endsWith(":")) { out[key] = []; i++; continue; }
    if (v.startsWith("[") && v.endsWith("]")) {
      try { out[key] = JSON.parse(v.replace(/'/g, '"')); }
      catch { out[key] = v.slice(1, -1).split(",").map((s) => s.trim()); }
      i++; continue;
    }
    if (v === "true") { out[key] = true; i++; continue; }
    if (v === "false") { out[key] = false; i++; continue; }
    out[key] = v;
    i++;
  }
  return out;
}

async function* walk(dir) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); }
  catch { return; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile() && /\.mdx?$/.test(e.name)) yield p;
  }
}

async function scanOneContentRoot(relRoot) {
  const absRoot = join(ROOT, relRoot);
  const collection = contentDirToCollection(relRoot);
  const urlPrefix = collection ? COLLECTION_URL_PREFIX[collection] : null;
  const out = [];
  for await (const file of walk(absRoot)) {
    const raw = await readFile(file, "utf8");
    const fm = parseFrontmatter(raw);
    const id = basename(file).replace(/\.mdx?$/, "");
    const isHub = fm.isHub === true || /^_hub\b/.test(id);
    const aliases = extractAliases(fm);
    const relationships = extractRelationships(fm);
    const entity = {
      key: id,
      collection: collection || "unknown",
      url: urlPrefix ? `${urlPrefix}${id}/` : null,
      filePath: relative(ROOT, file).split(sep).join("/"),
      title: fm.title || id,
      exists: true,
      type: isHub ? "hub" : "spoke",
      isHub,
      aliases,
      searchTerms: [], // filled below once key+title+aliases are settled
      relationships,
      frontmatterKeys: extractFrontmatterKeys(fm),
    };
    entity.searchTerms = deriveSearchTerms(entity);
    out.push(entity);
  }
  return out;
}

async function main() {
  const entities = [];
  for (const root of CONTENT_ROOTS) {
    try {
      const found = await scanOneContentRoot(root);
      entities.push(...found);
    } catch (err) {
      console.error("scan failed for", root, err.message);
    }
  }

  const seen = new Map();
  for (const e of entities) if (!seen.has(e.filePath)) seen.set(e.filePath, e);
  const unique = [...seen.values()].sort((a, b) =>
    a.collection.localeCompare(b.collection) || a.key.localeCompare(b.key),
  );

  const snap = {
    generatedAt: new Date().toISOString(),
    count: unique.length,
    byCollection: unique.reduce((acc, e) => {
      acc[e.collection] = (acc[e.collection] || 0) + 1;
      return acc;
    }, {}),
    entities: unique,
  };
  await writeFile(
    join(ROOT, "scripts/audit/lib/.entities-snapshot.json"),
    JSON.stringify(snap, null, 2),
  );

  const args = process.argv.slice(2);
  const jsonFlag = args.indexOf("--json");
  if (jsonFlag !== -1 && args[jsonFlag + 1]) {
    await writeFile(args[jsonFlag + 1], JSON.stringify(unique, null, 2));
    console.log("wrote " + args[jsonFlag + 1]);
    return;
  }

  console.log("=== entity registry ===");
  console.log("total:", unique.length);
  console.log("by collection:", JSON.stringify(snap.byCollection));
  const withAliases = unique.filter((e) => (e.aliases || []).length > 0).length;
  const withRelations = unique.filter(
    (e) => e.relationships && Object.keys(e.relationships).length > 0,
  ).length;
  const totalRefEdges = unique.reduce(
    (n, e) =>
      n +
      (e.relationships
        ? Object.values(e.relationships).reduce((s, arr) => s + arr.length, 0)
        : 0),
    0,
  );
  console.log("with aliases       :", withAliases);
  console.log("with relationships :", withRelations);
  console.log("total ref edges    :", totalRefEdges);
  console.log("");
  for (const e of unique) {
    const relKeys = e.relationships
      ? Object.keys(e.relationships).join(",")
      : "";
    console.log(
      `[${e.collection.padEnd(18)}] ${e.key.padEnd(34)} → ${e.url || "(no URL)"} ${e.isHub ? "[HUB]" : ""} ${relKeys ? `(${relKeys})` : ""}`,
    );
  }
}

main().catch((err) => {
  console.error("build-entities crashed:", err);
  process.exit(1);
});

