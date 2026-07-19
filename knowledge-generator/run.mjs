#!/usr/bin/env node

import { readdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { pathToFileURL } from "url";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOMAINS_DIR = resolve(__dirname, "domains");
const DOMAIN_EXT = ".mjs";
const isDev = process.env.NODE_ENV === "development";

function parseArgs(raw) {
  const args = raw.slice(2);
  const config = { domain: null, dryRun: false, verify: false, list: false, skipBuild: false };
  for (const arg of args) {
    if (arg === "--list") { config.list = true; continue; }
    if (arg === "--dry-run") { config.dryRun = true; continue; }
    if (arg === "--verify") { config.verify = true; continue; }
    if (arg === "--skip-build") { config.skipBuild = true; continue; }
    if (arg.startsWith("--domain=")) { config.domain = arg.split("=")[1]; continue; }
  }
  return config;
}

function listAvailableDomains() {
  if (!existsSync(DOMAINS_DIR)) return [];
  return readdirSync(DOMAINS_DIR)
    .filter((f) => f.endsWith(DOMAIN_EXT))
    .map((f) => f.replace(DOMAIN_EXT, ""));
}

async function loadDomain(name) {
  const filePath = resolve(DOMAINS_DIR, `${name}${DOMAIN_EXT}`);
  if (!existsSync(filePath)) return null;
  const mod = await import(pathToFileURL(filePath).href);
  return mod.default || mod;
}

async function loadAllDomains() {
  const names = listAvailableDomains();
  const loaded = [];
  for (const name of names) {
    const mod = await loadDomain(name);
    loaded.push({ name, definition: mod });
  }
  return loaded;
}

function createContext(config, domains) {
  return {
    startTime: Date.now(),
    config,
    domains,
    stats: { generated: 0, skipped: 0, failed: 0, validated: 0, links: 0, errors: [] },
    logger: {
      info: (msg) => console.log(`[info] ${msg}`),
      warn: (msg) => console.log(`[warn] ${msg}`),
      error: (msg) => console.error(`[error] ${msg}`),
    },
    outputPaths: {
      domains: DOMAINS_DIR,
      root: resolve(__dirname, ".."),
      content: resolve(__dirname, "..", "src", "content"),
    },
  };
}

const DIVIDER = "\n" + "═".repeat(47) + "\n";

function printSummary(ctx) {
  const elapsed = ((Date.now() - ctx.startTime) / 1000).toFixed(1);
  const errCount = Array.isArray(ctx.stats.errors) ? ctx.stats.errors.length : 0;
  const result = errCount === 0 ? "PASS" : "FAIL";
  const out = [];
  out.push(DIVIDER);
  out.push("  Knowledge Generator");
  out.push(DIVIDER);
  out.push(`  Domain:     ${ctx.config.domain || "all"}`);
  out.push(`  Generated:  ${ctx.stats.generated}`);
  out.push(`  Skipped:    ${ctx.stats.skipped}`);
  out.push(`  Validated:  ${ctx.stats.validated}`);
  out.push(`  Elapsed:    ${elapsed}s`);
  out.push(`  Result:     ${result}`);
  out.push(DIVIDER);
  console.log(out.join("\n"));
}

async function runPipeline(ctx) {
  let orch;
  try {
    const orchPath = resolve(__dirname, "pipelines", "orchestrate.mjs");
    orch = await import(pathToFileURL(orchPath).href);
  } catch {
    ctx.logger.warn("Orchestrator not yet implemented");
    return;
  }
  const fn = orch.run || orch.default;
  if (typeof fn === "function") {
    await fn(ctx);
  } else {
    ctx.logger.warn("Orchestrator has no run() export");
  }
}

async function main() {
  const config = parseArgs(process.argv);

  if (config.list) {
    const available = listAvailableDomains();
    if (available.length === 0) {
      console.log("No domain files found.");
      return;
    }
    console.log("\nAvailable domains:");
    for (const name of available) console.log(`  • ${name}`);
    console.log();
    return;
  }

  if (!config.domain) {
    console.error("[error] --domain=<name> or --list required");
    process.exit(2);
  }

  let domains;
  if (config.domain === "all") {
    domains = await loadAllDomains();
    if (domains.length === 0) {
      console.error("[error] No domain files found");
      process.exit(1);
    }
  } else {
    const def = await loadDomain(config.domain);
    if (def === null) {
      console.error(`[error] Domain "${config.domain}" not found`);
      console.error("       Use --list to see available domains");
      process.exit(3);
    }
    domains = [{ name: config.domain, definition: def }];
  }

  const ctx = createContext(config, domains);

  if (config.dryRun) {
    ctx.logger.info("Dry-run mode");
    ctx.logger.info(`Domain: ${config.domain}`);
    ctx.logger.info(`Files to process: ${domains.length} domain(s)`);
  }

  try {
    await runPipeline(ctx);
  } catch (err) {
    ctx.stats.errors.push(err.message || String(err));
    ctx.logger.error(`Pipeline: ${err.message || err}`);
    if (isDev) console.error(err);
  }

  printSummary(ctx);
  const ec = Array.isArray(ctx.stats.errors) ? ctx.stats.errors.length : 0;
  if (ec > 0) process.exit(1);
}

main().catch((err) => {
  console.error(`[fatal] ${err.message || err}`);
  if (isDev) console.error(err);
  process.exit(1);
});
