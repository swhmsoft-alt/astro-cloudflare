const ALLOWED = new Set(["material","process","standard","equipment","industry","finish","application","evidence","comparison","faq","guide"]);

const FIELD_MAP = [
  { f:"processes", r:"process" }, { f:"standards", r:"standard" }, { f:"industries", r:"industry" },
  { f:"equipment", r:"equipment" }, { f:"finishes", r:"finish" }, { f:"materials", r:"material" },
  { f:"applications", r:"application" }, { f:"surfaceFinish", r:"finish" }, { f:"material", r:"material" },
  { f:"relatedMaterials", r:"material" }, { f:"relatedProcesses", r:"process" },
  { f:"relatedStandards", r:"standard" }, { f:"relatedEvidence", r:"evidence" },
  { f:"relatedComparisons", r:"comparison" },
];

function gCol(slug) {
  if (slug.startsWith("grade-")||slug.startsWith("ti-")||slug.startsWith("cp-")) return "materials";
  if (slug.endsWith("-machining")||slug.endsWith("-edm")||slug.includes("-milling")||slug.includes("-turning")) return "processes";
  if (slug.startsWith("astm-")||slug.startsWith("iso-")||slug.startsWith("as91")||slug.startsWith("nadcap")) return "standards";
  if (slug.includes("-finish")||slug.includes("-blasting")||slug.includes("-anodizing")||slug.includes("-polishing")) return "surfaceFinishes";
  if (slug.includes("-properties")||slug.includes("-parameters")||slug.includes("-roughness")||slug.includes("-data")) return "evidence";
  if (slug.includes("-vs-")) return "comparisons";
  if (slug.endsWith("-faq")) return "faqs";
  if (slug.endsWith("-guide")) return "guides";
  return "unknown";
}

function gRel(slug) {
  if (slug.includes("-vs-")) return "comparison";
  if (slug.endsWith("-faq")) return "faq";
  if (slug.endsWith("-guide")) return "guide";
  if (slug.includes("-properties")||slug.includes("-parameters")||slug.includes("-roughness")||slug.includes("-data")) return "evidence";
  const c = gCol(slug); if (c!=="unknown") return c;
  return null;
}


export async function run(ctx) {
  ctx.logger.info("Knowledge Graph Started");

  const content = ctx.validatedContent || ctx.linkedContent || [];
  if (content.length === 0) {
    return { success:true, stats:{graphNodes:0,graphEdges:0,graphLinked:0,graphOrphans:0}, outputs:{linkedContent:[], graph:{nodes:[],edges:[]}, report:{nodes:0,edges:0,linked:0,unresolved:0} } };
  }

  const nodeMap = new Map();
  for (const item of content) {
    const nid = item.collection+"/"+item.slug;
    if (nodeMap.has(nid)) return { success:false, error:"Duplicate node: "+nid };
    nodeMap.set(nid, { id:nid, collection:item.collection, slug:item.slug, title:item.frontmatter?.title||item.slug });
  }

  const edgeSet = new Set();
  const edges = [];

  for (const item of content) {
    const fromId = item.collection+"/"+item.slug;
    const fm = item.frontmatter||{};

    for (const {f:field, r:relation} of FIELD_MAP) {
      const val = fm[field];
      if (!val) continue;
      const targets = Array.isArray(val) ? val : [val];
      for (const t of targets) {
        if (!t||typeof t!=="string") continue;
        const ts = t.trim();
        if (!ts) continue;
        const toId = resolveId(ts);
        if (fromId===toId) return { success:false, error:"Self-reference: "+fromId };
        const rel = relation||gRel(ts);
        if (!rel||!ALLOWED.has(rel)) return { success:false, error:"Unknown relation '"+rel+"' between "+fromId+" and "+toId };
        const ek = fromId+"->"+toId+":"+rel;
        if (edgeSet.has(ek)) continue;
        edgeSet.add(ek);
        edges.push({ from:fromId, to:toId, relation:rel });
        if (!nodeMap.has(toId)) nodeMap.set(toId, { id:toId, collection:gCol(ts), slug:ts, title:ts, placeholder:true });
      }
    }
  }

  const nodes = [...nodeMap.values()];
  const reverseEdges = [];
  for (const e of edges) {
    const rk = e.to+"->"+e.from+":"+e.relation;
    if (!edgeSet.has(rk)) reverseEdges.push({ from:e.to, to:e.from, relation:e.relation });
  }

  const linkedContent = content.map((item) => {
    const nid = item.collection+"/"+item.slug;
    const outgoing = edges.filter((e)=>e.from===nid).map((e)=>({target:e.to, relation:e.relation}));
    const incoming = [...edges,...reverseEdges].filter((e)=>e.to===nid).map((e)=>({source:e.from, relation:e.relation}));
    return { ...item, graph:{outgoing,incoming} };
  });

  const orphans = nodes.filter((n)=>{
    const hasOut = edges.some((e)=>e.from===n.id);
    const hasIn = [...edges,...reverseEdges].some((e)=>e.to===n.id);
    return !hasOut&&!hasIn;
  });

  for (const o of orphans) ctx.logger.warn("Orphan: "+o.id);

  const totalEdges = edges.length+reverseEdges.length;
  ctx.linkedContent = linkedContent;
  ctx.stats.graphNodes = nodes.length;
  ctx.stats.graphEdges = totalEdges;
  ctx.stats.graphLinked = content.length;
  ctx.stats.graphOrphans = orphans.length;

  ctx.logger.info("  Nodes: "+nodes.length);
  ctx.logger.info("  Edges: "+edges.length);
  ctx.logger.info("  Reverse: "+reverseEdges.length);
  ctx.logger.info("  Orphans: "+orphans.length);
  ctx.logger.info("Knowledge Graph Complete");

  return { success:true, stats:{graphNodes:nodes.length, graphEdges:totalEdges, graphLinked:content.length, graphOrphans:orphans.length}, outputs:{ linkedContent, graph:{nodes, edges:[...edges,...reverseEdges]}, report:{nodes:nodes.length, edges:totalEdges, linked:content.length, unresolved:orphans.length} } };
}

export default run;

function resolveId(slug) { if (slug.includes("/")) return slug; return gCol(slug)+"/"+slug; }
