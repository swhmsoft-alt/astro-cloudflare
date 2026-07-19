import { resolve, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === "development";

const STEP_MODULES = [
  { num: 1, name: "Entity Discovery",      file: "step-1-discovery.mjs" },
  { num: 2, name: "Knowledge Planning",     file: "step-2-planning.mjs" },
  { num: 3, name: "Content Generation",     file: "step-3-generation.mjs" },
  { num: 4, name: "Validation",             file: "step-4-validation.mjs" },
  { num: 5, name: "Knowledge Graph Linking", file: "step-5-linking.mjs" },
  { num: 6, name: "Schema Generation",      file: "step-6-schema.mjs" },
  { num: 7, name: "Registry Update",        file: "step-7-registry.mjs" },
  { num: 8, name: "Build Verification",     file: "step-8-build.mjs" },
  { num: 9, name: "Checkpoint Report",      file: "step-9-report.mjs" },
];

class PipelineError extends Error {
  constructor(msg, step) {
    super(msg);
    this.name = "PipelineError";
    this.step = step;
  }
}

async function loadStep(fileName) {
  const fp = resolve(__dirname, fileName);
  const mod = await import(pathToFileURL(fp).href);
  return mod.run || mod.default;
}

async function executeStep(stepDef, ctx) {
  ctx.logger.info(`START  Step ${stepDef.num}: ${stepDef.name}`);
  const start = Date.now();

  try {
    const fn = await loadStep(stepDef.file);
    if (typeof fn !== "function") {
      ctx.logger.warn(`Step ${stepDef.num} has no run() export \u2014 skipping`);
      ctx.stats.skipped = (ctx.stats.skipped || 0) + 1;
      ctx.logger.info(`SKIP   Step ${stepDef.num} (${((Date.now() - start) / 1000).toFixed(1)}s)`);
      return { success: true, stats: {}, warnings: [], outputs: {} };
    }

    const result = await fn(ctx);
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);

    if (result && result.success === false) {
      ctx.logger.error(`FAIL   Step ${stepDef.num}: ${result.error || "Unknown error"}`);
      throw new PipelineError(result.error || `Step ${stepDef.num} failed`, stepDef.name);
    }

    if (result?.stats) {
      for (const [key, val] of Object.entries(result.stats)) {
        if (key === "errors") continue; // pipeline error tracking, not step stat
        if (typeof val === "number") ctx.stats[key] = (ctx.stats[key] || 0) + val;
      }
    }
    if (result?.warnings?.length > 0) {
      for (const w of result.warnings) ctx.logger.warn(w);
    }

    ctx.stats.stepsCompleted = (ctx.stats.stepsCompleted || 0) + 1;
    ctx.logger.info(`PASS   Step ${stepDef.num} (${elapsed}s)`);
    return result;
  } catch (err) {
    if (err instanceof PipelineError) throw err;
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    const msg = isDev ? `${err.message}\n${err.stack}` : err.message;
    ctx.logger.error(`FAIL   Step ${stepDef.num} (${elapsed}s): ${msg}`);
    throw new PipelineError(err.message || `Unexpected error in step ${stepDef.num}`, stepDef.name);
  }
}

export async function run(ctx) {
  const pipelineStart = Date.now();
  ctx.stats.stepsCompleted = 0;
  ctx.stats.skipped = 0;
  const fail = { step: null, error: null };

  for (const stepDef of STEP_MODULES) {
    try {
      await executeStep(stepDef, ctx);
    } catch (err) {
      fail.step = err.step || stepDef.name;
      fail.error = err.message || "Pipeline execution failed";
      ctx.stats.errors.push(`Step ${stepDef.num} (${fail.step}): ${err.message}`);
      break;
    }
  }

  const totalElapsed = ((Date.now() - pipelineStart) / 1000).toFixed(1);

  ctx.pipelineResult = {
    success: fail.step === null,
    totalSteps: STEP_MODULES.length,
    completedSteps: ctx.stats.stepsCompleted,
    skippedSteps: ctx.stats.skipped,
    failedStep: fail.step,
    failedError: fail.error,
    elapsed: totalElapsed,
    stats: { ...ctx.stats },
  };

  return ctx.pipelineResult;
}

export default run;
