import { loadExistingRegistry, mergeRegistry, persistRegistry, hasChanges } from "../lib/registry-sync.mjs";

export async function run(ctx) {
  ctx.logger.info("Registry Update Started");

  const registryManifest = ctx.registryManifest || ctx.outputs?.registryManifest;
  if (!registryManifest || !registryManifest.entries || registryManifest.entries.length === 0) {
    ctx.logger.info("No registry entries to process");
    return { success: true, stats: { inserted: 0, updated: 0, unchanged: 0, skipped: 0, errors: 0 }, outputs: { registryChanged: false } };
  }

  if (ctx.config.dryRun) {
    ctx.logger.info("Dry-run — would add " + registryManifest.entries.length + " registry entries");
    return { success: true, stats: { inserted: registryManifest.entries.length, updated: 0, unchanged: 0, skipped: 0, errors: 0 }, outputs: { registryChanged: false } };
  }

  // Load existing
  const existing = loadExistingRegistry();
  if (existing.error) {
    ctx.logger.error(existing.error);
    return { success: false, error: existing.error, stats: { inserted: 0, updated: 0, unchanged: 0, skipped: 0, errors: 1 } };
  }

  ctx.logger.info("  Existing entries: " + existing.pages.length);

  // Merge
  const mergeResult = mergeRegistry(existing.pages, registryManifest.entries);
  for (const err of mergeResult.errors) ctx.logger.warn("  " + err);
  ctx.logger.info("  Inserted: " + mergeResult.stats.inserted + "  Updated: " + mergeResult.stats.updated + "  Unchanged: " + mergeResult.stats.unchanged);

  // Persist if changes
  if (!hasChanges(mergeResult.entries, mergeResult.stats)) {
    ctx.logger.info("No registry changes needed");
    ctx.stats.registryInserted = 0;
    ctx.stats.registryUpdated = 0;
    return { success: true, stats: { inserted: 0, updated: 0, unchanged: mergeResult.stats.unchanged, skipped: 0, registryErrors: mergeResult.errors.length }, outputs: { registryChanged: false } };
  }

  const persistResult = persistRegistry(mergeResult.entries);
  if (!persistResult.success) {
    ctx.logger.error("Persistence failed: " + persistResult.error);
    return { success: false, error: persistResult.error, stats: { inserted: 0, updated: 0, unchanged: 0, skipped: 0, errors: 1 } };
  }

  ctx.stats.registryInserted = mergeResult.stats.inserted;
  ctx.stats.registryUpdated = mergeResult.stats.updated;
  ctx.stats.registryUnchanged = mergeResult.stats.unchanged;

  ctx.logger.info("Registry Update Complete — " + mergeResult.stats.inserted + " inserted, " + mergeResult.stats.updated + " updated");
  return { success: true, stats: { inserted: mergeResult.stats.inserted, updated: mergeResult.stats.updated, unchanged: mergeResult.stats.unchanged, skipped: 0, registryErrors: mergeResult.errors.length }, outputs: { registryChanged: true } };
}

export default run;
