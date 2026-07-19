import { generate } from "../lib/deepseek.mjs";
import { buildDomainPrompt } from "../prompts/base.mjs";

export async function run(ctx) {
  ctx.logger.info("Generation Started");

  const plan = ctx.plan;
  if (!plan || !plan.filesToGenerate || plan.filesToGenerate.length === 0) {
    if (plan && plan.existingFiles && plan.existingFiles.length > 0) {
      ctx.logger.info("All files already exist \u2014 nothing to generate");
      return { success: true, stats: { generatedFiles: 0, requestedFiles: 0 }, outputs: { generatedContent: [] } };
    }
    return { success: false, error: "No generation plan available" };
  }

  if (ctx.config.dryRun) {
    ctx.logger.info("Dry-run mode \u2014 skipping DeepSeek call");
    ctx.logger.info("Would generate " + plan.filesToGenerate.length + " files:");
    for (const f of plan.filesToGenerate) ctx.logger.info("  " + f.collection + "/" + f.slug + " (P" + f.priority + ")");
    return { success: true, stats: { generatedFiles: 0, requestedFiles: plan.filesToGenerate.length }, outputs: { generatedContent: [] } };
  }

  const entity = plan.entity;
  const filesToGenerate = plan.filesToGenerate;
  const relationships = plan.relationships || {};

  // ── Build combined prompt ──
  const prompt = buildDomainPrompt(entity, filesToGenerate, relationships);

  // ── Call DeepSeek (one call per domain) ──
  ctx.logger.info("Requesting " + filesToGenerate.length + " files via DeepSeek...");
  const startTime = Date.now();

  let result;
  try {
    result = await generate({
      systemPrompt: prompt.system,
      userPrompt: prompt.user,
      temperature: 0.1,
      maxTokens: 4096,
    });
  } catch (err) {
    ctx.logger.error("DeepSeek API error: " + (err.name || "Error") + " — " + err.message);
    return { success: false, error: "DeepSeek API: " + err.message, stats: { generatedFiles: 0, requestedFiles: filesToGenerate.length }, outputs: { generatedContent: [] } };
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  ctx.logger.info("DeepSeek responded in " + elapsed + "s (" + (result.usage?.total_tokens || "?") + " tokens)");

  // ── Parse JSON response ──
  let parsed;
  try {
    parsed = parseResponse(result.content);
  } catch (err) {
    // One retry for invalid JSON
    ctx.logger.warn("JSON parse failed, retrying with stricter prompt...");
    try {
      result = await generate({
        systemPrompt: prompt.system + "\nReturn VALID JSON ONLY. No markdown wrappers. No explanations.",
        userPrompt: prompt.user,
        temperature: 0.1,
        maxTokens: 2000,
      });
      parsed = parseResponse(result.content);
    } catch (err2) {
      ctx.logger.error("JSON parse failed after retry: " + err2.message);
      return { success: false, error: "Failed to parse DeepSeek response as JSON: " + err2.message, stats: { generatedFiles: 0, requestedFiles: filesToGenerate.length }, outputs: { generatedContent: [] } };
    }
  }

  // ── Validate ──
  if (!parsed.files || !Array.isArray(parsed.files) || parsed.files.length === 0) {
    ctx.logger.error("Response has no 'files' array");
    return { success: false, error: "Response missing 'files' array", stats: { generatedFiles: 0, requestedFiles: filesToGenerate.length }, outputs: { generatedContent: [] } };
  }

  const valid = [];
  const warnings = [];
  for (const f of parsed.files) {
    if (!f.collection) { warnings.push("Entry missing collection field"); continue; }
    if (!f.slug) { warnings.push("Entry missing slug field"); continue; }
    if (!f.body || f.body.trim().length === 0) { warnings.push(f.slug + " has empty body"); continue; }
    if (!f.frontmatter || typeof f.frontmatter !== "object") {
      // Accept as-is but note
    }
    valid.push({
      collection: f.collection,
      slug: f.slug,
      frontmatter: f.frontmatter || {},
      body: f.body,
    });
  }

  if (warnings.length > 0) {
    for (const w of warnings) ctx.logger.warn("  " + w);
  }

  ctx.generatedContent = valid;
  ctx.stats.generatedFiles = valid.length;
  ctx.stats.requestedFiles = filesToGenerate.length;

  ctx.logger.info("Generated " + valid.length + "/" + filesToGenerate.length + " files in " + elapsed + "s");

  return {
    success: true,
    stats: { generatedFiles: valid.length, requestedFiles: filesToGenerate.length },
    outputs: { generatedContent: valid },
  };
}

function parseResponse(raw) {
  let text = raw.trim();

  // Strip markdown code fences if present
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) text = fenceMatch[1].trim();

  // Try direct parse
  try { return JSON.parse(text); } catch { /* not valid JSON, try fallback */ }

  // Try finding the first complete JSON object (handles truncated/unterminated responses)
  let depth = 0;
  let inString = false;
  let escape = false;
  let lastBrace = -1;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (escape) { escape = false; continue; }
    if (ch === "\\" && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{") depth++;
    else if (ch === "}") { depth--; if (depth === 0) lastBrace = i; }
  }
  // Try from first { to the last balanced }
  if (lastBrace > 0) {
    const firstBrace = text.indexOf("{");
    try { return JSON.parse(text.slice(firstBrace, lastBrace + 1)); } catch { /* still invalid, throw below */ }
  }

  throw new Error("Cannot parse JSON. Preview: " + JSON.stringify(text.slice(0, 200)));
}

export default run;
