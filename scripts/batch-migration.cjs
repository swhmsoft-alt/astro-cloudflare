#!/usr/bin/env node
// Batch migration: Evidence pages → single unified @graph JSON-LD.
// Targets: schema.ts (verify), _EntityDetail.astro, SEO.astro.
const fs = require("node:fs");
const path = require("node:path");
const ROOT = path.resolve(__dirname, "..");
const R = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const W = (p, c) => fs.writeFileSync(path.join(ROOT, p), c);
const die = (msg) => { console.error("✗", msg); process.exit(1); };

// ── 1. Verify schema.ts ──
const schemaSrc = R("src/lib/schema.ts");
const sigs = [
  "export function buildEvidenceGraph(",
  "export function buildDefinedTermSchema(",
  "export function buildOrganizationSchema(",
  "export function buildWebSiteSchema(",
  "export function buildFAQSchema(",
  "export function buildBreadcrumbSchema(",
  "export function buildProductSchema(",
];
for (const s of sigs) {
  if (!schemaSrc.includes(s)) die(`schema.ts missing ${s}`);
}
console.log("[1/3] ✓ schema.ts has all required exports");

// ── 2. Patch _EntityDetail.astro ──
const entP = "src/pages/_shared/_EntityDetail.astro";
let ent = R(entP);

const OLD_IMPORT = `import { buildDefinedTermSchema, buildProductSchema, buildFAQSchema, buildBreadcrumbSchema, buildEvidenceSchema } from "../../lib/schema";`;
const NEW_IMPORT = `import { buildEvidenceGraph, buildDefinedTermSchema, buildProductSchema } from "../../lib/schema";`;
if (!ent.includes(OLD_IMPORT)) die("_EntityDetail.astro imports do not match");
ent = ent.replace(OLD_IMPORT, NEW_IMPORT);

const OLD_LOCALE = `const locale = (Astro.currentLocale || "en") as Locale;`;
const NEW_LOCALE = `// EN-only project (see system/globals/en-only-constraint.md): locale pinned to "en".
const locale = "en" as const;`;
if (!ent.includes(OLD_LOCALE)) die("_EntityDetail.astro locale line not matched");
ent = ent.replace(OLD_LOCALE, NEW_LOCALE);

ent = ent.replace(`import type { Locale } from "../../config/site.config";\n`, "");
const OLD_SETUP = `const definedTermSchema = (collectionName === "materials" || collectionName === "standards" || collectionName === "evidence" || collectionName === "applications")
  ? buildDefinedTermSchema({ name: data.title, description: data.description, termCode: slug, inSetName: collectionName, url: pageUrl }) : null;
const productSchema = (collectionName === "materials" || collectionName === "equipment")
  ? buildProductSchema({ name: data.title, description: data.description, url: pageUrl, category: collectionName, material: data.alloy || undefined }) : null;

// Evidence source model: resolve internal /evidence/* stubs and never emit them.
function resolveEvidenceSource(d: any) {
  const src = (d.source || "").trim();
  const rawUrl = (d.sourceUrl || "").trim();
  if (rawUrl.startsWith("http")) return { text: src, url: rawUrl, type: "EXTERNAL", status: "External source" };
  if (rawUrl.startsWith("/")) return { text: src, url: "", type: "INTERNAL_REFERENCE", status: "Internal reference - external citation pending" };
  if (src) return { text: src, url: "", type: "STANDARD_OR_DOC", status: "Cited (no URL)" };
  return { text: "", url: "", type: "UNKNOWN", status: "Source not stated" };
}
const evSource = collectionName === "evidence" ? resolveEvidenceSource(data) : null;

const evidenceSchema = (collectionName === "evidence")
  ? buildEvidenceSchema({
      name: data.title,
      description: data.description,
      url: pageUrl,
      source: evSource?.text || undefined,
      sourceUrl: evSource?.type === "EXTERNAL" ? evSource.url : undefined,
      dataPoints: Array.isArray(data.dataPoints) ? data.dataPoints : undefined,
      relatedStandards: Array.isArray(data.relatedStandards) ? data.relatedStandards : undefined,
    })
  : null;


const faqSchema = (data.faqs && data.faqs.length > 0) ? buildFAQSchema(data.faqs) : null;
const breadcrumbSchema = buildBreadcrumbSchema([
  { label: "Home", href: siteConfig.url + "/" },
  { label: "Knowledge", href: siteConfig.url + resolveRoute(locale, pillarPath) },
  { label: data.title, href: pageUrl },
]);`;

