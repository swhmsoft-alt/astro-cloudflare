#!/usr/bin/env node
/**
 * cache.mjs — Translation cache (file hash → translation).
 *
 * Maps source file content hashes to translated output,
 * enabling resume and skip-already-done logic.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");
const CACHE_PATH = resolve(ROOT, ".translation-cache.json");

// ── Cache store ───────────────────────────────────────────────────────────────
let _cache = null;

function load() {
  if (_cache) return _cache;
  if (existsSync(CACHE_PATH)) {
    try {
      _cache = JSON.parse(readFileSync(CACHE_PATH, "utf8"));
    } catch {
      _cache = {};
    }
  } else {
    _cache = {};
  }
  return _cache;
}

function save() {
  const dir = dirname(CACHE_PATH);
  try {
    writeFileSync(CACHE_PATH, JSON.stringify(_cache, null, 2), "utf8");
  } catch (err) {
    console.warn(`[cache] Failed to write cache: ${err.message}`);
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Compute a hash for a file's content.
 * @param {string} content - Raw file content
 * @returns {string} - Hex hash
 */
export function hash(content) {
  return createHash("sha256").update(content, "utf8").digest("hex").slice(0, 16);
}

/**
 * Get cached translation for a file.
 * @param {string} filePath - Absolute source file path
 * @param {string} locale - Target locale
 * @param {string} contentHash - Content hash (optional, computed if not provided)
 * @returns {string|null} - Cached translated content or null
 */
export function get(filePath, locale, contentHash) {
  const cache = load();
  const h = contentHash || hash(readFileSync(filePath, "utf8"));
  const key = `${filePath}::${locale}`;
  const entry = cache[key];
  if (entry && entry.hash === h) {
    return entry.content;
  }
  return null;
}

/**
 * Store translation in cache.
 * @param {string} filePath - Absolute source file path
 * @param {string} locale - Target locale
 * @param {string} content - Translated content
 * @param {string} contentHash - Source content hash (optional)
 */
export function set(filePath, locale, content, contentHash) {
  const cache = load();
  const h = contentHash || hash(readFileSync(filePath, "utf8"));
  const key = `${filePath}::${locale}`;
  cache[key] = { hash: h, content, updated: new Date().toISOString() };
  save();
}

/**
 * Clear all cache entries.
 */
export function clear() {
  _cache = {};
  save();
}

/**
 * Get cache stats.
 * @returns {{ total: number, size: number }}
 */
export function stats() {
  const cache = load();
  return {
    total: Object.keys(cache).length,
    size: new TextEncoder().encode(JSON.stringify(cache)).length,
  };
}

export default { hash, get, set, clear, stats };