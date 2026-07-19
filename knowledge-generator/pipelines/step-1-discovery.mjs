import { readdirSync, readFileSync, existsSync } from "fs";
import { resolve } from "path";

const BASE = resolve(process.cwd(), "src", "content");
const PATHS = [
  ["materials","core/materials"],["processes","core/processes"],["equipment","core/equipment"],
  ["surfaceFinishes","core/surface-finishes"],["industries","core/industries"],
  ["applications","core/applications"],["standards","core/standards"],
  ["evidence","derived/evidence"],["comparisons","derived/comparisons"],
  ["cases","derived/cases"],["guides","derived/guides"],
  ["procurement","derived/procurement"],["faqs","site/faqs"],
];
const DERIVED = new Set(["evidence","comparisons","guides","procurement","cases","faqs"]);
const RELF = ["standards","industries","processes","materials","equipment","finishes","surfaceFinish","material","relatedMaterials","relatedProcesses","relatedStandards","relatedEntities","relatedEvidence","relatedComparisons","relatedServices"];

function isPlaceholder(m) { return !m || typeof m !== "object" || Object.keys(m).length === 0; }

function guessType(slug) {
  if (slug.startsWith("grade-")||slug.startsWith("ti-")||slug.startsWith("cp-")) return "materials";
  if (slug.endsWith("-machining")||slug.endsWith("-edm")||slug.includes("-milling")||slug.includes("-turning")) return "processes";
  if (slug.startsWith("astm-")||slug.startsWith("iso-")||slug.startsWith("as91")||slug.startsWith("nadcap")) return "standards";
  if (slug.endsWith("-finish")||slug.endsWith("-anodizing")||slug.endsWith("-blasting")||slug.endsWith("-polishing")) return "surfaceFinishes";
  return "materials";
}

function collectRefs(fm) {
  const r = [];
  for (const f of RELF) { const v = fm[f]; if (Array.isArray(v)) { for (const i of v) if (typeof i === "string") r.push(i); } else if (typeof v === "string") r.push(v); }
  return r;
}

function parseFM(raw) {
  try {
    const m = raw.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!m) return null;
    const o = {}; let k = null;
    for (const line of m[1].split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      if (t.startsWith("- ") && k) { if (!Array.isArray(o[k])) o[k] = []; o[k].push(t.slice(2).replace(/['"]/g,"").trim()); continue; }
      const ci = t.indexOf(":");
      if (ci === -1) continue;
      k = t.slice(0, ci).trim();
      let v = t.slice(ci + 1).trim().replace(/['"]/g,"");
      if (v.startsWith("[")&&v.endsWith("]")) { o[k] = v.slice(1,-1).split(",").map((s)=>s.trim().replace(/['"]/g,"")).filter(Boolean); } else { o[k] = v; }
    }
    return o;
  } catch { return null; }
}

function scan(dir) { try { if (!existsSync(dir)) return []; return readdirSync(dir).filter(f=>f.endsWith(".md")).map(f=>f.replace(/\.md$/,"")); } catch { return []; } }

export async function run(ctx) {
  ctx.logger.info("Discovery Started");
  const domains = ctx.domains || [];
  if (domains.length === 0) return { success:true, stats:{discoveredFiles:0,existingFiles:0,missingFiles:0}, outputs:{manifest:null} };

  const manifest = { entity:null, existingFiles:[], missingFiles:[], targetCollections:[], gaps:[], discoveredRelations:{} };
  let ex = 0, mi = 0;

  for (const domain of domains) {
    const slug = domain.name, def = domain.definition || {}, et = def.entityType || guessType(slug);
    if (isPlaceholder(def)) ctx.logger.info("Domain \""+slug+"\" is placeholder");

    const pair = PATHS.find(p=>p[0]===et);
    const dir = pair ? resolve(BASE, pair[1]) : resolve(BASE, et);
    const fpath = resolve(dir, slug+".md");
    const exists = existsSync(fpath);
    manifest.entity = { slug, entityType:et, entityExists:exists, aliases:def.aliases||[] };

    if (exists) { manifest.existingFiles.push({ collection:et, slug, path:fpath }); ex++; }
    else { manifest.missingFiles.push({ collection:et, slug, reason:"Core file not found" }); manifest.gaps.push({ collection:et, slug, type:"core_entity" }); mi++; }

    const aliases = [slug, ...(def.aliases||[])].map(a=>a.toLowerCase());
    const discovered = {};

    for (const [cname, cdir] of PATHS) {
      for (const fs of scan(resolve(BASE, cdir))) {
        try {
          const raw = readFileSync(resolve(BASE, cdir, fs+".md"), "utf8");
          const fm = parseFM(raw);
          if (!fm) continue;
          if (collectRefs(fm).some(r=>aliases.includes(r.toLowerCase())||r.toLowerCase()===slug)) {
            if (!discovered[cname]) discovered[cname] = [];
            discovered[cname].push(fs);
            if (!manifest.existingFiles.find(f=>f.collection===cname&&f.slug===fs)) {
              manifest.existingFiles.push({ collection:cname, slug:fs, path:resolve(BASE, cdir) });
              ex++;
            }
          }
        } catch {}
      }
    }

    manifest.discoveredRelations = discovered;
    manifest.targetCollections = [...new Set([et, ...DERIVED])];

    for (const tc of manifest.targetCollections) {
      if (tc===et) continue;
      if (!discovered[tc]||discovered[tc].length===0) { manifest.gaps.push({ collection:tc, slug:null, type:"missing_derived" }); manifest.missingFiles.push({ collection:tc, slug:null, reason:"No related "+tc+" files" }); mi++; }
    }

    ctx.logger.info("  Entity: "+slug+"  Exists: "+exists+"  Gaps: "+manifest.gaps.length);
  }

  ctx.manifest = manifest;
  ctx.stats.discoveredFiles = ex+mi;
  ctx.stats.existingFiles = ex;
  ctx.stats.missingFiles = mi;
  ctx.logger.info("Discovery Complete \u2014 "+ex+" existing, "+mi+" missing");
  return { success:true, stats:{ discoveredFiles:ex+mi, existingFiles:ex, missingFiles:mi }, outputs:{ manifest } };
}

export default run;
