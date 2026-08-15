#!/usr/bin/env node
/** check-no-en-prefix.mjs - ZERO-TOLERANCE guard: /en/ must never exist in dist/. */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const SLASH = String.fromCharCode(47);
const BACK = String.fromCharCode(92);
const ENMARK = SLASH + 'en' + SLASH;
if (!existsSync(DIST)) { console.error('[check-no-en-prefix] dist/ missing - run pnpm build first.'); process.exit(1); }
const files = [];
function walk(d) { for (const e of readdirSync(d, { withFileTypes: true })) { const f = join(d, e.name); if (e.isDirectory()) walk(f); else if (e.isFile()) files.push(f); } }
walk(DIST);
const bad = [];
for (const f of files) {
  const rel = f.slice(DIST.length).split(BACK).join(SLASH);
  if (rel === SLASH + 'en' || rel.indexOf(SLASH + 'en' + SLASH) === 0) bad.push('en-prefixed page: ' + rel);
  const low = rel.toLowerCase();
  if (low.endsWith('.xml') || low.endsWith('.txt')) {
    const text = readFileSync(f, 'utf8');
    if (text.indexOf(ENMARK) !== -1) bad.push('link contains /en/: ' + rel);
  } else if (low.endsWith('.html')) {
    const text = readFileSync(f, 'utf8');
    let pos = 0;
    while (true) {
      const a = text.indexOf('<link', pos);
      if (a === -1) break;
      const b = text.indexOf('>', a);
      if (b === -1) break;
      const tag = text.slice(a, b + 1);
      if (tag.indexOf('rel=') !== -1 && tag.indexOf(ENMARK) !== -1) bad.push('link points to /en/: ' + rel + ' | ' + tag.slice(0, 140));
      pos = b + 1;
    }
  }
}
if (bad.length) { console.error('[check-no-en-prefix] FAILED - /en/ prefix must never exist:'); for (const b of bad) console.error('  - ' + b); process.exit(1); }
console.log('[check-no-en-prefix] OK - no /en/ prefix found in dist/.');
