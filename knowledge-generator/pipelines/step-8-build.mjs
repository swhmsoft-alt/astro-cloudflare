import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(process.cwd());
const DIST = resolve(ROOT, "dist");
const REG_PATH = resolve(ROOT, "src", "registry.json");
const REQ_DIST = ["index.html", "robots.txt", "llms.txt", "llms-full.txt"];

function runCmd(cmd) {
  const start = Date.now();
  try { execSync(cmd,{cwd:ROOT,stdio:"pipe",timeout:300_000,encoding:"utf8"}); return {ok:true,t:((Date.now()-start)/1000).toFixed(1)}; }
  catch(e) { return {ok:false,t:((Date.now()-start)/1000).toFixed(1),err:(e.stderr||e.message||"").trim().split("\n").slice(0,5).join("; ")}; }
}

function checkDist(log) {
  const miss = REQ_DIST.filter(f=>!existsSync(resolve(DIST,f)));
  if (miss.length) log.warn("  Missing dist: "+miss.join(", "));
  log.info("  Dist: "+(miss.length?"ISSUES":"OK"));
  return {ok:miss.length===0,miss};
}

function checkReg(log) {
  if (!existsSync(REG_PATH)) return {ok:false,errs:["registry.json not found"]};
  try {
    const d = JSON.parse(readFileSync(REG_PATH,"utf8"));
    const ps = d.pages||[], seen=new Set(), errs=[];
    for (const p of ps) { if(!p.path) errs.push("Missing path"); if(!p.name) errs.push("Missing name"); if(seen.has(p.path)) errs.push("Duplicate: "+p.path); seen.add(p.path); }
    if (errs.length) errs.forEach(e=>log.warn("  "+e));
    log.info("  Registry: "+ps.length+" entries, "+(errs.length?"issues":"valid"));
    return {ok:errs.length===0,errs,count:ps.length};
  } catch(e) { return {ok:false,errs:[e.message]}; }
}

function checkSchema(log, items) {
  if (!items||!items.length) { log.info("  No schema data"); return {ok:true,n:0}; }
  const errs = items.filter(i=>!i.collection||!i.slug||!i.frontmatter?.title).map(i=>i.slug+": incomplete");
  if (errs.length) errs.forEach(e=>log.warn("  "+e));
  log.info("  Schemas: "+items.length+" checked, "+(errs.length?"issues":"valid"));
  return {ok:errs.length===0,n:items.length};
}

function checkGraph(log, items) {
  if (!items||!items.length) { log.info("  No graph data"); return {ok:true,iso:0}; }
  const iso = items.filter(i=>{const g=i.graph||{};return(g.outgoing||[]).length===0&&(g.incoming||[]).length===0;}).map(i=>i.collection+"/"+i.slug);
  if (iso.length) log.warn("  Isolated: "+iso.join(", "));
  log.info("  Graph: "+items.length+" nodes, "+iso.length+" isolated");
  return {ok:iso.length===0,iso};
}

export async function run(ctx) {
  const log = ctx.logger;
  log.info("Build Verification Started");

  if (ctx.config.dryRun || ctx.config.skipBuild) { log.info("  Skipping (dry-run/skipBuild)"); return {success:true,stats:{},outputs:{verification:{build:{passed:true}}}}; }

  log.info("  Running pnpm build...");
  const b = runCmd("pnpm build 2>&1");
  if (!b.ok) { log.error("BUILD FAILED ("+b.t+"s)"); return {success:false,error:"Build: "+b.err,stats:{buildTime:b.t},outputs:{}}; }
  log.info("  Build PASS ("+b.t+"s)");

  log.info("  Running check:kpis...");
  const k = runCmd("pnpm check:kpis 2>&1");
  if (!k.ok) log.warn("  KPI warnings");
  log.info("  KPIs: "+(k.ok?"PASS":"warnings")+" ("+k.t+"s)");

  const dist = checkDist(log);
  const reg = checkReg(log);
  const items = ctx.linkedContent||ctx.validatedContent||[];
  const schema = checkSchema(log, items);
  const graph = checkGraph(log, items);

  const fails = [];
  if (!dist.ok) fails.push("dist");
  if (!reg.ok) fails.push("registry");
  if (!schema.ok) fails.push("schemas");
  if (!graph.ok) fails.push("graph");

  const result = {
    success: fails.length===0,
    build: {passed:b.ok, elapsed:b.t},
    kpis: {errors:k.ok?0:1, warnings:k.ok?0:1},
    registry: {verified:reg.ok},
    schemas: {verified:schema.ok},
    graph: {verified:graph.ok},
    dist: {verified:dist.ok},
    stats: {buildTime:b.t, kpiTime:k.t, warnings:k.ok?0:1, errors:fails.length, generatedPages:items.length, registryEntries:reg.count||0, schemasVerified:schema.n||0, relationsVerified:items.length, distFilesVerified:REQ_DIST.length-(dist.miss||[]).length},
    failures: fails.length ? fails : undefined,
  };

  if (fails.length) { log.error("FAILED: "+fails.join(", ")); return {success:false,error:"Verification: "+fails.join(", "),stats:result.stats,outputs:{verification:result}}; }

  log.info("Build Verification Complete \u2014 PASS ("+b.t+"s build, "+k.t+"s kpis)");
  return {success:true,stats:result.stats,outputs:{verification:result}};
}

export default run;
