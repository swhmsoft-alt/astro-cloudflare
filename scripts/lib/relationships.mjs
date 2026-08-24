// scripts/lib/relationships.mjs
// Pure-utility module for extracting canonical relationships + search terms
// from content frontmatter. No I/O. Used by build-entities.mjs.
//
// Mapping (frontmatter field → canonical relationship key):
//   materials              → usesMaterial
//   industries             → usedIn
//   processes              → usesProcess
//   equipment              → usesEquipment
//   standards              → conformsTo
//   alloys                 → usesMaterial       (standards-specific)
//   relatedMaterials       → usesMaterial       (additive)
//   relatedProcesses       → usesProcess        (additive)
//   relatedStandards       → conformsTo         (additive)
//   relatedIndustries      → usedIn             (additive)
//   relatedEntities        → relatedEntities    (passthrough, opaque)
//   relatedDecisions       → relatedDecisions   (passthrough, opaque)
//
// All fields are optional arrays of slug strings (e.g. "grade-5-titanium").
// Resolution of slugs → entity URLs is intentionally NOT done here; the
// audit script handles that lazily to keep this module pure and the snapshot
// file portable across collection re-names.

const LEGACY_FIELDS_TO_CANONICAL = {
  materials: "usesMaterial",
  industries: "usedIn",
  processes: "usesProcess",
  equipment: "usesEquipment",
  standards: "conformsTo",
  alloys: "usesMaterial", // standards: which alloy the spec covers
  relatedMaterials: "usesMaterial",
  relatedProcesses: "usesProcess",
  relatedStandards: "conformsTo",
  relatedIndustries: "usedIn",
};

const PASSTHROUGH_FIELDS = ["relatedEntities", "relatedDecisions"];

// Stop words that should not appear in search_terms.
const STOP_WORDS = new Set([
  "the", "and", "for", "with", "from", "into", "this", "that", "are", "was",
  "were", "been", "have", "has", "had", "their", "your", "you", "its",
  "all", "any", "but", "not", "use", "used", "via", "per", "etc",
  "titanium", // too generic for fuzzy match within titanium-only domain
]);

function asArray(v) {
  if (Array.isArray(v)) return v.filter((x) => typeof x === "string" && x.length > 0);
  if (typeof v === "string" && v.length > 0) return [v];
  return [];
}

/**
 * Normalize a string for use as a search term: lowercase, strip non-alphanumeric,
 * collapse hyphens/spaces to single space, trim.
 */
function normalizeTerm(s) {
  return String(s)
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Tokenize a normalized term into candidate search terms (≥3 chars, not a stop word).
 */
function tokenize(s) {
  if (!s) return [];
  const norm = normalizeTerm(s);
  if (!norm) return [];
  return norm
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
}

/**
 * Extract explicit aliases from frontmatter.
 * Returns string[]. Empty array if no `aliases` field is present.
 */
export function extractAliases(fm) {
  return asArray(fm && fm.aliases);
}

/**
 * Derive search_terms from key + title + aliases.
 * Lowercased, tokenized, deduped, drop short / stop-word tokens.
 * Always returns at least the normalized key for backward compatibility.
 */
export function deriveSearchTerms(entity) {
  const sources = [
    entity.key,
    entity.title,
    ...asArray(entity.aliases),
  ];
  const seen = new Set();
  const out = [];
  for (const src of sources) {
    for (const tok of tokenize(src)) {
      if (!seen.has(tok)) {
        seen.add(tok);
        out.push(tok);
      }
    }
  }
  // Always include the normalized key as an exact-match anchor.
  const keyNorm = normalizeTerm(entity.key || "").replace(/\s+/g, "-");
  if (keyNorm && !seen.has(keyNorm)) {
    seen.add(keyNorm);
    out.push(keyNorm);
  }
  return out;
}

/**
 * Aggregate all frontmatter relationship fields into the canonical
 * reference-doc schema. Dedupes within each canonical key, preserves order.
 *
 * @param {Record<string, unknown>} fm  parsed frontmatter
 * @returns {Record<string, string[]>}   canonical relationships object
 */
export function extractRelationships(fm) {
  if (!fm || typeof fm !== "object") return {};
  const out = {};
  const push = (key, val) => {
    if (!out[key]) out[key] = [];
    for (const s of asArray(val)) {
      if (!out[key].includes(s)) out[key].push(s);
    }
  };

  for (const [field, canonical] of Object.entries(LEGACY_FIELDS_TO_CANONICAL)) {
    if (fm[field] !== undefined) push(canonical, fm[field]);
  }
  for (const field of PASSTHROUGH_FIELDS) {
    if (fm[field] !== undefined) push(field, fm[field]);
  }
  return out;
}

/**
 * List the top-level frontmatter keys actually present (for audit transparency).
 * Excludes the standard transport keys (locale, title, description).
 */
const TRANSPARENT_KEYS_TO_OMIT = new Set(["locale"]);
export function extractFrontmatterKeys(fm) {
  if (!fm || typeof fm !== "object") return [];
  return Object.keys(fm).filter((k) => !TRANSPARENT_KEYS_TO_OMIT.has(k)).sort();
}

export const _internal = {
  normalizeTerm,
  tokenize,
  STOP_WORDS,
};