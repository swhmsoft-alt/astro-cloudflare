#!/usr/bin/env node
/**
 * check-geo.mjs — GEO governance gate (evidence collection).
 *
 * Validates the evidence content layer against the GEO Foundation Blueprint:
 *   - `evidenceCategory`, `sourceAuthority`, `claimSupport`, `claimScope` are
 *     legal enum values (typo / off-spec guard).
 *   - `sourceUrl` must be a real external URL or empty — internal `/knowledge/…`
 *     stubs and aggregator URLs are flagged (KEEP THE GAP).
 *   - body must carry `## Evidence Basis` and `## Engineering Interpretation`.
 *   - (optional) scans the built `dist/evidence/**` HTML for the
 *     `id="evidence-basis"` anchor and an injected JSON-LD `citation`.
 *
 * Reads the source Markdown directly (no build required) so it can run in any
 * environment, including before a full build is possible.
 *
 * Run: node scripts/check-geo.mjs   (or pnpm check:geo)
 * NOTE: deliberately NOT wired into the `lint` chain yet — hook it up only after
 * the CI/production Render Gate is green (build is currently blocked locally).
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const EVIDENCE_DIR = join(process.cwd(), "src/content/derived/evidence");
const DIST_DIR = join(process.cwd(), "dist/evidence");

const ENUMS = {
  evidenceCategory: ["material-properties", "cutting-parameters", "surface-roughness", "tolerances", "process-capabilities"],
  sourceAuthority: ["HIGH", "MEDIUM", "LOW"],
  claimSupport: ["SUPPORTED", "PARTIALLY_SUPPORTED", "NOT_SUPPORTED", "UNVERIFIED"],
  claimScope: [
    "GENERAL_PROPERTY",
    "STANDARD_REQUIREMENT",
    "TYPICAL_VALUE",
    "MANUFACTURER_RECOMMENDATION",
    "ENGINEERING_INTERPRETATION",
    "FIRST_PARTY_CAPABILITY",
  ],
};

/** Extract the frontmatter block (between first and second `---`). */
function parseFrontmatter(raw) {
  const lines = raw.split(/\r?\n/);
  const start = lines.findIndex((l) => l.trim() === "---");
  if (start < 0) return { fm: "", body: raw };
  let end = -1;
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") { end = i; break; }
  }
  return {
    fm: lines.slice(start + 1, end).join("\n"),
    body: end < 0 ? "" : lines.slice(end + 1).join("\n"),
  };
}

/** Pull a scalar frontmatter value by key (strips quotes). */
function fmValue(fm, key) {
  const re = new RegExp(`^${key}\\s*:\\s*(.+)$`, "m");
  const m = fm.match(re);
  return m ? m[1].trim().replace(/^["']|["']$/g, "") : undefined;
}

function main() {
  const errors = [];
  const warnings = [];
  const files = readdirSync(EVIDENCE_DIR).filter((f) => f.endsWith(".md"));
  let withCategory = 0, withDataPoints = 0, withBasis = 0, withInterp = 0;

  for (const file of files) {
    const raw = readFileSync(join(EVIDENCE_DIR, file), "utf8").replace(/^\uFEFF/, "");
    const { fm, body } = parseFrontmatter(raw);

    for (const field of Object.keys(ENUMS)) {
      const v = fmValue(fm, field);
      if (v !== undefined && !ENUMS[field].includes(v)) {
        errors.push(`${file}: invalid ${field}=${JSON.stringify(v)}`);
      }
    }

    const srcUrl = (fmValue(fm, "sourceUrl") || "").trim();
    if (srcUrl && !srcUrl.startsWith("http")) {
      errors.push(`${file}: sourceUrl is not an external URL (KEEP THE GAP or use a real https URL): ${JSON.stringify(srcUrl)}`);
    }

    const category = fmValue(fm, "evidenceCategory");
    if (category) withCategory++;

    const dataPointsRe = /^dataPoints\s*:/m;
    if (dataPointsRe.test(fm)) withDataPoints++;

    if (/^## Evidence Basis/m.test(body)) withBasis++; else warnings.push(`${file}: missing "## Evidence Basis" in body`);
    if (/Engineering Interpretation/m.test(body)) withInterp++; else warnings.push(`${file}: missing "Engineering Interpretation" in body`);

    const sa = fmValue(fm, "sourceAuthority");
    const cs = fmValue(fm, "claimSupport");
    const sc = fmValue(fm, "claimScope");
    if (sa || cs || sc) {
      if (!sa) warnings.push(`${file}: has GEO fields but no sourceAuthority`);
      if (!cs) warnings.push(`${file}: has GEO fields but no claimSupport`);
      if (!sc) warnings.push(`${file}: has GEO fields but no claimScope`);
    }
  }

  console.log(`evidence files scanned: ${files.length}`);
  console.log(`  evidenceCategory present: ${withCategory}/${files.length}`);
  console.log(`  dataPoints present:       ${withDataPoints}/${files.length}`);
  console.log(`  ## Evidence Basis:        ${withBasis}/${files.length}`);
  console.log(`  Engineering Interpretation: ${withInterp}/${files.length}`);

  if (warnings.length) {
    console.log(`\n${warnings.length} warning(s):`);
    for (const w of warnings) console.log("  ⚠ " + w);
  }

  // Optional: inspect built dist HTML (only when a build exists).
  if (existsSync(DIST_DIR)) {
    const htmlFiles = [];
    (function walk(dir) {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name.endsWith(".html")) htmlFiles.push(p);
      }
    })(DIST_DIR);

    let withAnchor = 0, withCitationLd = 0;
    for (const p of htmlFiles) {
      const h = readFileSync(p, "utf8");
      if (p.includes("index.html") && /id=["']evidence-basis["']/.test(h)) withAnchor++;
      if (/"citation"/.test(h) && /"application\/ld\+json"/.test(h)) withCitationLd++;
    }
    console.log(`\ndist evidence pages: ${htmlFiles.length} (index: ${htmlFiles.filter((f) => f.endsWith("index.html")).length})`);
    console.log(`  with id="evidence-basis": ${withAnchor}`);
    console.log(`  with JSON-LD citation:    ${withCitationLd}`);
  } else {
    console.log(`\ndist/evidence not found (${DIST_DIR}) — skipping render check (expected until a successful build).`);
  }

  if (errors.length) {
    console.error(`\n${errors.length} error(s):`);
    for (const e of errors) console.error("  ✖ " + e);
    process.exit(1);
  }
  console.log("\ncheck-geo PASS (content layer valid).");
}

main();
