import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

const REGISTRY_PATH = resolve(process.cwd(), "src", "registry.json");

// Route path to Astro file path mapping
const ROUTE_TO_PATH = {
  "/knowledge/materials/": "src/pages/knowledge/materials/index.astro",
  "/knowledge/processes/": "src/pages/knowledge/processes/index.astro",
  "/knowledge/applications/": "src/pages/knowledge/applications.astro",
  "/knowledge/cases/": "src/pages/knowledge/cases.astro",
  "/knowledge/evidence/": "src/pages/knowledge/evidence.astro",
  "/knowledge/standards/": "src/pages/knowledge/standards/",
  "/knowledge/surface-finishes/": "src/pages/knowledge/surface-finishes/",
  "/knowledge/equipment/": "src/pages/knowledge/equipment/",
  "/knowledge/industries/": "src/pages/knowledge/industries/",
  "/compare/": "src/pages/compare.astro",
  "/guides/": "src/pages/guides.astro",
  "/faq/": "src/pages/faq.astro",
};

function routeToPath(route, collection) {
  // Check exact match first
  if (ROUTE_TO_PATH[route]) return ROUTE_TO_PATH[route];

  // Detail pages use [slug].astro
  const detailPath = "src/pages/knowledge/" + collection + "/[slug].astro";
  return detailPath;
}

function collectionToName(collection) {
  const names = {
    materials: "Materials Detail",
    processes: "Processes Detail",
    equipment: "Equipment Detail",
    surfaceFinishes: "Surface Finishes Detail",
    industries: "Industries Detail",
    applications: "Applications Detail",
    standards: "Standards Detail",
    evidence: "Evidence Detail",
    comparisons: "Comparison Detail",
    cases: "Case Detail",
    guides: "Guide Detail",
    procurement: "Procurement Detail",
    faqs: "FAQ Detail",
  };
  return names[collection] || collection.charAt(0).toUpperCase() + collection.slice(1) + " Detail";
}

function normalizeRoute(route) {
  let r = route;
  if (!r.startsWith("/")) r = "/" + r;
  if (!r.endsWith("/")) r = r + "/";
  return r;
}

export function loadExistingRegistry() {
  try {
    if (!existsSync(REGISTRY_PATH)) return { pages: [], raw: "{}" };
    const raw = readFileSync(REGISTRY_PATH, "utf8");
    const data = JSON.parse(raw);
    return { pages: data.pages || [], raw, data };
  } catch (err) {
    return { error: "Failed to read registry.json: " + err.message };
  }
}

export function mergeRegistry(existingPages, newEntries) {
  const errors = [];
  const routeMap = new Map();
  const stats = { inserted: 0, updated: 0, unchanged: 0, skipped: 0, errors: 0 };

  // Build index of existing entries by path AND by name
  for (const entry of existingPages) {
    if (!entry.path) { errors.push("Existing entry missing path"); stats.errors++; continue; }
    const key = entry.path;
    if (routeMap.has(key)) { errors.push("Duplicate path in existing: " + key); stats.errors++; continue; }
    routeMap.set(key, { ...entry });
  }

  // Merge new entries
  for (const entry of newEntries) {
    if (!entry.title) { errors.push("Entry missing title"); stats.errors++; continue; }
    if (!entry.collection) { errors.push("Entry missing collection"); stats.errors++; continue; }

    const route = normalizeRoute(entry.route);
    const astroPath = routeToPath(route, entry.collection);

    const newEntry = {
      name: entry.title,
      path: astroPath,
      locales: ["en"],
    };

    if (routeMap.has(astroPath)) {
      const existing = routeMap.get(astroPath);
      if (existing.name === newEntry.name && existing.path === newEntry.path) {
        stats.unchanged++;
      } else {
        routeMap.set(astroPath, newEntry);
        stats.updated++;
      }
    } else {
      routeMap.set(astroPath, newEntry);
      stats.inserted++;
    }
  }

  // Build final list with stable ordering
  const allEntries = [...routeMap.values()];

  function pathOrder(p) {
    if (p.includes("index.astro") || p === "src/pages/index.astro") return 0;
    if (p.includes("/about")) return 1;
    if (p.includes("/contact")) return 2;
    if (p.includes("/pricing")) return 3;
    if (p.includes("/privacy")) return 4;
    if (p.includes("/terms")) return 5;
    if (p.includes("/knowledge/")) return 10;
    if (p.includes("/services/")) return 20;
    if (p.includes("/blog/")) return 30;
    if (p.includes("/compare/")) return 35;
    if (p.includes("/guides/")) return 36;
    if (p.includes("/faq/")) return 37;
    if (p.includes("/rfq/")) return 40;
    return 50;
  }

  allEntries.sort((a, b) => {
    const oa = pathOrder(a.path);
    const ob = pathOrder(b.path);
    if (oa !== ob) return oa - ob;
    return a.path.localeCompare(b.path);
  });

  return { entries: allEntries, stats, errors };
}

export function persistRegistry(allEntries) {
  try {
    const raw = readFileSync(REGISTRY_PATH, "utf8");
    const data = JSON.parse(raw);
    data.pages = allEntries;

    // Atomic write: temp file → rename
    const tmpPath = REGISTRY_PATH + ".tmp";
    writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf8");

    // Read back to verify
    const verify = JSON.parse(readFileSync(tmpPath, "utf8"));
    if (!verify.pages || verify.pages.length !== allEntries.length) {
      return { success: false, error: "Verification failed after write" };
    }

    // Replace original
    writeFileSync(REGISTRY_PATH, JSON.stringify(data, null, 2), "utf8");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed to write registry.json: " + err.message };
  }
}

export function hasChanges(entries, stats) {
  return stats.inserted > 0 || stats.updated > 0;
}
