// One-shot locale scan (deleted after run). Read-only.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.cwd();
const CONTENT = join(ROOT, "src", "content");
const PAGES = join(ROOT, "src", "pages");
const I18N = join(ROOT, "src", "i18n");

function walk(d) {
  const out = [];
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (/\.(md|mdx)$/i.test(e.name)) out.push(p);
  }
  return out;
}

console.log("=== content frontmatter locale: scan ===");
const files = walk(CONTENT);
const bad = [];
const noField = [];
for (const f of files) {
  const c = readFileSync(f, "utf8");
  const m = c.match(/^locale:\s*(.+)$/m);
  if (!m) { noField.push(f); continue; }
  const v = m[1].trim().replace(/^['"]|['"]$/g, "");
  if (v !== "en") bad.push([f, v]);
}
console.log(`TOTAL=${files.length} NO_FIELD=${noField.length} NON_EN=${bad.length}`);
for (const [f, v] of bad) console.log(`NON_EN ${f} -> ${v}`);

console.log("\n=== src/pages top-level ===");
for (const e of readdirSync(PAGES, { withFileTypes: true })) {
  console.log(`${e.isDirectory() ? "DIR " : "FILE"}  ${e.name}`);
}

console.log("\n=== src/i18n ===");
for (const e of readdirSync(I18N, { withFileTypes: true })) {
  console.log(`${e.isDirectory() ? "DIR " : "FILE"}  ${e.name}  ${e.isFile() ? statSync(join(I18N, e.name)).size + "B" : ""}`);
}

console.log("\n=== src/pages/[locale] exists? ===");
const localeDir = join(PAGES, "[locale]");
try {
  const st = statSync(localeDir);
  console.log("EXISTS", st.isDirectory() ? "(dir)" : "(file)");
} catch { console.log("NOT_PRESENT"); }

console.log("\n=== scripts/geo-audit ===");
const audit = join(ROOT, "scripts", "geo-audit");
for (const e of readdirSync(audit)) console.log(e);