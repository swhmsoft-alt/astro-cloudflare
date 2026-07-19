export function buildDomainPrompt(entity, filesToGenerate, relationships) {
  const slug = entity.slug;
  const entityType = entity.entityType;
  const hasEvidence = filesToGenerate.some((f) => f.collection === "evidence");
  const hasComparison = filesToGenerate.some((f) => f.collection === "comparisons");
  const hasFaq = filesToGenerate.some((f) => f.collection === "faqs");
  const hasGuide = filesToGenerate.some((f) => f.collection === "guides");

  const relSummary = Object.entries(relationships)
    .filter(([, v]) => v.length > 0)
    .map(([k, v]) => "  " + k + ": " + v.join(", "))
    .join("\n");

  const fileList = filesToGenerate.map((f) => "  - " + f.collection + "/" + f.slug + " (" + f.reason + ")").join("\n");

  const system = `You are a titanium manufacturing knowledge base content generator. You produce factual, technically accurate content for engineers, procurement managers, and manufacturers.

RULES:
1. Every statement must be technically accurate. Include specific numerical values.
2. Reference industry standards (ASTM, ISO, AS9100, NADCAP) where applicable.
3. Output VALID JSON ONLY. No markdown wrappers. No explanations.
4. JSON must have a top-level "files" array containing one object per file.
5. Each file object must have: collection (string), slug (string), frontmatter (object), body (string).
6. body must be valid Markdown with ## heading hierarchy.
7. frontmatter must match the target collection's schema.
8. frontmatter must include: locale (always "en"), title, description.
9. slug must be kebab-case lowercase.
10. description must be 2-3 sentences (120-200 characters).
11. Escape all special characters in JSON strings. Newlines in body must be escaped as \\n.`;

  const user = `Generate the following knowledge domain for ${entity.entityType}: ${slug}. Keep each body concise (200-400 words).

RELATIONSHIPS (use these slugs in frontmatter fields):
${relSummary || "  (none specified)"}

FILES TO GENERATE:
${fileList}

CONTENT REQUIREMENTS PER COLLECTION:

- materials: Include grade, alloy, standards[], industries[], processes[], finishes[], properties {density, tensileStrength, yieldStrength, hardness, maxTemp}. Body: ## Overview, ## Chemical Composition, ## Mechanical Properties, ## Physical Properties, ## Machining Guidelines, ## Applications, ## Standards.
- evidence: Include evidenceCategory (one of: material-properties, cutting-parameters, surface-roughness, tolerances, process-capabilities), source, sourceUrl. Body: ## Overview, ## Data Table (with property/value/unit/notes), ## Source, ## Methodology.
- comparisons: Include comparisonType (material, process, surface-finish, commercial), entityA, entityB, quickAnswer. Body: ## Quick Answer, ## Detailed Comparison, ## When to Choose A, ## When to Choose B.
- faqs: Include category. Body: ## Question (as heading), then answer in paragraph form.${hasGuide ? "\n- guides: Include guideType. Body: Step-by-step instructions with numbered steps." : ""}

Return only the JSON object with a "files" array.`;

  return { system, user };
}
