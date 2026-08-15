#!/usr/bin/env node
/**
 * reporter.mjs — Progress reporting and statistics for translation pipeline.
 *
 * Tracks progress, timing, token usage, and generates summary reports.
 */

// ── State ─────────────────────────────────────────────────────────────────────
const _state = {
  startTime: null,
  endTime: null,
  total: 0,
  done: 0,
  skipped: 0,
  failed: 0,
  warnings: 0,
  totalTokens: 0,
  totalCost: 0,
  files: [],
  locale: null,
};

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Initialize reporter for a batch.
 * @param {object} opts
 * @param {string} opts.locale - Target locale
 * @param {number} opts.total - Total files to process
 */
export function init({ locale, total }) {
  _state.startTime = Date.now();
  _state.endTime = null;
  _state.locale = locale;
  _state.total = total;
  _state.done = 0;
  _state.skipped = 0;
  _state.failed = 0;
  _state.warnings = 0;
  _state.totalTokens = 0;
  _state.totalCost = 0;
  _state.files = [];
}

/**
 * Record a successful translation.
 * @param {object} opts
 * @param {string} opts.file - Source file name
 * @param {number} [opts.tokens] - Tokens used
 * @param {number} [opts.duration] - Duration in ms
 * @param {string} [opts.targetFile] - Target file path
 */
export function recordSuccess({ file, tokens = 0, duration = 0, targetFile }) {
  _state.done++;
  _state.totalTokens += tokens;
  _state.files.push({
    file,
    targetFile,
    status: "ok",
    tokens,
    duration,
  });
}

/**
 * Record a skipped file (already translated).
 * @param {string} file - Source file name
 * @param {string} [reason] - Skip reason
 */
export function recordSkip(file, reason = "already exists") {
  _state.skipped++;
  _state.files.push({
    file,
    status: "skipped",
    reason,
  });
}

/**
 * Record a failed translation.
 * @param {string} file - Source file name
 * @param {string} error - Error message
 */
export function recordFail(file, error) {
  _state.failed++;
  _state.files.push({
    file,
    status: "failed",
    error,
  });
}

/**
 * Record a warning (QA non-critical issue).
 * @param {string} file - Source file name
 * @param {string} message - Warning message
 */
export function recordWarning(file, message) {
  _state.warnings++;
  _state.files.push({
    file,
    status: "warning",
    message,
  });
}

/**
 * Get current progress percentage.
 * @returns {number} - 0-100
 */
export function progress() {
  if (_state.total === 0) return 0;
  return Math.round(((_state.done + _state.skipped + _state.failed) / _state.total) * 100);
}

/**
 * Generate a summary report string.
 * @returns {string}
 */
export function summary() {
  _state.endTime = Date.now();
  const elapsed = ((_state.endTime - _state.startTime) / 1000).toFixed(1);
  const pct = progress();

  const lines = [
    `[summary] locale=${_state.locale} total=${_state.total} done=${_state.done} skipped=${_state.skipped} failed=${_state.failed} warnings=${_state.warnings} progress=${pct}% time=${elapsed}s tokens=${_state.totalTokens}`,
  ];

  if (_state.failed > 0) {
    lines.push("[failed files]");
    for (const f of _state.files.filter((f) => f.status === "failed")) {
      lines.push(`  - ${f.file}: ${f.error}`);
    }
  }

  if (_state.warnings > 0) {
    lines.push("[warnings]");
    for (const f of _state.files.filter((f) => f.status === "warning")) {
      lines.push(`  - ${f.file}: ${f.message}`);
    }
  }

  return lines.join("\n");
}

/**
 * Get full state for report generation.
 * @returns {object}
 */
export function getState() {
  return { ..._state };
}

/**
 * Reset reporter state.
 */
export function reset() {
  _state.startTime = null;
  _state.endTime = null;
  _state.total = 0;
  _state.done = 0;
  _state.skipped = 0;
  _state.failed = 0;
  _state.warnings = 0;
  _state.totalTokens = 0;
  _state.totalCost = 0;
  _state.files = [];
  _state.locale = null;
}

export default { init, recordSuccess, recordSkip, recordFail, recordWarning, progress, summary, getState, reset };