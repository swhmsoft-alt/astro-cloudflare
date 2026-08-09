#!/usr/bin/env node
/**
 * check-procurement.mjs — GEO governance gate (procurement collection).
 *
 * Procurement is DECISION content, not evidence. Per the GEO Foundation
 * Blueprint (KEEP THE GAP), we must not fabricate commercial / engineering
 * numbers (lead times, MOQ, tolerances, certification requirements).
 *
 * This gate enforces that on the data layer:
 *   - `procurementCategory` and `decisionType` are legal enum values.
 *   - Any `typicalValues` entry that carries a non-empty `value` MUST have a
 *     real external `sourceUrl` (https…). A bare number without a verifiable
 *     source is a fabricated claim and fails the gate.
 *
 * Reads source Markdown directly (no build required). Runs before/independent
 * of a full build.
 *
 * Run: node scripts/check-procurement.mjs   (or pnpm check:procurement)
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIR = join(process.cwd(), "src/content/derived/procurement");
const CATEGORIES = ["rfq-preparation", "lead-time", "certification", "commercial", "quality-inspection"];
const DECISION_TYPES = ["CHECKLIST", "PROCEDURE", "VENDOR_CONFIRM"];

/** Extract the frontmatter block (between first and second `---`). */
function parseFrontmatter(raw) {
  const lines = raw.split(/\r?\n/);
  const start = lines.findIndex((l) => l.trim() === "---");
  if (start < 0) return { fm: "", body: raw };
  let end = -1;
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") { end = i; break; }
  }
  return { fm: lines.slice(start + 1, end).join("\n"), body: end < 0 ? "" : lines.slice(end + 1).join("\n") };
}

/** Pull a scalar frontmatter value by key (strips quotes). */
function fmValue(fm, key) {
  const m = fm.match(new RegExp(`^${key}\\s*:\\s*(.+)$`, "m"));
  return m ? m[1].trim().replace(/^["']|["']$/g, "") : undefined;
}

/** Parse a `typicalValues:` list of { label, value, notes, sourceUrl }. */
function listItems(fm, key) {
  const lines = fm.split(/\r?\n/);
  const start = lines.findIndex((l) => l.trim().startsWith(key + ":"));
  if (start < 0) return null;
  const items = [];
  let cur = null;
  const flush = () => { if (cur) items.push(cur); cur = null; };
  for (let i = start + 1; i < lines.length; i++) {
    const l = lines[i];
    const itemMatch = l.match(/^-\s*label:\s*(.*)$/);
    if (itemMatch) {
      flush();
      cur = { label: itemMatch[1].trim().replace(/^["']|["']$/g, "") };
      continue;
    }
    if (cur) {
      const kv = l.match(/^\s+(value|sourceUrl|notes):\s*(.*)$/);
      if (kv) cur[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
    }
  }
  flush();
  return items;
}

function main() {
  const errors = [];
  const warnings = [];
  const files = readdirSync(DIR).filter((f) => f.endsWith(".md"));

  for (const file of files) {
    const raw = readFileSync(join(DIR, file), "utf8").replace(/^\uFEFF/, "");
    const { fm, body } = parseFrontmatter(raw);

    const cat = fmValue(fm, "procurementCategory");
    if (cat === undefined) errors.push(`${file}: missing procurementCategory`);
    else if (!CATEGORIES.includes(cat)) errors.push(`${file}: invalid procurementCategory=${JSON.stringify(cat)}`);

    const dt = fmValue(fm, "decisionType");
    if (dt !== undefined && !DECISION_TYPES.includes(dt)) {
      errors.push(`${file}: invalid decisionType=${JSON.stringify(dt)}`);
    }

    const items = listItems(fm, "typicalValues");
    if (items && items.length) {
      for (const it of items) {
        const hasValue = typeof it.value === "string" && it.value.trim() !== "";
        const hasSource = typeof it.sourceUrl === "string" && it.sourceUrl.trim().startsWith("http");
        if (hasValue && !hasSource) {
          errors.push(`${file}: typicalValues[${it.label}] has a value but no verifiable sourceUrl (KEEP THE GAP — no fabricated commercial numbers)`);
        }
      }
    }

    if (!body.trim()) warnings.push(`${file}: empty body (decision content should carry guidance, not just frontmatter)`);
  }

  console.log(`procurement files scanned: ${files.length}`);
  if (warnings.length) {
    console.log(`\n${warnings.length} warning(s):`);
    for (const w of warnings) console.log("  ⚠ " + w);
  }

  if (errors.length) {
    console.error(`\n${errors.length} error(s):`);
    for (const e of errors) console.error("  ✖ " + e);
    process.exit(1);
  }
  console.log("\ncheck-procurement PASS (procurement content valid, no unsourced commercial claims).");
}

main();
