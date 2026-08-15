#!/usr/bin/env node
/**
 * translate.mjs --- Batch translation pipeline for Astro content collections.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

import { translate as apiTranslate } from "./lib/translator.mjs";
import { scan, listCollections } from "./lib/scanner.mjs";
import * as cache from "./lib/cache.mjs";
import { load as loadGlossary, buildPromptFragment } from "./lib/glossary.mjs";
import { splitFrontmatter, parseFrontmatter, serializeFrontmatter, collectStrings } from "./lib/markdown.mjs";
import * as reporter from "./lib/reporter.mjs";
import { runAllChecks } from "./lib/qa-gate.mjs";
import { generateReport } from "./lib/qa-report.mjs";

function parseArgs(raw) {
  const args = raw.slice(2);
  const cfg = { locale: null, from: "en", collection: null, dir: null, limit: Infinity,
    force: false, dryRun: false, qaOnly: false, batch: "batch-1",
    noQa: false, noCache: false, noReport: false, listCollections: false };
  for (const arg of args) {
    if (arg === "--list-collections") cfg.listCollections = true;
    else if (arg.startsWith("--locale=")) cfg.locale = arg.split("=")[1];
    else if (arg.startsWith("--from=")) cfg.from = arg.split("=")[1];
    else if (arg.startsWith("--collection=")) cfg.collection = arg.split("=")[1];
    else if (arg.startsWith("--dir=")) cfg.dir = arg.split("=")[1];
    else if (arg.startsWith("--limit=")) cfg.limit = parseInt(arg.split("=")[1], 10);
    else if (arg === "--force") cfg.force = true;
    else if (arg === "--dry-run") cfg.dryRun = true;
    else if (arg === "--qa-only") cfg.qaOnly = true;
    else if (arg.startsWith("--batch=")) cfg.batch = arg.split("=")[1];
    else if (arg === "--no-qa") cfg.noQa = true;
    else if (arg === "--no-cache") cfg.noCache = true;
    else if (arg === "--no-report") cfg.noReport = true;
  }
  return cfg;
}

function loadSystemPrompt(locale) {
  const promptPath = resolve(__dirname, "prompts", "system.md");
  let prompt = readFileSync(promptPath, "utf8");
  const glossary = loadGlossary(locale);
  if (glossary) {
    const fragment = buildPromptFragment(locale, glossary);
    if (fragment) prompt += "\n\n" + fragment;
  }
  return prompt;
}

async function translateFile(filePath, cfg) {
  const raw = readFileSync(filePath, "utf8");
  const { frontmatterRaw, body } = splitFrontmatter(raw);
  const isJson = !frontmatterRaw && filePath.endsWith(".json");
  let parsed; let strings = [];
  if (isJson) {
    parsed = JSON.parse(raw);
    if (parsed.locale !== cfg.from) return null;
    strings = collectStrings(parsed);
  } else {
    if (!frontmatterRaw) { console.warn("  [warn] No frontmatter: " + basename(filePath)); return null; }
    parsed = parseFrontmatter(frontmatterRaw);
    if (parsed.locale !== cfg.from) return null;
    strings = collectStrings(parsed);
  }
  if (!cfg.noCache) { const cached = cache.get(filePath, cfg.locale); if (cached) return cached; }
  const systemPrompt = loadSystemPrompt(cfg.locale);
  const stringList = strings.map(function(s, i) {
    return "[" + i + "] path=" + JSON.stringify(s.path.join(".")) + " value=" + JSON.stringify(s.value);
  }).join("\n");
  const userMessage = "Translate from " + cfg.from.toUpperCase() + " to " + cfg.locale.toUpperCase() + ".\n\n"
    + "## Frontmatter strings:\n" + (stringList || "(none)")
    + "\n\n## Body text:\n" + (body || "(none)")
    + "\n\nReturn the complete translated document with frontmatter (---...---) and body.";
  const result = await apiTranslate({ system: systemPrompt, messages: [{ role: "user", content: userMessage }], locale: cfg.locale });
  if (!result) return null;
  if (!cfg.noCache) cache.set(filePath, cfg.locale, result);
  return result;
}
function writeTranslatedFile(sourceFile, targetFile, translatedContent, cfg) {
  const { frontmatterRaw, body } = splitFrontmatter(translatedContent);
  mkdirSync(dirname(targetFile), { recursive: true });
  if (sourceFile.endsWith(".json") && !frontmatterRaw) {
    let parsed;
    try { parsed = JSON.parse(translatedContent); } catch {
      const original = JSON.parse(readFileSync(sourceFile, "utf8"));
      original.locale = cfg.locale;
      writeFileSync(targetFile, JSON.stringify(original, null, 2) + "\n", "utf8"); return;
    }
    parsed.locale = cfg.locale;
    writeFileSync(targetFile, JSON.stringify(parsed, null, 2) + "\n", "utf8");
  } else {
    let outBody;
    if (frontmatterRaw) {
      const parsed = parseFrontmatter(frontmatterRaw);
      parsed.locale = cfg.locale;
      outBody = "---\n" + serializeFrontmatter(parsed) + "---\n\n" + (body || "");
    } else {
      const original = readFileSync(sourceFile, "utf8");
      const { frontmatterRaw: origFm } = splitFrontmatter(original);
      const parsed = parseFrontmatter(origFm);
      parsed.locale = cfg.locale;
      outBody = "---\n" + serializeFrontmatter(parsed) + "---\n\n" + translatedContent;
    }
    writeFileSync(targetFile, outBody, "utf8");
  }
}

function runQa(sourceFile, translatedContent, locale) {
  const sourceRaw = readFileSync(sourceFile, "utf8");
  const { body: sourceBody } = splitFrontmatter(sourceRaw);
  const { body: translatedBody } = splitFrontmatter(translatedContent);
  const glossary = loadGlossary(locale);
  return runAllChecks({ source: sourceBody, translated: translatedBody || translatedContent, locale, glossary, sourceRaw, translatedRaw: translatedContent });
}

async function run() {
  const cfg = parseArgs(process.argv);
  if (cfg.listCollections) {
    console.log("Available collections:");
    for (const c of listCollections()) {
      console.log("  " + c.name.padEnd(20) + " " + c.dir.padEnd(30) + " " + c.fileCount + " files" + (c.isStarlight ? " (starlight)" : ""));
    }
    return;
  }
  if (!cfg.locale) { console.error("Missing --locale=<code>"); process.exit(2); }
  console.log("[translate] " + cfg.from + " -> " + cfg.locale + (cfg.collection ? " (" + cfg.collection + ")" : " (all)") + (cfg.dryRun ? " DRY" : ""));
  let files = [];
  try { files = scan({ locale: cfg.locale, from: cfg.from, collection: cfg.collection, dir: cfg.dir, force: cfg.force }); }
  catch (err) { console.error("[translate] " + err.message); process.exit(2); }
  if (files.length === 0) { console.log("[translate] Nothing to do."); return; }
  if (files.length > cfg.limit) files = files.slice(0, cfg.limit);
  console.log("[translate] " + files.length + " file(s)");
  reporter.init({ locale: cfg.locale, total: files.length });
  if (cfg.qaOnly) {
    const qaResults = [];
    for (const f of files) {
      if (!f.targetFile) continue;
      try {
        const tc = readFileSync(f.targetFile, "utf8");
        const qr = runQa(f.file, tc, cfg.locale);
        qaResults.push({ file: f.relativePath, qaResult: qr, passed: qr.pass });
        console.log("  [qa] " + f.relativePath + ": " + (qr.pass ? "PASS" : "FAIL"));
      } catch (err) { qaResults.push({ file: f.relativePath, qaResult: null, passed: false }); }
    }
    if (!cfg.noReport) generateReport({ locale: cfg.locale, batch: cfg.batch, results: qaResults, stats: reporter.getState() });
    console.log("\n[qa] " + qaResults.filter(function(r) { return r.passed; }).length + "/" + qaResults.length + " passed");
    return;
  }
  const qaResults = [];
  for (const f of files) {
    const t0 = Date.now();
    try {
      if (!cfg.force && f.targetFile) {
        try { readFileSync(f.targetFile, "utf8"); reporter.recordSkip(f.relativePath); console.log("  [skip] " + f.relativePath); continue; } catch {}
      }
      if (cfg.dryRun) { console.log("  [plan] " + f.relativePath); reporter.recordSkip(f.relativePath, "dry-run"); continue; }
      console.log("  [t] " + f.relativePath + "...");
      const tc = await translateFile(f.file, cfg);
      if (!tc) { console.warn("  [skip] " + f.relativePath + " (not source)"); reporter.recordSkip(f.relativePath, "not source"); continue; }
      if (f.targetFile) writeTranslatedFile(f.file, f.targetFile, tc, cfg);
      const dt = Date.now() - t0;
      reporter.recordSuccess({ file: f.relativePath, targetFile: f.targetFile, tokens: Math.ceil(tc.length / 3), duration: dt });
      console.log("  [ok] " + f.relativePath + " (" + dt + "ms)");
      if (!cfg.noQa) {
        const qr = runQa(f.file, tc, cfg.locale);
        qaResults.push({ file: f.relativePath, qaResult: qr, passed: qr.pass });
        if (!qr.pass) console.warn("  [qa] " + f.relativePath + ": " + qr.summary);
      }
    } catch (err) { console.error("  [err] " + f.relativePath + ": " + err.message); reporter.recordFail(f.relativePath, err.message); }
  }
  console.log("\n" + reporter.summary());
  if (!cfg.noQa && !cfg.noReport && qaResults.length > 0) {
    generateReport({ locale: cfg.locale, batch: cfg.batch, results: qaResults, stats: reporter.getState() });
    const failed = qaResults.filter(function(r) { return !r.passed; }).length;
    if (failed > 0) console.warn("\n[qa] " + failed + " failed. See reports/qa-" + cfg.locale + "-" + cfg.batch + ".md");
  }
  if (reporter.getState().failed > 0) process.exitCode = 1;
}

run().catch(function(err) { console.error("[translate] Fatal:", err.message); process.exit(1); });
