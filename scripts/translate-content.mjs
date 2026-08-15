#!/usr/bin/env node
/**
 * translate-content.mjs — Batch-translate Astro content-collection files via DeepSeek.
 *
 * Reads English (or another source) content entries from a collection, extracts the
 * translatable string values from the YAML frontmatter + the Markdown body, asks DeepSeek
 * to translate them, and writes a `<basename>-<locale>.<ext>` variant file with the
 * `locale` frontmatter set to the target language. All structural fields (slug, icon,
 * translationKey, order, type, ctaHref, nested item slugs, numbers, enum values) are
 * preserved exactly.
 *
 * Usage:
 *   node scripts/translate-content.mjs --collection=pages --locale=es --dry-run
 *   node scripts/translate-content.mjs --collection=pages --locale=es --limit=3
 *   node scripts/translate-content.mjs --dir=src/content/site/pages --locale=es
 *
 * Requires DEEPSEEK_API_KEY in the environment (see knowledge-generator/lib/deepseek.mjs).
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname, basename, extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// js-yaml is hoisted under pnpm; resolve via an absolute file:// URL for ESM import.
const JSYAML = resolve(ROOT, "node_modules/.pnpm/js-yaml@4.2.0/node_modules/js-yaml/index.js");
const { load: yamlLoad, dump: yamlDump } = await import(pathToFileURL(JSYAML).href);

import { generate } from "../knowledge-generator/lib/deepseek.mjs";

// Collection name → content directory (relative to repo root).
// For collections using Starlight subdirectory mode (e.g. docs),
// the source dir points to the English subdirectory.
const COLLECTION_DIRS = {
  blog: "src/content/site/blog",
  pages: "src/content/site/pages",
  faqs: "src/content/site/faqs",
  authors: "src/content/site/authors",
  stack: "src/content/site/stack",
  materials: "src/content/core/materials",
  processes: "src/content/core/processes",
  industries: "src/content/core/industries",
  standards: "src/content/core/standards",
  surfaceFinishes: "src/content/core/surface-finishes",
  heatTreatment: "src/content/core/heat-treatment",
  corrosion: "src/content/core/corrosion",
  failureAnalysis: "src/content/core/failure-analysis",
  materialSelection: "src/content/core/selection",
  evidence: "src/content/derived/evidence",
  comparisons: "src/content/derived/comparisons",
  procurement: "src/content/derived/procurement",
  guides: "src/content/derived/guides",
  cases: "src/content/derived/cases",
  applications: "src/content/applications",
  // Starlight docs collection (locale subdirectory mode)
  docs: "src/content/docs/en",
};

// Collections that use Starlight locale subdirectories instead of suffix filenames.
// When true, the target file is written to `src/content/docs/{locale}/...` mirroring
// the directory structure under the source locale subdirectory.
const STARLIGHT_SUBDIR_MODE = new Set(["docs"]);

// Files that live in these dirs carry a `locale` frontmatter field and should be translated.
const COLLECTION_EXTS = [".md", ".mdx", ".json"];

function parseArgs(raw) {
  const args = raw.slice(2);
  const cfg = {
    collection: null,
    dir: null,
    locale: null,
    from: "en",
    limit: Infinity,
    force: false,
    dryRun: false,
  };
  for (const arg of args) {
    if (arg.startsWith("--collection=")) cfg.collection = arg.split("=")[1];
    else if (arg.startsWith("--dir=")) cfg.dir = arg.split("=")[1];
    else if (arg.startsWith("--locale=")) cfg.locale = arg.split("=")[1];
    else if (arg.startsWith("--from=")) cfg.from = arg.split("=")[1];
    else if (arg.startsWith("--limit=")) cfg.limit = parseInt(arg.split("=")[1], 10) || Infinity;
    else if (arg === "--force") cfg.force = true;
    else if (arg === "--dry-run") cfg.dryRun = true;
  }
  return cfg;
}

function resolveSourceDir(cfg) {
  if (cfg.dir) return resolve(ROOT, cfg.dir);
  if (cfg.collection && COLLECTION_DIRS[cfg.collection]) {
    return resolve(ROOT, COLLECTION_DIRS[cfg.collection]);
  }
  return null;
}

function listSourceFiles(dir) {
  if (!existsSync(dir)) return [];
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listSourceFiles(full));
    } else if (COLLECTION_EXTS.includes(extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files.sort();
}

/** Split a raw content file into { frontmatterRaw, body }. */
function splitFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!m) return { frontmatterRaw: null, body: raw };
  return { frontmatterRaw: m[1], body: raw.slice(m[0].length) };
}

