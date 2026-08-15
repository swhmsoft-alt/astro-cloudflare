import { glob } from 'glob';
import fs from 'fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// ── Step 1: Trailing-slash normalization ─────────────────────────────
const files = glob.sync('dist/**/*.html');
files.forEach(file => {
  let html = fs.readFileSync(file, 'utf-8');
  // 先去掉尾部已有斜杠，再统一添加，杜绝双斜杠
  html = html.replace(/href="\/([^".#?]+)"/g, (match, p) => {
    const clean = p.replace(/\/+$/, '');
    return `href="/${clean}/"`;
  });
  fs.writeFileSync(file, html, 'utf-8');
});

// ── Step 2: Build Pagefind search index (CLI, not starlight integration) ──
// The starlight pagefind integration crashes on Windows 10 1809 (STATUS_DLL_INIT_FAILED),
// but the pagefind CLI binary works fine. We skip the integration (via SKIP_PAGEFIND=true)
// and run the CLI here instead.
console.log('[postbuild] Building search index with Pagefind CLI...');
try {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const root = join(__dirname, '..');
  // Resolve pagefind binary path (works on Windows with pnpm)
  const pagefindBin = join(root, 'node_modules', '.bin', 'pagefind.cmd');
  const result = execSync(
    `"${pagefindBin}" --source dist --bundle-dir pagefind`,
    { cwd: root, encoding: 'utf8', stdio: 'pipe' }
  );
  // Extract the summary line from pagefind output
  const lines = result.split('\n').filter(l => l.includes('Finished') || l.includes('seconds'));
  if (lines.length) console.log(`[postbuild] ${lines[0].trim()}`);
  console.log('[postbuild] Search index ready.');
} catch (err) {
  console.error('[postbuild] Pagefind error:', err.message);
  // Don't fail the build — search is a non-critical enhancement
}
