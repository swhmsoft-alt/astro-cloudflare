#!/usr/bin/env node
/**
 * validate-i18n.js — EN-only invariant guard.
 *
 * The site ships EN-only at runtime (locked 2026-08-23; see
 * .clinerules/translation-governance.md). The original multi-locale key-parity
 * script was deleted in Session 6 along with the 15 non-en locale JSONs it
 * validated. This script is the minimal replacement that keeps the
 * `pnpm run validate:i18n` / CI step alive without re-introducing translation
 * surface area.
 *
 * Exit codes:
 *   0 — en.json exists and parses as a non-empty JSON object
 *   1 — invariant violated (file missing, parse error, empty/typed wrong)
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const enPath = join(ROOT, "src", "i18n", "en.json");

if (!existsSync(enPath)) {
  console.error(`✗ i18n: missing ${enPath}`);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(readFileSync(enPath, "utf8"));
} catch (err) {
  console.error(`✗ i18n: src/i18n/en.json is not valid JSON — ${err.message}`);
  process.exit(1);
}

if (typeof data !== "object" || data === null || Array.isArray(data)) {
  console.error("✗ i18n: src/i18n/en.json must be a JSON object");
  process.exit(1);
}

const keys = Object.keys(data);
if (keys.length === 0) {
  console.error("✗ i18n: src/i18n/en.json must contain at least one key");
  process.exit(1);
}

console.log(`✓ i18n: src/i18n/en.json valid (${keys.length} keys)`);
process.exit(0);