/** Read `locale` from raw frontmatter text without full parsing (JSON/empty safe). */
function readLocale(frontmatterRaw) {
  if (frontmatterRaw == null) return null;
  const m = frontmatterRaw.match(/^\s*locale:\s*["']?([a-zA-Z0-9-]+)["']?\s*$/m);
  return m ? m[1] : null;
}

export { ROOT, COLLECTION_DIRS, parseArgs, resolveSourceDir, listSourceFiles, splitFrontmatter, readLocale, yamlLoad, yamlDump };

// ── Translatable-string extraction / reassembly ──────────────────────────────
// Keys whose values are structural identifiers and must never be translated.
const RESERVED_KEYS = new Set([
  "locale", "slug", "icon", "translationKey", "ctaHref", "type", "order",
  "version", "url", "colorOklch", "id", "source", "sourceUrl",
]);

function isNumericish(v) {
  if (typeof v !== "string") return false;
  return /^-?[\d.,\sµmµnm%°]+$/.test(v.trim()) && /\d/.test(v);
}

/** Depth-first collect translatable leaf strings. Returns [{ path, text }]. */
function collectStrings(node, path = [], out = []) {
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) collectStrings(node[i], [...path, i], out);
  } else if (node && typeof node === "object") {
    for (const k of Object.keys(node)) {
      if (RESERVED_KEYS.has(k)) continue;
      collectStrings(node[k], [...path, k], out);
    }
  } else if (typeof node === "string" && node.trim() && !isNumericish(node)) {
    out.push({ path, text: node });
  }
  return out;
}

/** Set a nested value by an array path of keys/indices. */
function setByPath(root, path, value) {
  let cur = root;
  for (let i = 0; i < path.length - 1; i++) {
    if (cur == null) return;
    cur = cur[path[i]];
  }
  const last = path[path.length - 1];
  if (cur != null && last != null) cur[last] = value;
}

function buildPrompt(from, locale, strings, body) {
  const list = strings.map((s, i) => i + ". " + s.text).join("\n");
  const system = `You are a professional translator specializing in technical, engineering, and manufacturing content (titanium, machining, materials, standards).
Translate text from ${from} into ${locale}.

RULES:
1. Output VALID JSON ONLY. No markdown wrappers, no code fences, no explanations.
2. The JSON must have exactly two keys: "strings" (array) and "body" (string).
3. "strings" must be an array with EXACTLY the same number of items as the input, in the same order. Do not reorder, merge, split, or omit.
4. Keep technical proper nouns, product/code identifiers, alloy names (e.g. Ti-6Al-4V, Grade 5), standard numbers (e.g. ASTM B265, AS9100D, NADCAP), chemical formulas, units, numbers, URLs, and filenames unchanged or correctly adapted.
5. Preserve Markdown formatting exactly (headings, bold, lists, tables, links); do not translate inside URLs or code text.
6. "body" is the translated Markdown body. Preserve heading hierarchy and all structural Markdown.`;
  const user = `Translate the following ${strings.length} string(s) and the document body into ${locale}.

STRINGS (one per line, index.text):
${list || "(none)"}

BODY:
${body}

Return JSON: {"strings":["...", "..."],"body":"..."}`;
  return { system, user };
}

/** DeepSeek returns the aligned translated strings + body. */
async function translateContent(cfg, strings, body) {
  const { system, user } = buildPrompt(cfg.from, cfg.locale, strings, body);
  const result = await generate({ systemPrompt: system, userPrompt: user, temperature: 0.2, maxTokens: 4096 });
  return parseResponse(result.content);
}

/** Robust JSON extraction (mirrors knowledge-generator's parser). */
function parseResponse(raw) {
  let text = raw.trim();
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) text = fenceMatch[1].trim();
  try { return JSON.parse(text); } catch { /* fall through */ }
  let depth = 0, inStr = false, esc = false, lastBrace = -1;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (esc) { esc = false; continue; }
    if (ch === "\\" && inStr) { esc = true; continue; }
    if (ch === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === "{") depth++;
    else if (ch === "}") { depth--; if (depth === 0) lastBrace = i; }
  }
  if (lastBrace > 0) {
    const first = text.indexOf("{");
    try { return JSON.parse(text.slice(first, lastBrace + 1)); } catch { /* throw below */ }
  }
  throw new Error("Cannot parse DeepSeek response as JSON. Preview: " + JSON.stringify(text.slice(0, 160)));
}