const NEW_SETUP = `// Evidence source model: resolve internal /evidence/* stubs and never emit them.
function resolveEvidenceSource(d: any) {
  const src = (d.source || "").trim();
  const rawUrl = (d.sourceUrl || "").trim();
  if (rawUrl.startsWith("http")) return { text: src, url: rawUrl, type: "EXTERNAL", status: "External source" };
  if (rawUrl.startsWith("/")) return { text: src, url: "", type: "INTERNAL_REFERENCE", status: "Internal reference - external citation pending" };
  if (src) return { text: src, url: "", type: "STANDARD_OR_DOC", status: "Cited (no URL)" };
  return { text: "", url: "", type: "UNKNOWN", status: "Source not stated" };
}
const evSource = collectionName === "evidence" ? resolveEvidenceSource(data) : null;

const breadcrumbCrumbs = [
  { label: "Home", href: siteConfig.url + "/" },
  { label: "Knowledge", href: siteConfig.url + resolveRoute(locale, pillarPath) },
  { label: data.title, href: pageUrl },
];

// JSON-LD strategy:
//   - Evidence pages emit ONE <script type="application/ld+json"> with a
//     single @graph (buildEvidenceGraph). The graph is self-contained:
//     WebSite + Organization + WebPage + DefinedTerm + CreativeWork +
//     Dataset + BreadcrumbList + FAQPage share stable @ids so Google +
//     AI engines dedupe across the site into one Knowledge Graph node.
//   - Other collections emit multiple separate <script> blocks. SEO.astro
//     prepends site-wide Organization + WebSite for those.
let pageJsonLd;
if (collectionName === "evidence") {
  pageJsonLd = buildEvidenceGraph({
    name: data.title,
    description: data.description,
    url: pageUrl,
    collectionSetName: collectionName,
    source: evSource?.text || undefined,
    sourceUrl: evSource?.type === "EXTERNAL" ? evSource.url : undefined,
    dataPoints: Array.isArray(data.dataPoints) ? data.dataPoints : undefined,
    relatedStandards: Array.isArray(data.relatedStandards) ? data.relatedStandards : undefined,
    breadcrumb: breadcrumbCrumbs,
    faqs: Array.isArray(data.faqs) && data.faqs.length > 0 ? data.faqs : undefined,
  });
} else {
  const extras = [];
  if (collectionName === "materials" || collectionName === "standards" || collectionName === "applications") {
    extras.push(buildDefinedTermSchema({ name: data.title, description: data.description, termCode: slug, inSetName: collectionName, url: pageUrl }));
  }
  if (collectionName === "materials" || collectionName === "equipment") {
    extras.push(buildProductSchema({ name: data.title, description: data.description, url: pageUrl, category: collectionName, material: data.alloy || undefined }));
  }
  extras.push(buildBreadcrumbSchema(breadcrumbCrumbs, siteConfig.url));
  if (Array.isArray(data.faqs) && data.faqs.length > 0) {
    extras.push(buildFAQSchema(data.faqs));
  }
  pageJsonLd = extras;
}`;

if (!ent.includes(OLD_SETUP)) die("_EntityDetail.astro schema-setup block not matched");
ent = ent.replace(OLD_SETUP, NEW_SETUP);

const OLD_PROP = `jsonLd={faqSchema || evidenceSchema || definedTermSchema ? [definedTermSchema, productSchema, evidenceSchema, breadcrumbSchema, faqSchema].filter(Boolean) : productSchema ? [productSchema, breadcrumbSchema] : breadcrumbSchema}`;
const NEW_PROP = `jsonLd={pageJsonLd}`;
if (!ent.includes(OLD_PROP)) die("_EntityDetail.astro MarketingLayout jsonLd prop not matched");
ent = ent.replace(OLD_PROP, NEW_PROP);

W(entP, ent);
console.log("[2/3] ✓ _EntityDetail.astro updated (single unified graph for evidence)");

// ── 3. Patch SEO.astro ──
const seoP = "src/components/seo/SEO.astro";
let seo = R(seoP);

const OLD_SEO = `// ── JSON-LD: site-wide defaults + page-specific ──
const siteWideSchemas = [
  jsonLdOrganization(), // Organization (logo, social, contact)
  jsonLdWebSite(), // WebSite (name, search action)
];

// Page-specific schemas from the parent (BlogPosting, Service, FAQPage, etc.)
const pageSchemas = jsonLd
  ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd])
  : [];`;

const NEW_SEO = `// ── JSON-LD: site-wide defaults + page-specific ──
//
// When the page passes a single self-contained @graph document (evidence
// pages via buildEvidenceGraph), the graph already contains Organization
// + WebSite + WebPage + page-specific entities with stable @ids. To
// prevent duplicate @id statements across multiple <script> blocks (which
// blocks Google + AI engines from deduping into one Knowledge Graph node),
// we skip the site-wide prepend ONLY when the page payload is an @graph.
const isGraphDocument = !!(
  jsonLd &&
  typeof jsonLd === "object" &&
  !Array.isArray(jsonLd) &&
  "@graph" in (jsonLd)
);

const siteWideSchemas = isGraphDocument
  ? []
  : [
      jsonLdOrganization(),
      jsonLdWebSite(),
    ];

// Page-specific schemas from the parent (BlogPosting, Service, FAQPage, etc.)
const pageSchemas = jsonLd
  ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd])
  : [];`;

if (!seo.includes(OLD_SEO)) die("SEO.astro JSON-LD block not matched");
seo = seo.replace(OLD_SEO, NEW_SEO);
W(seoP, seo);
console.log("[3/3] ✓ SEO.astro updated (skip siteWide when @graph)");

console.log("---");
console.log("Migration complete. Run pnpm build + pnpm test.");