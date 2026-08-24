#!/usr/bin/env node
/**
 * audit-entity-coverage.mjs
 *
 * Measures how well each entity in the snapshot is "covered" by the rest of
 * the site — i.e. how many downstream files reference it by URL, by search
 * term, or via JSON-LD. Writes a per-entity report to:
 *
 *   scripts/audit/lib/.coverage-report.json
 *   scripts/audit/lib/.coverage-report.md
 *
 * Source of truth:
 *   scripts/audit/lib/.entities-snapshot.json
 *
 * Coverage formula (carried over from the reference-doc spec):
 *   score = min(100, mentions * 0.4 + links * 5 + jsonld * 3)
 *
 * Scan roots (deliberately excludes the source content MD files themselves,
 * so "the file mentions itself" doesn't inflate scores):
 *   src/pages/**
 *   src/components/**
 *   src/lib/**
 *
 * Usage:
 *   node scripts/audit-entity-coverage.mjs
 *   node scripts/audit-entity-coverage.mjs --top 50
 *   node scripts/audit-entity-coverage.mjs --missing         # only entities with score === 0
 *   node scripts/audit-entity-coverage.mjs --strict          # exit 1 if any score < 25
 *   node scripts/audit-entity-coverage.mjs --zero-only       # exit 1 if any score === 0
 *
 * Flags:
 *   --soft            Exit 0 always. Default.
 *   --strict          Exit 1 if any entity score < 25.
 *   --zero-only       Exit 1 only if any entity score === 0. The intended
 *                     CI gate: trips when a published content entry has zero
 *                     downstream references in pages/components/lib, but does
 *                     NOT trip on the 195 low-coverage (1–24) entities that
 *                     `--strict` would block. Use this in `pnpm lint`.
 *   --top N           Print top N highest-coverage entities in the MD report.
 *   --missing         Only emit entities with zero coverage.
 */

import { readFile, writeFile, readdir, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const SNAPSHOT_PATH = join(
  ROOT,
  "scripts/audit/lib/.entities-snapshot.json",
);
const REPORT_JSON = join(ROOT, "scripts/audit/lib/.coverage-report.json");
const REPORT_MD = join(ROOT, "scripts/audit/lib/.coverage-report.md");

const SCAN_ROOTS = ["src/pages", "src/components", "src/lib"];
const SKIP_DIRS = new Set(["node_modules", "dist", ".astro", ".cache", "coverage"]);
const SCAN_EXTS = new Set([".astro", ".ts", ".tsx", ".mjs", ".js", ".jsx", ".md", ".mdx", ".json"]);

const SCORE_FORMULA = "min(100, mentions * 0.4 + links * 5 + jsonld * 3)";

function computeScore({ mentionsCount, linkCount, jsonldRefs }) {
  return Math.min(
    100,
    mentionsCount * 0.4 + linkCount * 5 + jsonldRefs * 3,
  );
}

// ─── file walk ─────────────────────────────────────────────────────────────
async function* walk(dir) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); }
  catch { return; }
  for (const e of entries) {
    if (SKIP_DIRS.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile()) {
      const dot = e.name.lastIndexOf(".");
      if (dot === -1) continue;
      const ext = e.name.slice(dot);
      if (SCAN_EXTS.has(ext)) yield p;
    }
  }
}

// ─── mention counting ──────────────────────────────────────────────────────
// Build inverted index: lowercased search term → Set<entityIndex>. This lets
// us scan each file once with a single sorted-keyword regex.
//
// For URL matches we keep a separate map: any entity URL like
// "/materials/grade-5-titanium/" appearing in a file counts as one link.
function buildIndex(snapshot) {
  const termToKeys = new Map();
  const urlToIdx = new Map();
  for (let i = 0; i < snapshot.entities.length; i++) {
    const e = snapshot.entities[i];
    if (e.url) urlToIdx.set(e.url, i);
    for (const term of e.searchTerms || []) {
      if (!termToKeys.has(term)) termToKeys.set(term, new Set());
      termToKeys.get(term).add(i);
    }
  }
  // Sort terms longest-first so "titanium-anodizing" beats "titanium" if both
  // appear in a file; longer matches are more specific.
  const sortedTerms = [...termToKeys.keys()].sort((a, b) => b.length - a.length);
  return { termToKeys, urlToIdx, sortedTerms };
}

// Build a single regex that matches any indexed term as a word.
// Negative lookbehind/ahead for [a-z0-9] prevents matching "grade-5" inside
// "grade-5x"; for terms containing hyphens, the hyphen itself separates.
function buildTermRegex(sortedTerms) {
  if (sortedTerms.length === 0) return null;
  const escaped = sortedTerms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(
    `(?<![a-z0-9])(${escaped.join("|")})(?![a-z0-9])`,
    "gi",
  );
}

