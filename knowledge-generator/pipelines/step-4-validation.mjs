const VALID_COLLECTIONS = new Set([
  "materials","processes","equipment","surfaceFinishes","industries","applications","standards",
  "evidence","comparisons","cases","guides","procurement","faqs","blog","services",
]);

const PLACEHOLDER_PATTERNS = [
  /todo/i, /coming\s+soon/i, /lorem\s+ipsum/i, /placeholder/i, /tbd/i, /\bxxx\b/i,
];

function checkFrontmatter(fm, slug) {
  if (!fm || typeof fm !== "object") return slug + ": frontmatter missing or not an object";
  if (!fm.title || typeof fm.title !== "string" || fm.title.trim().length === 0) return slug + ": title missing";
  if (!fm.description || typeof fm.description !== "string" || fm.description.trim().length === 0) return slug + ": description missing";
  return null;
}

function checkBody(body) {
  if (!body || body.trim().length === 0) return "body is empty";
  if (body.trim().length < 500) return "body too short (< 500 chars)";
  return null;
}

function checkHeadings(body) {
  const headings = body.match(/^##\s+.+/gm);
  if (!headings || headings.length === 0) return "no ## headings found";
  if (!headings.some((h) => h.toLowerCase().includes("overview"))) return "missing ## Overview section";
  return null;
}

function checkPlaceholders(body) {
  for (const pat of PLACEHOLDER_PATTERNS) {
    if (pat.test(body)) return "contains placeholder text";
  }
  return null;
}

function checkTechnicalDensity(body) {
  const numbers = body.match(/\b\d+(\.\d+)?\s*(mm|µm|MPa|GPa|°C|HRC|HV|N|s|m|g\/cm³|%|rpm|m\/min|mm\/rev|mm\/tooth)?\b/g);
  if (numbers && numbers.length >= 3) return null;
  const tables = body.match(/^\|.+\|$/gm);
  if (tables && tables.length >= 2) return null;
  return "insufficient technical data (< 3 numeric values, no comparison/spec table)";
}

function checkMarkdown(body) {
  const fences = body.match(/```/g);
  if (fences && fences.length % 2 !== 0) return "unmatched code fences";
  return null;
}

function checkCollection(collection) {
  if (!collection) return "collection field missing";
  if (!VALID_COLLECTIONS.has(collection)) return "unknown collection: " + collection;
  return null;
}

export async function run(ctx) {
  ctx.logger.info("Validation Started");

  const content = ctx.generatedContent || [];
  if (content.length === 0) {
    ctx.logger.info("No content to validate");
    return { success: true, stats: { validatedFiles: 0, passed: 0, failed: 0 }, outputs: { validatedContent: [], report: { total: 0, passed: 0, failed: 0, warnings: [] } } };
  }

  const validated = [];
  const warnings = [];
  let passed = 0, failed = 0;

  for (const item of content) {
    const { collection, slug, frontmatter, body } = item;
    const itemWarnings = [];
    let fail = false;

    // Collection validation
    const colErr = checkCollection(collection);
    if (colErr) { fail = true; ctx.logger.warn("FAIL " + collection + "/" + slug + ": " + colErr); continue; }

    // Frontmatter
    const fmErr = checkFrontmatter(frontmatter, slug);
    if (fmErr) { fail = true; ctx.logger.warn("FAIL " + collection + "/" + slug + ": " + fmErr); }

    // Body
    const bodyErr = checkBody(body);
    if (bodyErr) { fail = true; ctx.logger.warn("FAIL " + collection + "/" + slug + ": " + bodyErr); }

    // Headings
    const hErr = checkHeadings(body);
    if (hErr) { fail = true; ctx.logger.warn("FAIL " + collection + "/" + slug + ": " + hErr); }

    // Placeholders
    const plErr = checkPlaceholders(body);
    if (plErr) { fail = true; ctx.logger.warn("FAIL " + collection + "/" + slug + ": " + plErr); }

    // Technical density
    const tdErr = checkTechnicalDensity(body);
    if (tdErr) { fail = true; ctx.logger.warn("FAIL " + collection + "/" + slug + ": " + tdErr); }

    // Markdown integrity
    const mdErr = checkMarkdown(body);
    if (mdErr) { fail = true; ctx.logger.warn("FAIL " + collection + "/" + slug + ": " + mdErr); }

    // Non-blocking warnings
    if (body && body.trim().length < 1000) itemWarnings.push("body under 1000 chars");
    if (body && !body.includes("|")) itemWarnings.push("no table detected");
    if (body && !body.includes("- ") && !body.includes("* ")) itemWarnings.push("no list detected");
    for (const w of itemWarnings) warnings.push(collection + "/" + slug + ": " + w);

    if (fail) {
      failed++;
    } else {
      passed++;
      validated.push({ ...item, validation: { passed: true, warnings: itemWarnings } });
      ctx.logger.info("PASS  " + collection + "/" + slug);
    }
  }

  const report = { total: content.length, passed, failed, warnings };

  if (failed > 0) {
    ctx.logger.info("Validation Complete \u2014 Passed: " + passed + "  Failed: " + failed + "  Warnings: " + warnings.length);
    return { success: false, stats: { validatedFiles: content.length, passed, failed }, outputs: { validatedContent: validated, report } };
  }

  ctx.validatedContent = validated;
  ctx.stats.validatedFiles = content.length;
  ctx.stats.passedValidation = passed;
  ctx.stats.failedValidation = failed;

  ctx.logger.info("Validation Complete \u2014 Passed: " + passed + "  Warnings: " + warnings.length);
  return { success: true, stats: { validatedFiles: content.length, passed, failed }, outputs: { validatedContent: validated, report } };
}

export default run;
