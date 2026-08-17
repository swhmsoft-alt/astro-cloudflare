#!/usr/bin/env node
/**
 * scanner.mjs — File scanner for content collections.
 *
 * Scans src/content/ for translatable files, routes by locale,
 * and filters already-translated entries.
 *
 * Exports:
 *   scan({ locale, from, collection, dir, force })
 *     → [{ file, relativePath, stats }]
 *   listCollections()
 *     → [{ name, dir, isStarlight, fileCount }]
 */

import { readdirSync, statSync, existsSync } from "node:fs";
import { resolve, relative, extname, join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");
const CONTENT_DIR = resolve(ROOT, "src", "content");

// ── Collection definitions ────────────────────────────────────────────────────
const COLLECTIONS = {
  // Starlight docs (locale subdirectory mode)
  docs: { dir: "docs", isStarlight: true },
  // Site content
  blog: { dir: "site/blog", isStarlight: false },
  pages: { dir: "site/pages", isStarlight: false },
  faqs: { dir: "site/faqs", isStarlight: false },
  authors: { dir: "site/authors", isStarlight: false },
  stack: { dir: "site/stack", isStarlight: false },
  // Core knowledge
  materials: { dir: "core/materials", isStarlight: false },
  processes: { dir: "core/processes", isStarlight: false },
  industries: { dir: "core/industries", isStarlight: false },
  standards: { dir: "core/standards", isStarlight: false },
  surfaceFinishes: { dir: "core/surface-finishes", isStarlight: false },
  heatTreatment: { dir: "core/heat-treatment", isStarlight: false },
  corrosion: { dir: "core/corrosion", isStarlight: false },
  failureAnalysis: { dir: "core/failure-analysis", isStarlight: false },
  materialSelection: { dir: "core/selection", isStarlight: false },
  // Derived content
  evidence: { dir: "derived/evidence", isStarlight: false },
  comparisons: { dir: "derived/comparisons", isStarlight: false },
  procurement: { dir: "derived/procurement", isStarlight: false },
  guides: { dir: "derived/guides", isStarlight: false },
  cases: { dir: "derived/cases", isStarlight: false },
  applications: { dir: "applications", isStarlight: false },
};

const VALID_EXTS = new Set([".md", ".mdx", ".json"]);
// Keep in sync with `LOCALES` in src/config/site.config.ts.
const LOCALE_CODES = new Set(["en","de","ja","fr","es","pt-br","it","ko","nl","pl"]);
const LOCALE_SUFFIX_RE = new RegExp("-(" + Array.from(LOCALE_CODES).join("|") + ")$");

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Scan for translatable files.
 * @param {object} opts
 * @param {string} opts.locale    - Target locale (e.g. "de")
 * @param {string} [opts.from="en"] - Source locale
 * @param {string} [opts.collection] - Collection name
 * @param {string} [opts.dir]     - Custom directory path
 * @param {boolean} [opts.force=false] - Re-translate existing
 * @returns {Array<{file:string, relativePath:string, stats:object}>}
 */
export function scan({ locale, from = "en", collection, dir, force = false }) {
  const srcDir = resolveSourceDir(collection, dir);
  if (!srcDir) {
    throw new Error(`Unknown collection "${collection}". Use --collection=<name> or --dir=<path>`);
  }
  if (!existsSync(srcDir)) {
    throw new Error(`Source directory not found: ${srcDir}`);
  }

  const cfg = COLLECTIONS[collection];
  const files = [];
  walkDir(srcDir, (filePath) => {
    const ext = extname(filePath).toLowerCase();
    if (!VALID_EXTS.has(ext)) return;

    // Skip files that already have any locale suffix (they are not source files)
    const base = basename(filePath, ext);
    if (LOCALE_SUFFIX_RE.test(base)) return;

    const relPath = relative(srcDir, filePath);
    const targetPath = resolveTargetPath(filePath, relPath, srcDir, collection, locale, from);

    // Skip if no target can be resolved (e.g. file already has locale suffix)
    if (!targetPath) return;

    // Skip if target already exists and not forced
    if (!force && existsSync(targetPath)) return;

    files.push({
      file: filePath,
      targetFile: targetPath,
      relativePath: relPath,
      stats: statSync(filePath),
      ext,
    });
  }, cfg && cfg.isStarlight ? LOCALE_CODES : null);

  // Sort by path for deterministic ordering
  files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  return files;
}

/**
 * List all registered collections.
 */
export function listCollections() {
  const result = [];
  for (const [name, cfg] of Object.entries(COLLECTIONS)) {
    const dir = resolve(CONTENT_DIR, cfg.dir);
    let fileCount = 0;
    if (existsSync(dir)) {
      walkDir(dir, () => { fileCount++; }, cfg.isStarlight ? LOCALE_CODES : null);
    }
    result.push({ name, dir: cfg.dir, isStarlight: cfg.isStarlight, fileCount });
  }
  result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function resolveSourceDir(collection, dir) {
  if (dir) return resolve(ROOT, dir);
  if (!collection) return null;
  const cfg = COLLECTIONS[collection];
  if (!cfg) return null;
  return resolve(CONTENT_DIR, cfg.dir);
}

function resolveTargetPath(filePath, relPath, srcDir, collection, locale, from) {
  const cfg = COLLECTIONS[collection];

  if (cfg?.isStarlight) {
    // Starlight subdirectory mode: src/content/docs/en/... → src/content/docs/{locale}/...
    return resolve(srcDir, locale, relPath);
  }

  // Suffix mode: file.md → file-{locale}.md
  const ext = extname(filePath);
  const base = basename(filePath, ext);
  // If already has locale suffix, skip
  if (base.endsWith(`-${locale}`)) return null;
  return resolve(dirname(filePath), `${base}-${locale}${ext}`);
}

function walkDir(dir, callback, skipDirs) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (skipDirs && skipDirs.has(entry.name)) continue;
      walkDir(full, callback, skipDirs);
    } else if (entry.isFile()) {
      callback(full);
    }
  }
}

export default { scan, listCollections };