#!/usr/bin/env node
/**
 * qa-gate.mjs - QA gate for translated content.
 *
 * Each check returns { pass, fail, items }.
 * runAllChecks() aggregates all checks and returns { pass, fail, items, summary }.
 *
 * Called from translate.mjs:119 with shape:
 *   runAllChecks({ source, translated, locale, glossary, sourceRaw, translatedRaw })
 *
 * where source/translated are the BODY parts (frontmatter already stripped by splitFrontmatter).
 */
import { checkDNT, splitFrontmatter, parseFrontmatter } from './markdown.mjs';
import { validateTerms } from './glossary.mjs';

// ── Count markdown headings by level ──────────────────────────────────────────
function countHeadings(text) {
  const byLevel = {};
  let total = 0;
  if (!text) return { total: 0, byLevel };
  const lines = text.split('\n');
  for (const line of lines) {
    const m = line.match(/^#{1,6}\s+/);
    if (m) {
      const level = m[0].trim().length;
      byLevel[level] = (byLevel[level] || 0) + 1;
      total++;
    }
  }
  return { total, byLevel };
}

// ── DNT completeness ──────────────────────────────────────────────────────────
export function checkDNTCompleteness(source, translated) {
  const result = checkDNT(source || '', translated || '');
  const items = [];
  for (const token of result.missing) {
    items.push({ type: 'MISSING_DNT', expected: token, message: 'DNT token "' + token + '" missing from translation' });
  }
  for (const v of result.violations) {
    items.push({ type: 'PARTIAL_DNT', expected: v.expected, message: 'DNT token "' + v.expected + '" partially translated: ' + v.found });
  }
  return { pass: items.length === 0, fail: items.length > 0, items };
}

// ── Markdown structure (headings) ────────────────────────────────────────────
export function checkMarkdownStructure(source, translated) {
  const items = [];
  const srcHeadings = countHeadings(source);
  const tgtHeadings = countHeadings(translated);
  if (srcHeadings.total !== tgtHeadings.total) {
    items.push({ type: 'HEADING_COUNT_MISMATCH', message: 'Heading count mismatch: source=' + srcHeadings.total + ' translated=' + tgtHeadings.total });
  } else {
    for (const [level, count] of Object.entries(srcHeadings.byLevel)) {
      if (tgtHeadings.byLevel[level] !== count) {
        items.push({ type: 'HEADING_LEVEL_MISMATCH', message: 'Heading level ' + level + ' count mismatch: source=' + count + ' translated=' + (tgtHeadings.byLevel[level] || 0) });
      }
    }
  }
  return { pass: items.length === 0, fail: items.length > 0, items };
}

// ── Glossary / terminology consistency ───────────────────────────────────────
export function checkGlossaryTerms(locale, translated, glossary) {
  const results = validateTerms(locale, translated || '', glossary);
  const items = [];
  const misses = results.filter(function(r) { return !r.found; });
  for (const m of misses) {
    items.push({ type: 'GLOSSARY_MISSING', en: m.en, expected: m.translated, category: m.category, message: 'Expected glossary term "' + m.translated + '" (EN: "' + m.en + '", category: ' + m.category + ') not found' });
  }
  return { pass: items.length === 0, fail: items.length > 0, items };
}

// ── Length-difference sanity check ────────────────────────────────────────────
export function checkLengthDiff(source, translated) {
  const items = [];
  const sLen = (source || '').length;
  const tLen = (translated || '').length;
  if (sLen === 0 && tLen === 0) return { pass: true, fail: false, items };
  if (sLen === 0) {
    items.push({ type: 'LENGTH_ZERO_SOURCE', message: 'Source body is empty' });
    return { pass: false, fail: true, items };
  }
  const ratio = tLen / sLen;
  if (ratio < 0.4) {
    items.push({ type: 'LENGTH_TOO_SHORT', message: 'Translated text too short: ratio=' + ratio.toFixed(2) + ' (source=' + sLen + ', translated=' + tLen + ')' });
  } else if (ratio > 2.5) {
    items.push({ type: 'LENGTH_TOO_LONG', message: 'Translated text too long: ratio=' + ratio.toFixed(2) + ' (source=' + sLen + ', translated=' + tLen + ')' });
  }
  return { pass: items.length === 0, fail: items.length > 0, items };
}

// ── Frontmatter integrity ─────────────────────────────────────────────────────
export function checkFrontmatterIntegrity(translatedRaw) {
  const items = [];
  if (!translatedRaw) {
    items.push({ type: 'NO_CONTENT', message: 'Translated content is empty' });
    return { pass: false, fail: true, items };
  }
  const { frontmatterRaw } = splitFrontmatter(translatedRaw);
  if (!frontmatterRaw) {
    return { pass: true, fail: false, items };
  }
  const fm = parseFrontmatter(frontmatterRaw);
  if (!fm || typeof fm !== 'object') {
    items.push({ type: 'INVALID_FRONTMATTER', message: 'Frontmatter could not be parsed' });
    return { pass: false, fail: true, items };
  }
  return { pass: true, fail: false, items };
}

// ── Aggregated runAllChecks ───────────────────────────────────────────────────
export function runAllChecks({ source, translated, locale, glossary, sourceRaw, translatedRaw }) {
  const checks = [
    checkDNTCompleteness(source || sourceRaw || '', translated || translatedRaw || ''),
    checkMarkdownStructure(source || '', translated || ''),
    checkGlossaryTerms(locale, translated || translatedRaw || '', glossary),
    checkLengthDiff(source || '', translated || ''),
    checkFrontmatterIntegrity(translatedRaw || translated || ''),
  ];
  const allItems = [];
  let anyFail = false;
  for (const c of checks) {
    if (!c.pass) anyFail = true;
    for (const item of (c.items || [])) allItems.push(item);
  }
  const summary = allItems.length > 0
    ? allItems.map(function(i) { return (i.type || 'ISSUE') + ': ' + (i.message || ''); }).join('; ')
    : 'All QA checks passed';
  return { pass: !anyFail, fail: anyFail, items: allItems, summary };
}

// ── Default export ────────────────────────────────────────────────────────────
export default {
  checkDNTCompleteness,
  checkMarkdownStructure,
  checkGlossaryTerms,
  checkLengthDiff,
  checkFrontmatterIntegrity,
  runAllChecks,
};