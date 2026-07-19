import { run } from "./knowledge-generator/pipelines/orchestrate.mjs";

const ctx = {
  startTime: Date.now(),
  config: { domain: "test", dryRun: true, verify: false, list: false },
  domains: [{ name: "test", definition: {} }],
  stats: { errors: [] },
  logger: { info: console.log, warn: console.log, error: console.log },
  outputPaths: {},
};

const r = await run(ctx);
console.log("\nPipeline result:", JSON.stringify(r, null, 2));
console.log("Final stats:", JSON.stringify(ctx.stats, null, 2));
console.log("errors:", ctx.stats.errors?.length);
