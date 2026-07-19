import { buildSchemaManifest, buildLmsManifest, buildRegistryManifest } from "../lib/schema-sync.mjs";

export async function run(ctx) {
  ctx.logger.info("Schema Generation Started");

  const content = ctx.linkedContent || ctx.validatedContent || [];
  if (content.length === 0) {
    ctx.logger.info("No content to process");
    return { success: true, stats: { schemaManifests: 0, lmsManifests: 0, registryManifests: 0 }, outputs: { schemaManifest: null, lmsManifest: null, registryManifest: null } };
  }

  const graph = ctx.outputs?.graph || ctx.linkedContent?.graph || { nodes: [], edges: [] };

  // Schema Manifest
  ctx.logger.info("  Building schema manifest...");
  const schemaResult = buildSchemaManifest(content, graph);
  if (schemaResult.errors && schemaResult.errors.length > 0) {
    for (const err of schemaResult.errors) ctx.logger.warn("  Schema error: " + err);
    return { success: false, error: "Schema validation failed: " + schemaResult.errors.join("; "), stats: { schemaManifests: 0 }, outputs: {} };
  }
  const schemaManifest = schemaResult;
  ctx.logger.info("  Schema entries: " + schemaManifest.entries.length);

  // LLMS Manifest
  ctx.logger.info("  Building LLMS manifest...");
  const lmsManifest = buildLmsManifest(content);
  ctx.logger.info("  LLMS entries: " + lmsManifest.count);

  // Registry Manifest
  ctx.logger.info("  Building registry manifest...");
  const registryManifest = buildRegistryManifest(content, ctx.plan);
  ctx.logger.info("  Registry entries: " + registryManifest.count);

  ctx.schemaManifest = schemaManifest;
  ctx.lmsManifest = lmsManifest;
  ctx.registryManifest = registryManifest;
  ctx.stats.schemaManifests = schemaManifest.entries.length;
  ctx.stats.lmsManifests = lmsManifest.count;
  ctx.stats.registryManifests = registryManifest.count;

  ctx.logger.info("Schema Generation Complete \u2014 " + schemaManifest.entries.length + " schemas, " + lmsManifest.count + " llms, " + registryManifest.count + " registry");

  return {
    success: true,
    stats: { schemaManifests: schemaManifest.entries.length, lmsManifests: lmsManifest.count, registryManifests: registryManifest.count },
    outputs: { schemaManifest, lmsManifest, registryManifest },
  };
}

export default run;
