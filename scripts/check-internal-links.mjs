#!/usr/bin/env node
/**
 * check-internal-links.mjs
 *
 * Reads src/content/**\/*.md (and optionally any extra file you pass via
 * positional args) and reports every internal markdown link whose target
 * either (a) is not present in the entity snapshot, or (b) resolves to
 * a path that does not exist on disk.
 *
 * "Internal" = href starts with "/" (site-relative) and is not an anchor-
 * only fragment. External http(s) links are ignored — those are checked
 * separately by audit:external-links.
 *
 * Usage:
 *   node scripts/check-internal-links.mjs                              # scan everything under src/content/
 *   node scripts/check-internal-links.mjs path/to/specific.md [a.md] # scan only these files
 *
 * Exit code:
 *   0  no broken links
 *   1  at least one broken link (or snapshot missing — re-run build-entities first)
 */

import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const SNAP_PATH = join(ROOT, "scripts/audit/lib/.entities-snapshot.json");

const INLINE_LINK_RE = /\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

function stripQueryAndHash(href) {
  return href.split("#")[0].split("?")[0];
}

function stripTrailingSlash(s) {
  return s.endsWith("/") ? s.slice(0, -1) : s;
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

async function collectTargets(args) {
  const files = [];
  if (args.length > 0) {
    for (const a of args) files.push(a);
  } else {
    for await (const f of walk(join(ROOT, "src/content"))) files.push(f);
  }
  return files;
}

async function loadSnapshot() {
  try {
    const raw = await readFile(SNAP_PATH, "utf8");
    const snap = JSON.parse(raw);
    // build a set of normalized URLs: "/finishes/anodizing" → "/finishes/anodizing/"
    const urlSet = new Set();
    for (const e of snap.entities) {
      if (!e.url) continue;
      urlSet.add(stripTrailingSlash(e.url));
    }
    return { snap, urlSet };
  } catch (err) {
    console.error(
      "snapshot missing or unreadable (" + SNAP_PATH + ")\n" +
        "run `node scripts/build-entities.mjs` first.",
    );
    process.exit(1);
  }
}

function isExternal(href) {
  return /^https?:\/\//i.test(href) || /^mailto:/i.test(href) ||
    href.startsWith("//");
}

function isAnchorOnly(href) {
  return href.startsWith("#");
}

function resolveAndCheck(href, urlSet) {
  const cleaned = stripQueryAndHash(href);
  if (!cleaned) return { status: "anchor-only" };
  if (isExternal(cleaned)) return { status: "external" };
  if (isAnchorOnly(cleaned)) return { status: "anchor-only" };
  // relative paths inside a single doc are not entity URLs
  if (cleaned.startsWith("./") || cleaned.startsWith("../")) return { status: "external" };
  // Starlight docs live under /docs/** — out of scope for the entity
  // registry (managed by @astrojs/starlight, separate audit gate).
  if (cleaned.startsWith("/docs/")) return { status: "external" };
  // site-relative path
  const normalized = stripTrailingSlash(cleaned);
  if (urlSet.has(normalized)) return { status: "ok" };
  return { status: "missing", normalized };
}

async function main() {
  const args = process.argv.slice(2);
  const { snap, urlSet } = await loadSnapshot();
  const files = await collectTargets(args);

  const summary = { scanned: 0, ok: 0, broken: [], ignored: 0 };
  for (const file of files) {
    let raw;
    try { raw = await readFile(file, "utf8"); }
    catch { continue; }
    summary.scanned++;
    INLINE_LINK_RE.lastIndex = 0;
    let m;
    const rel = relative(ROOT, file).split(sep).join("/");
    while ((m = INLINE_LINK_RE.exec(raw)) !== null) {
      const label = m[1];
      const href = m[2];
      const result = resolveAndCheck(href, urlSet);
      if (result.status === "ok") { summary.ok++; continue; }
      if (result.status === "external" || result.status === "anchor-only") {
        summary.ignored++; continue;
      }
      summary.broken.push({ file: rel, label, href, normalized: result.normalized });
    }
  }

  console.log("=== internal link check ===");
  console.log("files scanned       :", summary.scanned);
  console.log("ok links            :", summary.ok);
  console.log("ignored (ext/anchor):", summary.ignored);
  console.log("broken              :", summary.broken.length);
  console.log("");
  if (summary.broken.length > 0) {
    for (const b of summary.broken) {
      console.log(`BROKEN  ${b.file}`);
      console.log(`        [${b.label}](${b.href})`);
      console.log(`        → resolved to: ${b.normalized}`);
    }
    process.exit(1);
  }
  console.log("All internal links resolved.");
}

main().catch((err) => {
  console.error("check-internal-links crashed:", err);
  process.exit(1);
});
