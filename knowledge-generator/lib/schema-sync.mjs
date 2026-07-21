const SCHEMA_MAP = {
  materials: ["Product", "DefinedTerm"],
  equipment: ["Product"],
  processes: ["TechArticle"],
  industries: ["TechArticle"],
  applications: ["TechArticle"],
  evidence: ["TechArticle"],
  comparisons: ["TechArticle"],
  standards: ["DefinedTerm"],
  guides: ["HowTo"],
  "failure-analysis": ["TechArticle"],
};

const SITE_URL = "https://titanium.blog";

function buildCanonical(collection, slug) {
  const path = resolvePath(collection, slug);
  return SITE_URL + path;
}

function resolvePath(collection, slug) {
  const map = {
    materials: "/knowledge/materials/", processes: "/knowledge/processes/",
    equipment: "/knowledge/equipment/", surfaceFinishes: "/knowledge/surface-finishes/",
    industries: "/knowledge/industries/", applications: "/knowledge/applications/",
    standards: "/knowledge/standards/", evidence: "/knowledge/evidence/",
    comparisons: "/compare/", cases: "/knowledge/cases/",
    guides: "/guides/", procurement: "/knowledge/procurement/",
    faqs: "/faq/",
  };
  const base = map[collection];
  if (!base) return "/knowledge/" + collection + "/" + slug + "/";
  return base + slug + "/";
}

function buildBreadcrumbs(collection, slug, title) {
  const crumbs = [{ label: "Home", path: SITE_URL + "/" }];

  const segMap = {
    materials: "Materials", processes: "Processes", equipment: "Equipment",
    surfaceFinishes: "Surface Finishes", industries: "Industries",
    applications: "Applications", standards: "Standards",
    evidence: "Evidence", comparisons: "Comparisons", cases: "Cases",
    guides: "Guides", procurement: "Procurement", faqs: "FAQ",
  };

  const label = segMap[collection] || collection;
  const path = resolvePath(collection, slug);

  crumbs.push({ label: "Knowledge", path: SITE_URL + "/knowledge/" });
  if (label !== "Knowledge") crumbs.push({ label, path: SITE_URL + "/knowledge/" + collection + "/" });
  crumbs.push({ label: title, path: SITE_URL + path });

  return crumbs;
}

export function buildSchemaManifest(content, graph) {
  const errors = [];
  const entries = [];
  const seenCanonicals = new Set();
  const seenSlugs = new Set();

  for (const item of content) {
    const { collection, slug, frontmatter } = item;
    const title = frontmatter?.title || "";
    const description = frontmatter?.description || "";

    // Validation
    if (!collection) errors.push("Missing collection");
    if (!slug) errors.push("Missing slug");
    if (!title) errors.push(slug + ": missing title");

    const schemaTypes = SCHEMA_MAP[collection];
    if (!schemaTypes) errors.push(slug + ": unknown collection \"" + collection + "\"");

    const canonical = buildCanonical(collection, slug);

    if (canonical.includes("?") || canonical.includes("#")) errors.push(slug + ": canonical has query/fragment");
    if (!canonical.endsWith("/")) errors.push(slug + ": canonical must end with /");
    if (!canonical.startsWith("https://")) errors.push(slug + ": canonical must start with https://");
    if (seenCanonicals.has(canonical)) errors.push(slug + ": duplicate canonical " + canonical);
    seenCanonicals.add(canonical);
    if (seenSlugs.has(slug)) errors.push(slug + ": duplicate slug");
    seenSlugs.add(slug);

    // Build related entities from graph
    const nid = collection + "/" + slug;
    const node = graph?.nodes?.find((n) => n.id === nid);
    const relatedSlugs = [];
    if (node) {
      const outgoing = graph?.edges?.filter((e) => e.from === nid) || [];
      for (const e of outgoing) {
        const targetNode = graph?.nodes?.find((n) => n.id === e.to);
        if (targetNode && !targetNode.placeholder) relatedSlugs.push(e.to);
      }
    }

    const breadcrumb = buildBreadcrumbs(collection, slug, title);

    entries.push({
      schemaType: schemaTypes || ["Unknown"],
      entityType: collection,
      slug,
      canonical,
      title,
      description,
      keywords: (frontmatter?.tags || []).join(", "),
      breadcrumb,
      relatedEntities: relatedSlugs,
    });
  }

  if (errors.length > 0) return { errors };
  return { entries, statistics: { generated: entries.length, skipped: 0, duplicates: 0, errors: 0 } };
}

export function buildLmsManifest(content) {
  const entries = [];
  for (const item of content) {
    const { collection, slug, frontmatter } = item;
    const title = frontmatter?.title || slug;
    const description = frontmatter?.description || "";
    const canonical = buildCanonical(collection, slug);
    entries.push({
      title,
      description,
      url: canonical,
      entityType: collection,
      summary: description.slice(0, 200),
      keywords: frontmatter?.tags?.join(", ") || "",
    });
  }
  return { entries, count: entries.length };
}

export function buildRegistryManifest(content, plan) {
  const entries = [];
  const priorityOrder = { materials: 1, processes: 2, equipment: 3, standards: 4, evidence: 5, comparisons: 6, cases: 7, guides: 8, faqs: 9 };

  for (const item of content) {
    const { collection, slug, frontmatter } = item;
    const route = resolvePath(collection, slug);
    const priority = priorityOrder[collection] || 99;
    entries.push({
      route,
      collection,
      slug,
      title: frontmatter?.title || slug,
      priority,
    });
  }

  entries.sort((a, b) => a.priority - b.priority || a.collection.localeCompare(b.collection) || a.slug.localeCompare(b.slug));

  return { entries, count: entries.length };
}