function targetFileName(sourceFile, cfg) {
  const ext = extname(sourceFile);
  const base = basename(sourceFile, ext);
  // Starlight subdirectory mode: write to src/content/docs/{locale}/...
  if (cfg.collection && STARLIGHT_SUBDIR_MODE.has(cfg.collection)) {
    const srcDir = resolveSourceDir(cfg);
    if (!srcDir) return join(dirname(sourceFile), `${base}-${cfg.locale}${ext}`);
    // sourceFile is under srcDir (e.g. src/content/docs/en/getting-started/overview.md)
    // → relative path: getting-started/overview.md
    const relative = sourceFile.startsWith(srcDir)
      ? sourceFile.slice(srcDir.length).replace(/^[/\\]/, "")
      : basename(sourceFile);
    // → target: src/content/docs/{locale}/getting-started/overview.md
    const targetDir = join(dirname(srcDir), cfg.locale);
    return join(targetDir, relative);
  }
  return join(dirname(sourceFile), `${base}-${cfg.locale}${ext}`);
}

function serializeFrontmatter(obj) {
  const dumped = yamlDump(obj, { lineWidth: -1, noRefs: true });
  return dumped.endsWith("\n") ? dumped : dumped + "\n";
}

async function run() {
  const cfg = parseArgs(process.argv);
  if (!cfg.locale) {
    console.error("[translate] Missing --locale=<code>");
    process.exit(2);
  }
  const srcDir = resolveSourceDir(cfg);
  if (!srcDir) {
    console.error("[translate] Unknown collection; use --collection=<name> or --dir=<path>");
    process.exit(2);
  }
  const files = listSourceFiles(srcDir);
  let planned = 0, done = 0, skippedExisting = 0, failed = 0;

  for (const file of files) {
    const raw = readFileSync(file, "utf8");
    const { frontmatterRaw, body } = splitFrontmatter(raw);
    const isJson = extname(file).toLowerCase() === ".json" && frontmatterRaw == null;

    let locale;
    let parsed;
    let strings = [];
    if (isJson) {
      parsed = JSON.parse(raw);
      locale = parsed.locale ?? null;
    } else {
      if (frontmatterRaw == null) { console.warn("[translate] No frontmatter: " + basename(file)); continue; }
      parsed = yamlLoad(frontmatterRaw) || {};
      locale = parsed.locale ?? null;
    }
    if (locale !== cfg.from) continue; // only translate source-locale entries

    strings = collectStrings(parsed);
    const target = targetFileName(file, cfg);
    if (!cfg.force && existsSync(target)) { skippedExisting++; continue; }
    if (planned >= cfg.limit) break;

    if (cfg.dryRun) {
      console.log(`[plan] ${cfg.from} → ${cfg.locale}: ${basename(file)} → ${basename(target)} (${strings.length} strings, body ${body.length} chars)`);
      planned++;
      continue;
    }

    let result;
    try {
      result = await translateContent(cfg, strings, isJson ? "" : body);
    } catch (err) {
      console.error("[translate] API error for " + basename(file) + ": " + err.message);
      failed++;
      continue;
    }
    const translatedStrings = Array.isArray(result?.strings) ? result.strings : [];
    if (translatedStrings.length !== strings.length) {
      console.error("[translate] Length mismatch for " + basename(file) + ": got " + translatedStrings.length + ", expected " + strings.length + " — skipping");
      failed++;
      continue;
    }
    const map = new Map();
    strings.forEach((s, i) => map.set(JSON.stringify(s.path), translatedStrings[i]));
    for (const s of strings) setByPath(parsed, s.path, map.get(JSON.stringify(s.path)));

    let outBody;
    if (isJson) {
      parsed.locale = cfg.locale;
      outBody = JSON.stringify(parsed, null, 2) + "\n";
    } else {
      parsed.locale = cfg.locale;
      outBody = "---\n" + serializeFrontmatter(parsed) + "---\n\n" + (result.body ?? body);
    }
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, outBody, "utf8");
    console.log(`[ok] ${basename(file)} → ${basename(target)} (${translatedStrings.length} strings translated)`);
    done++;
    planned++;
  }

  console.log(`\n[summary] source=${cfg.from} target=${cfg.locale} planned=${planned} translated=${done} skipped(existing)=${skippedExisting} failed=${failed}`);
  if (failed > 0) process.exitCode = 1;
}

run().catch((err) => {
  console.error("[translate] Fatal: " + (err.message || err));
  process.exit(1);
});

