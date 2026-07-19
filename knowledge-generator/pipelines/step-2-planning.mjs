const COMPARE = { materials: {}, processes: {}, surfaceFinishes: {} };
const GTYPE = { materials:"material-selection", processes:"machining", equipment:"machining", standards:"procurement", applications:"industry" };

function cmpTargets(et, slug, def) {
  if (!COMPARE[et]) return [];
  if (def.comparisons && Array.isArray(def.comparisons)) return def.comparisons;
  if (et==="materials" && slug.includes("grade-5")) return ["grade-23","inconel-718"];
  if (et==="materials" && slug.includes("grade-2")) return ["grade-5"];
  return [];
}

function evItems(et, slug, def) {
  if (et!=="materials") return [];
  if (def.evidence && Array.isArray(def.evidence)) return def.evidence;
  return [{s:slug+"-milling-parameters",r:"Machining data"},{s:slug+"-properties",r:"Spec data"}];
}

export async function run(ctx) {
  ctx.logger.info("Planning Started");
  const m = ctx.manifest;
  if (!m||!m.entity) return { success:false, error:"No manifest from Step 1" };

  const { entity, existingFiles, gaps } = m;
  const slug = entity.slug, et = entity.entityType, def = entity.definition||{};
  const existing = new Set(existingFiles.map(f=>f.slug));
  const gen = [], reuse = [];

  if (entity.entityExists) { reuse.push({ collection:et, slug, reason:"Core exists" }); }
  else { gen.push({ collection:et, slug, priority:1, reason:"Core required" }); }

  if (gaps.some(g=>g.collection==="evidence")) {
    for (const ev of evItems(et, slug, def)) {
      const es = ev.s||ev;
      if (existing.has(es)) { reuse.push({ collection:"evidence", slug:es, reason:"Exists" }); }
      else { gen.push({ collection:"evidence", slug:es, priority:2, reason:ev.r||"Data required" }); }
    }
  }

  if (gaps.some(g=>g.collection==="comparisons")) {
    for (const t of cmpTargets(et, slug, def)) {
      const cs = slug+"-vs-"+t;
      if (existing.has(cs)) { reuse.push({ collection:"comparisons", slug:cs, reason:"Exists" }); }
      else { gen.push({ collection:"comparisons", slug:cs, priority:3, reason:"Compare "+slug+" vs "+t }); }
    }
  }

  if (gaps.some(g=>g.collection==="faqs")) {
    const fs = slug+"-faq";
    if (existing.has(fs)) { reuse.push({ collection:"faqs", slug:fs, reason:"Exists" }); }
    else { gen.push({ collection:"faqs", slug:fs, priority:4, reason:"FAQ for "+slug }); }
  }

  if (gaps.some(g=>g.collection==="guides")) {
    const gt = def.guideType||GTYPE[et];
    if (gt) {
      const gs = slug+"-guide";
      if (existing.has(gs)) { reuse.push({ collection:"guides", slug:gs, reason:"Exists" }); }
      else { gen.push({ collection:"guides", slug:gs, priority:5, reason:gt+" guide" }); }
    }
  }

  gen.sort((a,b)=>a.priority-b.priority||a.collection.localeCompare(b.collection)||a.slug.localeCompare(b.slug));

  const seen = new Set(), errors = [];
  for (const f of gen) {
    if (!f.priority||f.priority<1||f.priority>5) errors.push(f.slug+": invalid priority");
    if (!f.reason) errors.push(f.slug+": reason required");
    const k = f.collection+"/"+f.slug;
    if (seen.has(k)) errors.push(f.slug+": duplicate");
    seen.add(k);
  }
  if (errors.length>0) { errors.forEach(e=>ctx.logger.warn("  "+e)); return { success:false, error:"Validation: "+errors.join("; ") }; }

  const rel = {};
  for (const f of ["processes","standards","industries","equipment","finishes","materials"]) {
    const v = def.knownRelations ? def.knownRelations[f] : def[f];
    if (Array.isArray(v)&&v.length>0) rel[f] = [...v];
  }

  const plan = { entity:{ slug, entityType:et, entityExists:entity.entityExists }, filesToGenerate:gen, existingFiles:reuse, relationships:rel, stats:{ toGenerate:gen.length, toReuse:reuse.length } };
  ctx.plan = plan;
  ctx.stats.plannedGenerate = gen.length;
  ctx.stats.plannedReuse = reuse.length;

  ctx.logger.info("  Core: "+(entity.entityExists?"exists":"missing"));
  ctx.logger.info("  Evidence: "+(gen.filter(f=>f.collection==="evidence").length||"exists"));
  ctx.logger.info("  Comparison: "+(gen.filter(f=>f.collection==="comparisons").length||"exists"));
  ctx.logger.info("  FAQ: "+(gen.filter(f=>f.collection==="faqs").length?"missing":"exists"));
  ctx.logger.info("  Guide: "+(gen.filter(f=>f.collection==="guides").length?"+":"skipped"));
  ctx.logger.info("Planning Complete \u2014 Generate: "+gen.length+"  Reuse: "+reuse.length);

  return { success:true, stats:{ plannedGenerate:gen.length, plannedReuse:reuse.length }, outputs:{ plan } };
}

export default run;
