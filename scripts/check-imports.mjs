/**
 * check-imports.mjs — Validate relative import paths in Astro pages.
 * Scans src/pages/*.astro for relative imports and verifies
 * the resolved file actually exists on disk.
 *
 * Usage: node scripts/check-imports.mjs
 * Exit code: 0 = all good, 1 = broken imports found
 */

import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PAGES_DIR = resolve(ROOT, "src", "pages");

// File extensions to try when the import doesn't specify one
const EXTENSIONS = [".astro", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".css"];

function collectAstroFiles(dir) {
  const results = [];
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = resolve(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
        results.push(...collectAstroFiles(full));
      } else if (entry.name.endsWith(".astro")) {
        results.push(full);
      }
    }
  } catch { /* skip unreadable */ }
  return results;
}

function resolveImport(importerPath, importPath) {
  // Skip non-relative imports (node_modules, astro:content, etc.)
  if (!importPath.startsWith(".")) return null;
  
  const baseDir = dirname(importerPath);
  const resolved = resolve(baseDir, importPath);
  
  // Exact match
  if (existsSync(resolved)) return resolved;
  
  // Try with extensions
  for (const ext of EXTENSIONS) {
    const withExt = resolved + ext;
    if (existsSync(withExt)) return withExt;
  }
  
  // Try as directory with index file
  for (const ext of [".astro", ".ts", ".tsx", ".js", ".mjs"]) {
    const asIndex = resolve(resolved, `index${ext}`);
    if (existsSync(asIndex)) return asIndex;
  }
  
  return null;
}

const files = collectAstroFiles(PAGES_DIR);
let errors = 0;
let warnings = 0;

for (const file of files) {
  const content = readFileSync(file, "utf-8");
  // Match all `from "..."` and `from '...'` in import statements
  const importRegex = /from\s+["'](\.[^"']+)["']/g;
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    const resolved = resolveImport(file, importPath);
    
    if (resolved === null) {
      const relFromRoot = relative(ROOT, file);
      console.error(`[ERROR] ${relFromRoot}: import '${importPath}' → NOT FOUND`);
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`\n✗ ${errors} broken import(s) found. Fix before committing.`);
  process.exit(1);
} else {
  console.log(`✓ check-imports: ${files.length} files scanned, 0 broken imports.`);
  process.exit(0);
}
