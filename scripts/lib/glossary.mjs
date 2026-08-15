#!/usr/bin/env node
/**
 * glossary.mjs — Glossary loader and term validator.
 *
 * Loads locale-specific glossary, provides term injection for prompts,
 * and validates term usage in translated content.
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");
const GLOSSARY_DIR = resolve(ROOT, "src", "i18n", "glossary");

// ── Cache ─────────────────────────────────────────────────────────────────────
const _glossaryCache = new Map();

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Load glossary for a locale.
 * @param {string} locale - Target locale code
 * @param {boolean} [force=false] - Reload cache
 * @returns {object|null} - Glossary object or null if not found
 */
export function load(locale, force = false) {
  if (!force && _glossaryCache.has(locale)) {
    return _glossaryCache.get(locale);
  }

  const filePath = resolve(GLOSSARY_DIR, `${locale}.json`);
  if (!existsSync(filePath)) {
    _glossaryCache.set(locale, null);
    return null;
  }

  try {
    const data = JSON.parse(readFileSync(filePath, "utf8"));
    _glossaryCache.set(locale, data);
    return data;
  } catch (err) {
    console.warn(`[glossary] Failed to parse ${locale}.json: ${err.message}`);
    _glossaryCache.set(locale, null);
    return null;
  }
}

/**
 * Get all English→translated term pairs from a glossary.
 * @param {object} glossary - Parsed glossary object
 * @returns {Array<{en:string, translated:string, category:string}>}
 */
export function extractTerms(glossary) {
  if (!glossary) return [];
  const terms = [];
  for (const [category, entries] of Object.entries(glossary)) {
    if (category === "_meta") continue;
    if (typeof entries !== "object") continue;
    for (const [en, translated] of Object.entries(entries)) {
      terms.push({ en, translated, category });
    }
  }
  return terms;
}

/**
 * Build a system prompt fragment from glossary terms.
 * @param {string} locale - Target locale
 * @param {object} [glossary] - Pre-loaded glossary (optional)
 * @returns {string} - Prompt fragment
 */
export function buildPromptFragment(locale, glossary) {
  const g = glossary || load(locale);
  if (!g) return "";

  const terms = extractTerms(g);
  if (terms.length === 0) return "";

  const lines = [
    `## Terminology Constraints (${locale})`,
    "The following English terms MUST be translated to their specified equivalents:",
    "",
  ];

  for (const { en, translated, category } of terms) {
    lines.push(`- "${en}" → "${translated}" (${category})`);
  }

  lines.push("", `Whenever these English terms appear in the source text, use the specified ${locale} translation.`, "");
  return lines.join("\n");
}

/**
 * Validate term usage in translated content.
 * @param {string} locale - Target locale
 * @param {string} translatedContent - Translated text to check
 * @param {object} [glossary] - Pre-loaded glossary (optional)
 * @returns {Array<{en:string, translated:string, found:boolean, confidence:number}>}
 */
export function validateTerms(locale, translatedContent, glossary) {
  const g = glossary || load(locale);
  if (!g) return [];

  const terms = extractTerms(g);
  const results = [];

  for (const { en, translated, category } of terms) {
    // Check if the translated term appears in the content
    const escaped = translated.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "gi");
    const matches = translatedContent.match(regex);
    const found = matches !== null && matches.length > 0;

    results.push({
      en,
      translated,
      category,
      found,
      count: found ? matches.length : 0,
    });
  }

  return results;
}

/**
 * Get term hit rate for a locale (percentage of glossary terms found in content).
 * @param {string} locale - Target locale
 * @param {string} translatedContent - Translated text
 * @returns {{ hitRate: number, total: number, hits: number, misses: Array }}
 */
export function getTermHitRate(locale, translatedContent) {
  const results = validateTerms(locale, translatedContent);
  const total = results.length;
  if (total === 0) return { hitRate: 100, total: 0, hits: 0, misses: [] };

  const hits = results.filter((r) => r.found).length;
  const misses = results.filter((r) => !r.found);

  return {
    hitRate: Math.round((hits / total) * 100),
    total,
    hits,
    misses,
  };
}

/**
 * List all available glossary locales.
 * @returns {string[]}
 */
export function listLocales() {
  if (!existsSync(GLOSSARY_DIR)) return [];
  return readdirSync(GLOSSARY_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => basename(f, ".json"))
    .sort();
}

export default { load, extractTerms, buildPromptFragment, validateTerms, getTermHitRate, listLocales };