// Pull every JSON-LD block out of a file. We don't try to parse JSON here;
// matching an entity URL inside the raw JSON-LD string is enough for coverage.
function findJsonLdBlocks(content) {
  const blocks = [];
  const re = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(content)) !== null) blocks.push(m[1]);
  return blocks;
}
// ─── main ──────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const flag = (n) => args.includes(n);
  const argVal = (n, def) => {
    const i = args.indexOf(n);
    return i === -1 ? def : args[i + 1];
  };
  const onlyTop = Number(argVal("--top", "25")) || 25;
  const onlyMissing = flag("--missing");
  const strict = flag("--strict");
  const zeroOnly = flag("--zero-only");

  const raw = await readFile(SNAPSHOT_PATH, "utf8");
  const snap = JSON.parse(raw);
  const entities = snap.entities;

  const { termToKeys, sortedTerms } = buildIndex(snap);
  const termRegex = buildTermRegex(sortedTerms);

  // Per-entity accumulators
  const mentionsCount = new Array(entities.length).fill(0);
  const linkCount = new Array(entities.length).fill(0);
  const jsonldRefs = new Array(entities.length).fill(0);
  const filesMentioned = entities.map(() => []);
  let filesScanned = 0;

  for (const root of SCAN_ROOTS) {
    const absRoot = join(ROOT, root);
    try { await stat(absRoot); }
    catch { continue; }
    for await (const file of walk(absRoot)) {
      filesScanned++;
      let content;
      try { content = await readFile(file, "utf8"); }
      catch { continue; }
      const lc = content.toLowerCase();
      const relFile = relative(ROOT, file).split(sep).join("/");

      // 1. JSON-LD block scan (separate from term regex so we attribute
      //    references specifically to ld+json without double-counting).
      const ldBlocks = findJsonLdBlocks(content);
      for (const block of ldBlocks) {
        const blockLc = block.toLowerCase();
        for (let i = 0; i < entities.length; i++) {
          const u = entities[i].url;
          if (!u) continue;
          if (blockLc.includes(u.toLowerCase())) jsonldRefs[i]++;
        }
      }

      // 2. Term mention scan — count each entity once per file (presence, not density).
      if (termRegex) {
        const mentionedThisFile = new Set();
        let m;
        termRegex.lastIndex = 0;
        while ((m = termRegex.exec(lc)) !== null) {
          const owners = termToKeys.get(m[0].toLowerCase());
          if (!owners) continue;
          for (const idx of owners) mentionedThisFile.add(idx);
        }
        for (const idx of mentionedThisFile) {
          mentionsCount[idx]++;
          if (!filesMentioned[idx].includes(relFile)) filesMentioned[idx].push(relFile);
        }
      }

      // 3. URL link scan — usually rendered anchors or @id references.
      for (let i = 0; i < entities.length; i++) {
        const u = entities[i].url;
        if (!u) continue;
        if (lc.includes(u.toLowerCase())) linkCount[i]++;
      }
    }
  }

  // Enrich + score
  const enriched = entities.map((e, i) => ({
    key: e.key,
    collection: e.collection,
    url: e.url,
    title: e.title,
    aliases: e.aliases || [],
    mentionsCount: mentionsCount[i],
    linkCount: linkCount[i],
    jsonldRefs: jsonldRefs[i],
    filesMentioned: filesMentioned[i],
    coverageScore: Math.round(computeScore({
      mentionsCount: mentionsCount[i],
      linkCount: linkCount[i],
      jsonldRefs: jsonldRefs[i],
    }) * 10) / 10,
  }));
  enriched.sort((a, b) => b.coverageScore - a.coverageScore);
  // Aggregate
  const total = enriched.length;
  const sum = enriched.reduce((s, e) => s + e.coverageScore, 0);
  const avg = total > 0 ? sum / total : 0;
  const sortedScores = enriched.map((e) => e.coverageScore).sort((a, b) => a - b);
  const median = total > 0 ? sortedScores[Math.floor(total / 2)] : 0;
  const high = enriched.filter((e) => e.coverageScore >= 75).length;
  const medium = enriched.filter((e) => e.coverageScore >= 25 && e.coverageScore < 75).length;
  const low = enriched.filter((e) => e.coverageScore < 25).length;

  const byCollection = {};
  for (const e of enriched) {
    const c = e.collection || "unknown";
    if (!byCollection[c]) byCollection[c] = { entityCount: 0, sumScore: 0 };
    byCollection[c].entityCount++;
    byCollection[c].sumScore += e.coverageScore;
  }
  for (const c of Object.keys(byCollection)) {
    byCollection[c].averageCoverage = Math.round(
      (byCollection[c].sumScore / byCollection[c].entityCount) * 10,
    ) / 10;
    delete byCollection[c].sumScore;
  }

  const report = {
    generatedAt: new Date().toISOString(),
    snapshotGeneratedAt: snap.generatedAt,
    totalEntities: total,
    filesScanned,
    scanRoots: SCAN_ROOTS,
    formula: SCORE_FORMULA,
    scores: {
      averageCoverage: Math.round(avg * 10) / 10,
      medianCoverage: Math.round(median * 10) / 10,
      high,
      medium,
      low,
    },
    byCollection,
    entities: enriched,
  };

  // Filter for output (CLI flags)
  let outEntities = enriched;
  if (onlyMissing) outEntities = enriched.filter((e) => e.coverageScore === 0);
  const topSlice = outEntities.slice(0, onlyTop);

  // ─── JSON output ───────────────────────────────────────────────────────
  const jsonOut = {
    ...report,
    _filter: onlyMissing ? "missing" : "all",
    _topN: onlyTop,
  };
  if (onlyMissing) jsonOut.entities = outEntities;
  await writeFile(REPORT_JSON, JSON.stringify(jsonOut, null, 2));

  // ─── MD output ─────────────────────────────────────────────────────────
  const lines = [];
  lines.push(`# Entity Coverage Report`);
  lines.push("");
  lines.push(`- Generated: \`${report.generatedAt}\``);
  lines.push(`- Snapshot: \`${report.snapshotGeneratedAt}\``);
  lines.push(`- Scan roots: ${SCAN_ROOTS.map((r) => `\`${r}/\``).join(", ")}`);
  lines.push(`- Files scanned: **${filesScanned}**`);
  lines.push(`- Formula: \`${SCORE_FORMULA}\``);
  lines.push("");
  lines.push(`## Aggregate`);
  lines.push("");
  lines.push(`| Metric | Value |`);
  lines.push(`|---|---|`);
  lines.push(`| Total entities | ${total} |`);
  lines.push(`| Average coverage | ${report.scores.averageCoverage} |`);
  lines.push(`| Median coverage | ${report.scores.medianCoverage} |`);
  lines.push(`| High (>=75) | ${high} |`);
  lines.push(`| Medium (25-74) | ${medium} |`);
  lines.push(`| Low (<25) | ${low} |`);
  lines.push("");
  lines.push(`## Coverage by collection`);
  lines.push("");
  lines.push(`| Collection | Entities | Avg coverage |`);
  lines.push(`|---|---|---|`);
  const byColRows = Object.entries(byCollection).sort(
    (a, b) => b[1].averageCoverage - a[1].averageCoverage,
  );
  for (const [c, m] of byColRows) {
    lines.push(`| ${c} | ${m.entityCount} | ${m.averageCoverage} |`);
  }
  lines.push("");
  lines.push(`## Top ${Math.min(onlyTop, outEntities.length)} entities${onlyMissing ? " (missing only)" : ""}`);
  lines.push("");
  lines.push(`| # | Entity | Collection | Mentions | Links | JSON-LD | Score |`);
  lines.push(`|---|---|---|---|---|---|---|`);
  topSlice.forEach((e, i) => {
    const label = e.url ? `[${e.key}](${e.url})` : e.key;
    lines.push(
      `| ${i + 1} | ${label} | ${e.collection} | ${e.mentionsCount} | ${e.linkCount} | ${e.jsonldRefs} | ${e.coverageScore} |`,
    );
  });
  if (!onlyMissing) {
    const missing = enriched.filter((e) => e.coverageScore === 0).length;
    if (missing > 0) {
      lines.push("");
      lines.push(`## Zero-coverage entities (${missing})`);
      lines.push("");
      const missingSlice = enriched
        .filter((e) => e.coverageScore === 0)
        .slice(0, 50);
      missingSlice.forEach((e) => {
        lines.push(`- \`${e.collection}/${e.key}\` — ${e.title}`);
      });
      if (missing > 50) lines.push(`- … and ${missing - 50} more`);
    }
  } else {
    lines.push("");
    lines.push(`Total missing: **${outEntities.length}**`);
  }
  lines.push("");
  await writeFile(REPORT_MD, lines.join("\n"));

  // ─── terminal output ───────────────────────────────────────────────────
  console.log(`=== entity coverage ===`);
  console.log(`files scanned        : ${filesScanned}`);
  console.log(`entities             : ${total}`);
  console.log(`avg coverage         : ${report.scores.averageCoverage}`);
  console.log(`median               : ${report.scores.medianCoverage}`);
  console.log(`high (>=75)          : ${high}`);
  console.log(`medium (25-74)       : ${medium}`);
  console.log(`low (<25)            : ${low}`);
  console.log(`zero-coverage        : ${enriched.filter((e) => e.coverageScore === 0).length}`);
  console.log("");
  console.log(`reports:`);
  console.log(`  ${REPORT_JSON}`);
  console.log(`  ${REPORT_MD}`);

  if (strict) {
    const lows = enriched.filter((e) => e.coverageScore < 25).length;
    if (lows > 0) {
      console.error(`strict: ${lows} entities below threshold 25`);
      process.exit(1);
    }
  }

  if (zeroOnly) {
    const zeros = enriched.filter((e) => e.coverageScore === 0).length;
    if (zeros > 0) {
      console.error(`zero-only: ${zeros} entities have zero coverage`);
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error("audit-entity-coverage crashed:", err);
  process.exit(1);
});