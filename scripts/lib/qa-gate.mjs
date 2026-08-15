#!/usr/bin/env node
/**
 * qa-gate.mjs — Quality Assurance gate for translated content.
 *
 * Implements all 6 checks from 7.1:
 * 1. DNT completeness
 * 2. Markdown structure
 * 3. Term consistency
 * 4. Frontmatter completeness
 * 5. Empty/truncated content
 * 6. Untranslated placeholders
 *
 * Each check returns { pass, fail, items[] }
 */

import { extractDNT, checkDNT, splitFrontmatter, parseFrontmatter } from "./markdown.mjs";
import { validateTerms } from "./glossary.mjs";

// ── Check 1: DNT Completeness ────────────────────────────────────────────────
/**
 * Verify that all Do-Not-Translate tokens are preserved.
 * @param {string} source - Original English content
 * @param {string} translated - Translated content
 * @returns {{ pass: boolean, fail: boolean, items: Array<{type:string, expected:string, message:string}> }}
 */
export function checkDNTCompleteness(source, translated) {
  const result = checkDNT(source, translated);
  const items = [];

  for (const token of result.missing) {
    items.push({
      type: "MISSING_DNT",
      expected: token,
      message: `DNT token "${token}" missing from translation`,
    });
  }

  for (const v of result.violations) {
    items.push({
      type: "PARTIAL_DNT",
      expected: v.expected,
      message: `DNT token "${v.expected}" partially translated: ${v.found}`,
    });
  }

  return {
    pass: items.length === 0,
// ── Check 2: Markdown Structure ──────────────────────────────────────────────
/**
 * Compare Markdown structure between source and translation.
 * Checks: heading levels, table columns, code blocks, link syntax.
 * @param {string} source - Original English content
 * @param {string} translated - Translated content
 * @returns {{ pass: boolean, fail: boolean, items: Array<{type:string, message:string}> }}
 */
export function checkMarkdownStructure(source, translated) {
  const items = [];

  // Headings: count of each level
  const srcHeadings = countHeadings(source);
  const tgtHeadings = countHeadings(translated);
  if (srcHeadings.total !== tgtHeadings.total) {
    items.push({
      type: "HEADING_COUNT_MISMATCH",
      message: `Heading count mismatch: source=${srcHeadings.total} translated=${tgtHeadings.total} (source: ${JSON.stringify(srcHeadings.byLevel)}, translated: ${JSON.stringify(tgtHeadings.byLevel)})`,
    });
  } else {
    // Check if any heading level is missing
    for (const [level, count] of Object.entries(srcHeadings.byLevel)) {
      if (tgtHeadings.byLevel[level] !== count) {
        items.push({
          type: "HEADING_LEVEL_MISMATCH",
          message: `Heading level ${level} count mismatch: source=${count} translated=${tgtHeadings.byLevel[level] || 0}`,
        });
      }
    }
  }

  // Tables: check column count consistency
  const srcTables = extractTables(source);
  const tgtTables = extractTables(translated);
  if (srcTables.length !== tgtTables.length) {
    items.push({
      type: "TABLE_COUNT_MISMATCH",
      message: `Table count mismatch: source=${srcTables.length} translated=${tgtTables.length}`,
    });
  } else {
    for (let i = 0; i < srcTables.length; i++) {
      const srcCols = srcTables[i];
      const tgtCols = tgtTables[i];
      if (srcCols !== tgtCols) {
        items.push({
          type: "TABLE_COLUMN_MISMATCH",
          message: `Table ${i + 1} column count mismatch: source=${srcCols} translated=${tgtCols}`,
        });
      }
    }
  }

  // Code blocks: check all are properly closed
  const srcCodeFences = (source.match(/```/g) || []).length;
  const tgtCodeFences = (translated.match(/```/g) || []).length;
  if (srcCodeFences !== tgtCodeFences) {
    items.push({
      type: "CODE_FENCE_MISMATCH",
      message: `Code fence count mismatch: source=${srcCodeFences} translated=${tgtCodeFences}`,
    });
// ── Check 3: Term Consistency ────────────────────────────────────────────────
/**
 * Verify glossary terms appear in translation.
 * @param {string} locale - Target locale
 * @param {string} translated - Translated content
 * @param {object} [glossary] - Pre-loaded glossary
 * @returns {{ pass: boolean, fail: boolean, items: Array<{type:string, term:string, message:string}>, hitRate: number }}
 */
export function checkTermConsistency(locale, translated, glossary) {
  const results = validateTerms(locale, translated, glossary);
  const items = [];
  const total = results.length;
  const hits = results.filter((r) => r.found).length;
  const hitRate = total > 0 ? Math.round((hits / total) * 100) : 100;

  for (const r of results) {
    if (!r.found) {
      items.push({
        type: "MISSING_TERM",
        term: r.en,
        message: `Glossary term "${r.en}" → "${r.translated}" not found in translation (category: ${r.category})`,
      });
    }
  }

  if (hitRate < 80 && total > 0) {
    items.push({
      type: "LOW_TERM_HIT_RATE",
      term: "",
      message: `Term hit rate ${hitRate}% (${hits}/${total}) — threshold is 80%`,
    });
  }

  return { pass: items.length === 0, fail: items.length > 0, items, hitRate };
}

// ── Check 4: Frontmatter Completeness ─────────────────────────────────────────
export function checkFrontmatter(sourceRaw, translatedRaw) {
  const items = [];
  const { frontmatterRaw: srcFm } = splitFrontmatter(sourceRaw);
// ── Check 5: Empty/Truncated Content ─────────────────────────────────────────
export function checkEmptyTruncated(source, translated) {
  const items = [];

  if (!translated || translated.trim().length === 0) {
    items.push({ type: "EMPTY_TRANSLATION", message: "Translated content is empty" });
    return { pass: false, fail: true, items };
  }

  const srcLen = source.trim().length;
  const tgtLen = translated.trim().length;
  const cjkRatio = (source.match(/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g) || []).length / srcLen;
  const minRatio = cjkRatio > 0.1 ? 0.2 : 0.3;

  if (tgtLen < srcLen * minRatio) {
    items.push({
      type: "TRUNCATED",
      message: `Translation appears truncated: ${tgtLen} chars vs ${srcLen} source chars (ratio: ${(tgtLen / srcLen * 100).toFixed(1)}%, min: ${(minRatio * 100).toFixed(0)}%)`,
    });
  }

  if (tgtLen > 50) {
    const lastChar = translated.trim().slice(-1);
    const srcLastChar = source.trim().slice(-1);
    if (/[.!?]/.test(srcLastChar) && !/[.!?」」！？。]/.test(lastChar)) {
      items.push({
        type: "POSSIBLY_TRUNCATED",
        message: `Translation may be truncated: ends with "${lastChar}" while source ends with "${srcLastChar}"`,
      });
    }
  }

  return { pass: items.length === 0, fail: items.length > 0, items };
}

// ── Check 6: Untranslated Placeholders ───────────────────────────────────────
export function checkUntranslated(translated) {
  const items = [];

  const untranslatedMarkers = translated.match(/\[UNTRANSLATED\]/g);
  if (untranslatedMarkers) {
    items.push({ type: "UNTRANSLATED_MARKER", message: `Found ${untranslatedMarkers.length} "[UNTRANSLATED]" marker(s)` });
  }

  const noCode = translated.replace(/```[\s\S]*?```/g, "");
  const noInline = noCode.replace(/`[^`]+`/g, "");
  const englishPassages = noInline.match(/[A-Za-z][A-Za-z\s,;:.!?'"-]{49,}[A-Za-z]/g);

  if (englishPassages) {
    for (const passage of englishPassages) {
      if (/^\s*(?:Grade|ASTM|AMS|ISO|Ti-|UNS|MPa|ksi)\b/.test(passage)) continue;
      if (/^\s*(?:Note|Table|Figure|Source|Based on|See|Refer to)\b/i.test(passage)) continue;
      if (/^[A-Z\s]{50,}$/.test(passage)) continue;
      items.push({ type: "ENGLISH_PASSAGE", message: `Found ${passage.length}-char English passage: "${passage.slice(0, 80)}..."` });
    }
  }

  return { pass: items.length === 0, fail: items.length > 0, items };
}

// ── Full QA Pipeline ──────────────────────────────────────────────────────────
export function runAllChecks({ source, translated, locale, glossary, sourceRaw, translatedRaw }) {
  const body = source;
  const bodyTranslated = translated;
  const srcRaw = sourceRaw || source;
  const tgtRaw = translatedRaw || translated;

  const results = {
    dnt: checkDNTCompleteness(body, bodyTranslated),
    markdown: checkMarkdownStructure(body, bodyTranslated),
    terms: checkTermConsistency(locale, bodyTranslated, glossary),
    frontmatter: checkFrontmatter(srcRaw, tgtRaw),
    emptyTruncated: checkEmptyTruncated(body, bodyTranslated),
    untranslated: checkUntranslated(bodyTranslated),
  };

  const totalFails = Object.values(results).filter((r) => r.fail).length;
  const totalItems = Object.values(results).reduce((sum, r) => sum + r.items.length, 0);

  return {
    pass: totalFails === 0,
    checks: results,
    summary: `${totalItems} issue(s) across ${totalFails} check(s)`,
  };
}

export default { checkDNTCompleteness, checkMarkdownStructure, checkTermConsistency, checkFrontmatter, checkEmptyTruncated, checkUntranslated, runAllChecks };
  const { frontmatterRaw: tgtFm } = splitFrontmatter(translatedRaw);

  if (!srcFm && !tgtFm) return { pass: true, fail: false, items: [] };
  if (!srcFm || !tgtFm) {
    items.push({ type: "FRONTMATTER_MISSING", field: "frontmatter", message: `Frontmatter missing in ${!tgtFm ? "translation" : "source"}` });
    return { pass: false, fail: true, items };
  }

  const src = parseFrontmatter(srcFm);
  const tgt = parseFrontmatter(tgtFm);

  for (const field of ["title", "description"]) {
    if (src[field] && !tgt[field]) {
      items.push({ type: "FRONTMATTER_FIELD_MISSING", field, message: `Field "${field}" missing in translation` });
    } else if (src[field] && tgt[field] === src[field] && src[field].length > 3) {
      if (!/^\d+$/.test(src[field]) && !/^[A-Z_]+$/.test(src[field])) {
        items.push({ type: "FRONTMATTER_UNTRANSLATED", field, message: `Field "${field}" appears untranslated: "${src[field]}"` });
      }
    }
  }

  for (const field of ["order", "page", "version", "weight", "priority", "index"]) {
    if (src[field] !== undefined && tgt[field] !== undefined && src[field] !== tgt[field]) {
      items.push({ type: "NUMERIC_FIELD_CHANGED", field, message: `Field "${field}" changed: ${src[field]} → ${tgt[field]}` });
    }
  }

  if (tgt.locale && src.locale && tgt.locale === src.locale) {
    items.push({ type: "LOCALE_UNCHANGED", field: "locale", message: `Locale unchanged: "${src.locale}"` });
  }

  return { pass: items.length === 0, fail: items.length > 0, items };
}
  }

  // Links: check count consistency
  const srcLinks = (source.match(/\[([^\]]*)\]\(([^)]*)\)/g) || []).length;
  const tgtLinks = (translated.match(/\[([^\]]*)\]\(([^)]*)\)/g) || []).length;
  if (srcLinks !== tgtLinks) {
    items.push({
      type: "LINK_COUNT_MISMATCH",
      message: `Link count mismatch: source=${srcLinks} translated=${tgtLinks}`,
    });
  }

  return {
    pass: items.length === 0,
    fail: items.length > 0,
    items,
  };
}

function countHeadings(text) {
  const lines = text.split("\n");
  const byLevel = {};
  let total = 0;
  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s/);
    if (match) {
      const level = match[1].length;
      byLevel[level] = (byLevel[level] || 0) + 1;
      total++;
    }
  }
  return { total, byLevel };
}

function extractTables(text) {
  const lines = text.split("\n");
  const tables = [];
  let inTable = false;
  let cols = 0;

  for (const line of lines) {
    if (line.trim().startsWith("|")) {
      const parts = line.split("|").filter((p) => p.trim() !== "");
      if (!inTable) {
        inTable = true;
        cols = parts.length;
      } else if (!line.includes("---")) {
        // This is a data row, check column count
        if (parts.length !== cols) {
          tables.push(cols);
          inTable = false;
        }
      }
    } else if (inTable) {
      tables.push(cols);
      inTable = false;
    }
  }
  if (inTable) tables.push(cols);
  return tables;
}
    fail: items.length > 0,
    items,
  };
}