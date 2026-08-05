/**
 * check-mojibake.mjs
 * ---------------------------------------------
 * Guards the site against UTF-8 -> GBK mojibake (乱码) regressions in content.
 *
 * The corrupted content contains literal CJK ideographs / replacement chars
 * that were produced when multi-byte UTF-8 (e.g. "±", "µm", "°", "–", "₃")
 * was mis-decoded as GBK (e.g. "卤", "碌", "掳", "鈥?", "鈧?").
 *
 * src/content is English-only, so ANY CJK ideograph or replacement character
 * in a Markdown content file is a red flag and fails this gate. This welds
 * the fix shut so the mojibake can never silently return.
 *
 * Part of `pnpm lint`.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { globSync } from "glob";

const root = fileURLToPath(new URL("..", import.meta.url));
const include = ["src/content/**/*.md", "src/content/**/*.mdx"];
// CJK ideographs (incl. full-width punctuation) + U+FFFD replacement char.
const MOJI = /[\u3000-\u9fff\ufffd]/;
// Explicit mojibake tokens we know came from a UTF-8->GBK corruption.
const MOJI_TOKENS = /卤|碌|鈥|掳|虏|鲁|路|係|鈧|鈦|烩|伖/;

let failures = 0;

for (const pattern of include) {
  for (const file of globSync(pattern, { cwd: root, absolute: true })) {
    const text = readFileSync(file, "utf8");
    if (!MOJI_TOKENS.test(text) && !MOJI.test(text)) continue;

    const lines = text.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (MOJI_TOKENS.test(line) || MOJI.test(line)) {
        const sample = line.replace(MOJI_TOKENS, "[MOJI]").replace(MOJI, "[MOJI]");
        console.error(`mojibake: ${file.replace(root, "")}:${i + 1}: ${sample.trim()}`);
        failures++;
      }
    }
  }
}

if (failures > 0) {
  console.error(`\n✗ check-mojibake: ${failures} mojibake line(s) found. Fix or regenerate content.`);
  process.exit(1);
} else {
  console.log("✓ check-mojibake: no mojibake in content.");
}
