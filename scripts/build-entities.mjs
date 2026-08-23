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
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const km = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$/);
    if (!km) continue;
    const key = km[1];
    let v = km[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    )
      v = v.slice(1, -1);
    if (v === "" && line.endsWith(":")) { out[key] = []; continue; }
    if (v.startsWith("[") && v.endsWith("]")) {
      try { out[key] = JSON.parse(v.replace(/'/g, '"')); }
      catch { out[key] = v.slice(1, -1).split(",").map((s) => s.trim()); }
      continue;
    }
    if (v === "true") { out[key] = true; continue; }
    if (v === "false") { out[key] = false; continue; }
    out[key] = v;
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
    out.push({
      key: id,
      collection: collection || "unknown",
      url: urlPrefix ? `${urlPrefix}${id}/` : null,
      filePath: relative(ROOT, file).split(sep).join("/"),
      title: fm.title || id,
      exists: true,
      type: isHub ? "hub" : "spoke",
      isHub,
    });
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
  console.log("");
  for (const e of unique) {
    console.log(
      `[${e.collection.padEnd(18)}] ${e.key.padEnd(34)} → ${e.url || "(no URL)"} ${e.isHub ? "[HUB]" : ""}`,
    );
  }
}

main().catch((err) => {
  console.error("build-entities crashed:", err);
  process.exit(1);
});

