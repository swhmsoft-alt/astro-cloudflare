/**
 * sync-i18n-keys.mjs — Add missing i18n keys to all locale files.
 * Reads en.json as source of truth, adds any missing keys to other locales.
 * Usage: node scripts/sync-i18n-keys.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const I18N_DIR = resolve(__dirname, "..", "src", "i18n");

// Known keys that should be inherited from en.json when missing
const INHERITED_KEYS = new Set([
  "knowledge.comparisons",
  "knowledge.guides",
  "knowledge.procurement",
  "nav.evidence",
  "nav.cases",
  "nav.applications",
  "nav.procurement",
]);

// Read en.json (source of truth)
const enPath = resolve(I18N_DIR, "en.json");
const enRaw = readFileSync(enPath, "utf-8");
const enData = JSON.parse(enRaw);

// Collect all locale files (skip en.json itself)
const files = readdirSync(I18N_DIR).filter(f => f.endsWith(".json") && f !== "en.json");
let updated = 0;

for (const file of files) {
  const filePath = resolve(I18N_DIR, file);
  const raw = readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);
  
  let changed = false;
  for (const key of INHERITED_KEYS) {
    if (!(key in data) && key in enData) {
      data[key] = enData[key];
      changed = true;
    }
  }
  
  if (changed) {
    writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
    console.log(`  ✓ ${file}: ${INHERITED_KEYS.size} keys synced`);
    updated++;
  } else {
    console.log(`  - ${file}: up to date`);
  }
}

console.log(`\n✓ sync-i18n-keys: ${updated}/${files.length} files updated.`);
