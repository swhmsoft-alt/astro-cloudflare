import { mkdirSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = resolve(__dirname, "..", "reports");

const STEP_NAMES = [
  "Entity Discovery",
  "Knowledge Planning",
  "Content Generation",
  "Validation",
  "Knowledge Graph Linking",
  "Schema Generation",
  "Registry Update",
  "Build Verification",
  "Checkpoint Report",
];

function ensureDir() {
  if (!existsSync(REPORTS_DIR)) mkdirSync(REPORTS_DIR, { recursive: true });
}

function pad(s, n) { return String(s).padEnd(n); }

function buildStepTable(ctx, pipelineResult) {
  const completed = ctx.stats.stepsCompleted || 0;
  const skipped = ctx.stats.skipped || 0;
  const lines = [];
  for (let i = 0; i < STEP_NAMES.length; i++) {
    const stepNum = i + 1;
    let status = "PASS";
    if (pipelineResult?.failedStep && pipelineResult.failedStep === STEP_NAMES[i]) status = "FAIL";
    else if (stepNum > completed + skipped) status = "—";
    else if (skipped > 0 && stepNum > completed && status !== "FAIL") status = "SKIP";
    lines.push(`| ${stepNum} | ${pad(STEP_NAMES[i], 26)} | ${pad(status, 6)} |`);
  }
  return lines.join("\n");
}

function v(v) { return v ?? 0; }

export async function run(ctx) {
  const log = ctx.logger;
  log.info("Checkpoint Report Started");

  const now = new Date();
  const ts = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const domain = ctx.config?.domain || "unknown";
  const filename = ts + "_" + domain + ".md";
  const filepath = resolve(REPORTS_DIR, filename);

  const errArr2 = Array.isArray(ctx.stats.errors) ? ctx.stats.errors : [];
  const overallSuccess = errArr2.length === 0;
  const s = ctx.stats || {};
  const elapsed = ((Date.now() - ctx.startTime) / 1000).toFixed(1);

  const report = [
    "# Knowledge Generator Checkpoint",
    "",
    "## Execution",
    "",
    `- **Domain**: ${domain}`,
    `- **Started**: ${new Date(ctx.startTime).toISOString()}`,
    `- **Completed**: ${now.toISOString()}`,
    `- **Elapsed**: ${elapsed}s`,
    `- **Status**: ${overallSuccess ? "SUCCESS" : "FAILED"}`,
    "",
    "## Pipeline",
    "",
    "| # | Step | Status |",
    "|---|------|--------|",
    buildStepTable(ctx, null),
    "",
    "## Generation Summary",
    "",
    `- **Existing files reused**: ${v(s.plannedReuse)}`,
    `- **Files generated**: ${v(s.generatedFiles)}`,
    `- **Files skipped**: ${v(s.skipped)}`,
    `- **Discovery existing**: ${v(s.existingFiles)}`,
    `- **Discovery missing**: ${v(s.missingFiles)}`,
    `- **Validation passed**: ${v(s.passedValidation)}`,
    `- **Validation failed**: ${v(s.failedValidation)}`,
    "",
    "## Knowledge Graph",
    "",
    `- **Nodes**: ${v(s.graphNodes)}`,
    `- **Edges**: ${v(s.graphEdges)}`,
    `- **Linked entities**: ${v(s.graphLinked)}`,
    `- **Orphans**: ${v(s.graphOrphans)}`,
    "",
    "## Schema & Registry",
    "",
    `- **Schema manifests**: ${v(s.schemaManifests)}`,
    `- **LLMS manifests**: ${v(s.lmsManifests)}`,
    `- **Registry entries added**: ${v(s.registryInserted)}`,
    `- **Registry entries updated**: ${v(s.registryUpdated)}`,
    "",
    "## Build Verification",
    "",
    `- **Build**: ${overallSuccess ? "PASS" : "FAIL"}`,
    `- **Build time**: ${s.buildTime || "N/A"}s`,
    `- **Dist verified**: ${s.buildResult?.dist?.verified ? "YES" : "N/A"}`,
    "",
    "---",
    "",
    `*Report generated: ${now.toISOString()}*`,
    "",
  ].join("\n");

  // Write report
  ensureDir();
  writeFileSync(filepath, report, "utf8");

  ctx.reportPath = filepath;
  ctx.stats.reportGenerated = 1;

  // Console summary
  const divider = "=".repeat(55);
  log.info(divider);
  log.info("  Knowledge Generator Checkpoint");
  log.info(divider);
  log.info("  Domain:   " + domain);
  log.info("  Status:   " + (overallSuccess ? "SUCCESS" : "FAILED"));
  log.info("  Elapsed:  " + elapsed + "s");
  log.info("");
  log.info("  Generated: " + v(s.generatedFiles) + "  Reused: " + v(s.plannedReuse) + "  Skipped: " + v(s.skipped));
  log.info("  Validation: " + v(s.passedValidation) + " passed");
  log.info("  Graph: " + v(s.graphNodes) + " nodes, " + v(s.graphEdges) + " edges");
  log.info("  Schema: " + v(s.schemaManifests) + "  Registry: " + v(s.registryInserted) + " added");
  log.info("  Build: " + (overallSuccess ? "PASS" : "FAIL"));
  log.info("");
  log.info("  Checkpoint: " + filepath);
  log.info(divider);
  log.info("  SUCCESS");
  log.info(divider);

  log.info("Checkpoint Report Complete — written to " + filename);

  return {
    success: true,
    stats: { reportGenerated: 1 },
    outputs: { report, reportPath: filepath },
  };
}

export default run;
