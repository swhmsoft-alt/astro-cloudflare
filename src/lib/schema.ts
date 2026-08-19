import type {
  BreadcrumbList,
  BlogPosting,
  DefinedTerm as SchemaDefinedTerm,
  DefinedTermSet as SchemaDefinedTermSet,
  FAQPage,
  HowTo,
  HowToStep,
  Organization,
  Person,
  Product,
  Service,
  WebSite,
  WithContext,
} from "schema-dts";
import {
  siteConfig as defaultSiteConfig,
  type SiteConfig,
} from "../config/site.config";
import { ensureTrailingSlash } from "../config/site.config";

// ──────────────────────────────────────────────────────────────────────────
// IDENTITY ANCHORS — single source of truth for stable @id references
// ──────────────────────────────────────────────────────────────────────────
//
// These @id values are the canonical entity references reused across every
// rendered page. Google and AI engines use them to merge entities across pages
// into a single Knowledge Graph node. Do NOT change them without a
// coordinated migration across all rendered HTML.

const ORG_ID_FRAGMENT = "#organization";
const WEBSITE_ID_FRAGMENT = "#website";
const AUTHOR_ID_FRAGMENT = "#author";

function siteBase(site: Pick<SiteConfig, "url"> = defaultSiteConfig): string {
  return site.url.replace(/\/$/, "");
}

/** Stable @id for the canonical Organization node. */
export function organizationId(site: Pick<SiteConfig, "url"> = defaultSiteConfig): string {
  return `${siteBase(site)}/${ORG_ID_FRAGMENT}`;
}

/** Stable @id for the canonical WebSite node. */
export function websiteId(site: Pick<SiteConfig, "url"> = defaultSiteConfig): string {
  return `${siteBase(site)}/${WEBSITE_ID_FRAGMENT}`;
}

/** Stable @id for the canonical Person (author) node. */
export function authorId(site: Pick<SiteConfig, "url"> = defaultSiteConfig): string {
  return `${siteBase(site)}/${AUTHOR_ID_FRAGMENT}`;
}

// ──────────────────────────────────────────────────────────────────────────
// Site-wide identity nodes — Organization / WebSite
// ──────────────────────────────────────────────────────────────────────────
//
// Emitted on every page that uses siteWideSchemas (see SEO.astro). Pages that
// build a unified @graph document (buildEvidenceGraph) skip this set so they
// can reference the SAME @ids without producing duplicate node statements.

/**
 * Engineering topic cluster declared via `about`. These are the canonical
 * subject areas the WebSite publishes authoritative content about — used by
 * AI engines to classify the site's expertise. Keep this list curated.
 */
export const SITE_ABOUT_TOPICS: Array<{ "@type": string; name: string }> = [
  { "@type": "Thing", name: "Titanium" },
  { "@type": "Thing", name: "Titanium Alloys" },
  { "@type": "Thing", name: "Titanium Manufacturing" },
  { "@type": "Thing", name: "Titanium Machining" },
  { "@type": "Thing", name: "Aerospace Materials" },
  { "@type": "Thing", name: "Medical Implants" },
];

/**
 * Build the site-wide WebSite node.
 *
 * NOTE: We intentionally do NOT emit a `potentialAction: SearchAction`. Pagefind
 * is a client-side widget, not a real server endpoint, and Google penalizes
 * SearchAction entries that point to non-resolvable URLs. Search is offered in
 * the page UI only.
 */
export function buildWebSiteSchema(
  site: Pick<SiteConfig, "name" | "url" | "description" | "inLanguage"> = defaultSiteConfig,
  locale?: string,
) {
  const lang = locale ?? site.inLanguage ?? "en";
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId(site),
    name: site.name,
    alternateName: "titanium.blog",
    url: site.url,
    description: site.description,
    inLanguage: lang,
    publisher: { "@id": organizationId(site) },
    about: SITE_ABOUT_TOPICS,
    keywords: [
      "titanium",
      "titanium alloys",
      "Ti-6Al-4V",
      "Grade 5",
      "Grade 2",
      "titanium machining",
      "aerospace materials",
      "medical titanium",
      "engineering knowledge hub",
    ],
  } as unknown as WithContext<WebSite>;
}

export function buildOrganizationSchema(
  site: SiteConfig = defaultSiteConfig,
  locale?: string,
) {
  // CRITICAL FIX: sameAs is built from sameAsLinks (NOT socialLinks).
  // socialLinks may contain mailto:/tel: URIs that are INVALID per Schema.org.
  const sameAs = (site.sameAsLinks ?? [])
    .map((link) => link.url)
    .filter(
      (url): url is string =>
        typeof url === "string" && /^https?:\/\//.test(url),
    );

  // CRITICAL FIX: Logo must be an absolute URL for Google Structured Data
  // validation. site.branding.logo.light is a relative path; we prepend the
  // canonical site origin so the JSON-LD emits "https://titanium.blog/logos/logo-light.svg".
  const rawLogo = site.branding.logo.light;
  const absoluteLogo =
    rawLogo && /^https?:\/\//.test(rawLogo)
      ? rawLogo
      : `${site.url.replace(/\/$/, "")}${rawLogo?.startsWith("/") ? "" : "/"}${rawLogo ?? ""}`;

  const lang = locale ?? site.inLanguage ?? "en";

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId(site),
    name: site.name,
    alternateName: "titanium.blog",
    url: site.url,
    description: site.description,
    logo: absoluteLogo,
    foundingDate: site.foundingDate,
    founder: site.founder
      ? { "@type": "Person", name: site.founder }
      : undefined,
    inLanguage: lang,
    sameAs,
    contactPoint: site.email
      ? [
          {
            "@type": "ContactPoint",
            email: site.email,
            contactType: "customer support",
            availableLanguage: [lang],
          },
        ]
      : undefined,
  } as unknown as WithContext<Organization>;
}

export function buildPersonSchema(
  author: {
    name: string;
    bio?: string;
    avatar?: string;
    social?: Record<string, string | undefined>;
  },
  site: SiteConfig = defaultSiteConfig,
  locale?: string,
) {
  const sameAs = Object.values(author.social ?? {}).filter(
    (value): value is string =>
      typeof value === "string" && /^https?:\/\//.test(value),
  );
  const lang = locale ?? site.inLanguage ?? "en";
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": authorId(site),
    name: author.name,
    url: site.url,
    image: author.avatar,
    description: author.bio,
    worksFor: { "@id": organizationId(site) },
    knowsAbout: SITE_ABOUT_TOPICS.map((t) => t.name),
    inLanguage: lang,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  } as unknown as WithContext<Person>;
}

export function buildBlogPostingSchema(
  post: {
    data: {
      title: string;
      description: string;
      publishDate: Date;
      updatedAt?: Date | null;
      author?: string;
      tags?: string[];
      image?: string;
      locale?: string;
    };
    id: string;
  },
  site: SiteConfig = defaultSiteConfig,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.data.title,
    description: post.data.description,
    datePublished: post.data.publishDate.toISOString(),
    dateModified: (post.data.updatedAt ?? post.data.publishDate).toISOString(),
    author: post.data.author
      ? { "@type": "Person", name: post.data.author, "@id": authorId(site) }
      : { "@type": "Person", name: site.name, "@id": authorId(site) },
    publisher: { "@id": organizationId(site) },
    mainEntityOfPage: `${site.url}/blog/${post.id}/`,
    image: post.data.image ? [post.data.image] : undefined,
    keywords: post.data.tags?.join(", "),
    inLanguage: post.data.locale ?? site.inLanguage ?? "en",
  } as unknown as WithContext<BlogPosting>;
}

export function buildFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
  locale?: string,
  site: Pick<SiteConfig, "url" | "inLanguage"> = defaultSiteConfig,
) {
  const lang = locale ?? site.inLanguage ?? "en";
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  } as unknown as WithContext<FAQPage>;
}

export function buildBreadcrumbSchema(
  crumbs: Array<{ label: string; href: string }>,
  siteUrl?: string,
  locale?: string,
  site?: Pick<SiteConfig, "inLanguage">,
) {
  const baseUrl = (siteUrl ?? defaultSiteConfig.url).replace(/\/$/, "");
  const lang = locale ?? site?.inLanguage ?? defaultSiteConfig.inLanguage ?? "en";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    inLanguage: lang,
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: crumb.href.startsWith("/")
        ? `${baseUrl}${ensureTrailingSlash(crumb.href)}`
        : crumb.href,
    })),
  } as unknown as WithContext<BreadcrumbList>;
}

export function buildServiceSchema(
  service: {
    data: {
      title: string;
      description: string;
      slug: string;
      locale?: string;
      priceRange?: string;
      tags?: string[];
    };
  },
  site: SiteConfig = defaultSiteConfig,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.data.title,
    description: service.data.description,
    url: `${site.url}/services/${service.data.slug}/`,
    provider: { "@id": organizationId(site) },
    areaServed: [{ "@type": "Place", name: "Worldwide" }],
    inLanguage: service.data.locale ?? site.inLanguage ?? "en",
    ...(service.data.priceRange ? { priceRange: service.data.priceRange } : {}),
  } as unknown as WithContext<Service>;
}

export function buildHowToSchema(
  howTo: {
    name: string;
    description?: string;
    steps: Array<{
      name: string;
      text: string;
      image?: string;
      url?: string;
    }>;
    totalTime?: string;
    estimatedCost?: string;
    image?: string;
  },
  site: SiteConfig = defaultSiteConfig,
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howTo.name,
    description: howTo.description,
    image: howTo.image ?? site.branding.logo.light,
    totalTime: howTo.totalTime,
    estimatedCost: howTo.estimatedCost
      ? { "@type": "MonetaryAmount", currency: "USD", value: howTo.estimatedCost }
      : undefined,
    inLanguage: site.inLanguage ?? "en",
    step: howTo.steps.map(
      (step, i) =>
        ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.name,
          text: step.text,
          image: step.image ? [step.image] : undefined,
          url: step.url,
        }) satisfies HowToStep,
    ),
  } as unknown as WithContext<HowTo>;
}

/**
 * @deprecated Materials, equipment, and similar entities are KNOWLEDGE assets,
 * NOT products for sale. Emitting `Product` + `Offer` with `availability: InStock`
 * when nothing is being sold violates Google's "Selling products that are not for
 * sale" rich-result policy and downgrades the entire site's structured data
 * quality.
 *
 * Replace usage with {@link buildKnowledgeArticleGraph}, which emits a
 * `TechArticle` + `DefinedTerm` instead. This stub is kept ONLY for backwards
 * compatibility and now emits a harmless `DefinedTerm` so legacy callers don't
 * silently drop content during migration.
 */
export function buildProductSchema(
  product: {
    name: string;
    description: string;
    url: string;
    image?: string;
    category?: string;
    material?: string;
    sku?: string;
  },
  site: SiteConfig = defaultSiteConfig,
) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": product.url,
    name: product.name,
    description: product.description,
    termCode: product.sku ?? product.url.split("/").filter(Boolean).pop() ?? product.name,
    url: product.url,
    inLanguage: site.inLanguage ?? "en",
  } as unknown as WithContext<SchemaDefinedTerm>;
}

export function buildDefinedTermSchema(
  term: {
    name: string;
    description: string;
    termCode: string;
    inSetName: string;
    url: string;
    inSetUrl?: string;
  },
  locale?: string,
  site: Pick<SiteConfig, "inLanguage"> = defaultSiteConfig,
) {
  const lang = locale ?? site.inLanguage ?? "en";
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": term.url,
    name: term.name,
    description: term.description,
    termCode: term.termCode,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: term.inSetName,
      ...(term.inSetUrl ? { "@id": term.inSetUrl } : {}),
    },
    url: term.url,
    inLanguage: lang,
  } as unknown as WithContext<SchemaDefinedTerm>;
}

export function buildDefinedTermSetSchema(
  name: string,
  description: string,
  terms: Array<{
    name: string;
    description: string;
    termCode: string;
    url: string;
    inSetName: string;
  }>,
  setUrl?: string,
  locale?: string,
  site: Pick<SiteConfig, "inLanguage"> = defaultSiteConfig,
) {
  const lang = locale ?? site.inLanguage ?? "en";
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    ...(setUrl ? { "@id": setUrl } : {}),
    name,
    description,
    inLanguage: lang,
    hasDefinedTerm: terms.map((t) => ({
      "@type": "DefinedTerm",
      "@id": t.url,
      name: t.name,
      description: t.description,
      termCode: t.termCode,
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: t.inSetName,
        ...(setUrl ? { "@id": setUrl } : {}),
      },
      url: t.url,
      inLanguage: lang,
    })),
  } as unknown as WithContext<SchemaDefinedTermSet>;
}

export function buildCollectionPageSchema(
  collection: {
    name: string;
    description: string;
    url: string;
    numberOfItems: number;
  },
  site: SiteConfig = defaultSiteConfig,
  locale?: string,
) {
  const lang = locale ?? site.inLanguage ?? "en";
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": collection.url,
    name: collection.name,
    description: collection.description,
    url: collection.url,
    isPartOf: { "@id": websiteId(site) },
    publisher: { "@id": organizationId(site) },
    inLanguage: lang,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: collection.numberOfItems,
    },
  } as unknown as WithContext<any>;
}

export function buildItemListSchema(
  itemList: {
    itemType: string;
    numberOfItems: number;
    url: string;
    itemListElement: Array<{
      name: string;
      description: string;
      url: string;
    }>;
  },
  locale?: string,
  site: Pick<SiteConfig, "inLanguage"> = defaultSiteConfig,
) {
  if (itemList.numberOfItems === 0) return null;
  const lang = locale ?? site.inLanguage ?? "en";
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": itemList.url,
    numberOfItems: itemList.numberOfItems,
    url: itemList.url,
    inLanguage: lang,
    itemListElement: itemList.itemListElement.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": itemList.itemType,
        name: item.name,
        description: item.description,
        url: item.url,
      },
    })),
  } as unknown as WithContext<any>;
}

export function buildTechArticleSchema(
  article: {
    headline: string;
    description: string;
    datePublished: string;
    dateModified?: string;
    authorName?: string;
    image?: string;
    keywords?: string[];
    url: string;
    inLanguage?: string;
    mentions?: string[];
  },
  site: SiteConfig = defaultSiteConfig,
) {
  const lang = article.inLanguage ?? site.inLanguage ?? "en";
  const mentions = (article.mentions ?? [])
    .filter((url) => typeof url === "string" && /^https?:\/\//.test(url))
    .map((url) => ({ "@type": "Thing" as const, "@id": url, url }));
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": article.url,
    headline: article.headline,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    author: article.authorName
      ? { "@type": "Person", name: article.authorName, "@id": authorId(site) }
      : { "@type": "Person", name: site.name, "@id": authorId(site) },
    publisher: { "@id": organizationId(site) },
    image: article.image ?? undefined,
    keywords: article.keywords?.join(", "),
    mainEntityOfPage: { "@id": article.url },
    inLanguage: lang,
    isPartOf: { "@id": websiteId(site) },
    mentions: mentions.length > 0 ? mentions : undefined,
  } as unknown as WithContext<any>;
}

export interface EvidenceDataPoint {
  property: string;
  value: string;
  unit?: string;
  notes?: string;
}

/**
 * @deprecated Use {@link buildEvidenceGraph} for evidence pages.
 * This helper still emits a single CreativeWork-only document with no
 * publisher / author / sameAs / inLanguage. It is kept ONLY for
 * backwards-compat with any external consumers; internal pages must
 * emit a single @graph via buildEvidenceGraph.
 */
export function buildEvidenceSchema(e: {
  name: string;
  description: string;
  url: string;
  source?: string;
  sourceUrl?: string;
  dataPoints?: EvidenceDataPoint[];
  relatedStandards?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": e.url,
    name: e.name,
    description: e.description,
    mainEntityOfPage: { "@type": "WebPage", "@id": e.url },
    ...(e.source
      ? {
          citation: {
            "@type": "CreativeWork",
            name: e.source,
            ...(e.sourceUrl ? { url: e.sourceUrl } : {}),
          },
        }
      : {}),
    ...(e.dataPoints && e.dataPoints.length > 0
      ? {
          subjectOf: {
            "@type": "Dataset",
            name: `${e.name} — Engineering Data Points`,
            variableMeasured: e.dataPoints.map((dp) => ({
              "@type": "PropertyValue",
              name: dp.property,
              value: dp.value,
              ...(dp.unit ? { unitText: dp.unit } : {}),
              ...(dp.notes ? { description: dp.notes } : {}),
            })),
          },
        }
      : {}),
    ...(e.relatedStandards && e.relatedStandards.length > 0
      ? {
          isBasedOn: e.relatedStandards.map((s) => ({
            "@type": "DefinedTerm",
            name: s,
          })),
        }
      : {}),
  } as unknown as WithContext<any>;
}

export interface EvidenceGraphInput {
  name: string;
  description: string;
  url: string;
  collectionSetName?: string;
  collectionSetUrl?: string;
  source?: string;
  sourceUrl?: string;
  dataPoints?: EvidenceDataPoint[];
  relatedStandards?: string[];
  breadcrumb?: Array<{ label: string; href: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  /** Locale (e.g. "en", "de"). Used for `inLanguage`. */
  locale?: string;
}

export function buildEvidenceGraph(
  input: EvidenceGraphInput,
  site: SiteConfig = defaultSiteConfig,
) {
  const graph: any[] = [];
  const lang = input.locale ?? site.inLanguage ?? "en";

  // 1. WebSite (site-wide identity anchor)
  graph.push({
    "@type": "WebSite",
    "@id": websiteId(site),
    name: site.name,
    alternateName: "titanium.blog",
    url: site.url,
    inLanguage: lang,
    publisher: { "@id": organizationId(site) },
  });

  // 2. Organization — full node so the graph is self-contained.
  graph.push(buildOrganizationSchema(site));

  // 3. WebPage — the URL itself, hosted under the WebSite.
  graph.push({
    "@type": "WebPage",
    "@id": input.url,
    url: input.url,
    name: input.name,
    description: input.description,
    isPartOf: { "@id": websiteId(site) },
    publisher: { "@id": organizationId(site) },
    inLanguage: lang,
  });

  // 4. DefinedTermSet — collection anchor (only when provided).
  if (input.collectionSetName) {
    graph.push({
      "@type": "DefinedTermSet",
      "@id":
        input.collectionSetUrl ??
        `${siteBase(site)}/#defined-term-set-${encodeURIComponent(input.collectionSetName)}`,
      name: input.collectionSetName,
      description: `Canonical collection: ${input.collectionSetName}.`,
    });
  }

  // 5. DefinedTerm — the page's evidence entry itself.
  graph.push({
    "@type": "DefinedTerm",
    "@id": input.url,
    name: input.name,
    description: input.description,
    termCode: input.url.split("/").filter(Boolean).pop() ?? input.name,
    inDefinedTermSet: input.collectionSetName
      ? {
          "@type": "DefinedTermSet",
          name: input.collectionSetName,
          ...(input.collectionSetUrl ? { "@id": input.collectionSetUrl } : {}),
        }
      : undefined,
    url: input.url,
    inLanguage: lang,
  });

  // 6. CreativeWork citation — only when sourceUrl is an absolute https URL.
  //    We do NOT @id the source with a non-https URL (mailto: / internal stub).
  if (input.source && input.sourceUrl && /^https?:\/\//.test(input.sourceUrl)) {
    graph.push({
      "@type": "CreativeWork",
      "@id": input.sourceUrl,
      name: input.source,
      url: input.sourceUrl,
    });
  } else if (input.source) {
    graph.push({
      "@type": "CreativeWork",
      name: input.source,
    });
  }

  // 7. Dataset of engineering data points (only when present).
  if (input.dataPoints && input.dataPoints.length > 0) {
    graph.push({
      "@type": "Dataset",
      "@id": `${input.url}#dataset`,
      name: `${input.name} — Engineering Data Points`,
      isPartOf: { "@id": input.url },
      variableMeasured: input.dataPoints.map((dp) => ({
        "@type": "PropertyValue",
        name: dp.property,
        value: dp.value,
        ...(dp.unit ? { unitText: dp.unit } : {}),
        ...(dp.notes ? { description: dp.notes } : {}),
      })),
    });
  }

  // 8. BreadcrumbList (when provided).
  if (input.breadcrumb && input.breadcrumb.length > 0) {
    graph.push(buildBreadcrumbSchema(input.breadcrumb, site.url));
  }

  // 9. FAQPage (when provided).
  if (input.faqs && input.faqs.length > 0) {
    graph.push(buildFAQSchema(input.faqs, input.locale, site));
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

// ──────────────────────────────────────────────────────────────────────────
// UNIFIED @graph BUILDERS — single source of truth for knowledge pages
// ──────────────────────────────────────────────────────────────────────────
//
// These helpers replace the prior pattern of emitting N separate
// `<script type="application/ld+json">` blocks per page. Every page now emits
// at most one `@graph` document that contains:
//   - The page-specific entity (TechArticle / DefinedTerm / CollectionPage)
//   - Site-wide identity anchors (WebSite, Organization) with stable @ids
//   - Optional relationship nodes (Citation, Dataset, BreadcrumbList, FAQPage)
//
// `SEO.astro` detects when the page graph already includes the site-wide
// @ids and skips its own emission, eliminating duplicate node statements.

/**
 * Canonical collection set anchors. Each knowledge collection has a stable
 * `@id` URL that is reused by both pillar and detail pages. This lets Google
 * merge `DefinedTerm.hasDefinedTerm` references across the site into a single
 * Knowledge Graph node per collection.
 */
export const COLLECTION_SET_IDS = {
  materials: "grades",
  processes: "processes",
  industries: "industries",
  standards: "standards",
  surfaceFinishes: "finishes",
  equipment: "equipment",
  materialSelection: "selection",
  failureAnalysis: "failures",
  heatTreatment: "heat-treatment",
  corrosion: "corrosion",
  evidence: "evidence",
  procurement: "procurement",
  applications: "applications",
  cases: "cases",
  comparisons: "compare",
  guides: "guides",
  industriesAerospace: "industries-aerospace",
  industriesAutomotive: "industries-automotive",
  industriesChemicalProcessing: "industries-chemical-processing",
  industriesDefence: "industries-defence",
  industriesMarine: "industries-marine",
  industriesMedical: "industries-medical",
  industriesOilAndGas: "industries-oil-and-gas",
  industriesSemiconductor: "industries-semiconductor",
} as const;

export type CollectionSetKey = keyof typeof COLLECTION_SET_IDS;

/**
 * Returns the stable `@id` URL for a collection's `DefinedTermSet` anchor.
 * Used by both pillar pages (ItemList items point at it) and detail pages
 * (DefinedTerm.inDefinedTermSet references it).
 */
export function buildEntitySetAnchor(
  key: CollectionSetKey,
  site: SiteConfig = defaultSiteConfig,
): string {
  const base = site.url.replace(/\/$/, "");
  return `${base}/#defined-term-set-${COLLECTION_SET_IDS[key]}`;
}

/**
 * Convert a list of URL strings into schema.org `Thing` stubs for use in a
 * `mentions` array. Filters out non-http URLs (Schema.org requires resolvable
 * URIs in knowledge-graph edges).
 */
export function buildMentions(urls: Array<string | undefined | null> | undefined) {
  if (!urls || urls.length === 0) return undefined;
  const filtered = urls.filter(
    (u): u is string => typeof u === "string" && /^https?:\/\//.test(u),
  );
  if (filtered.length === 0) return undefined;
  return filtered.map((url) => ({ "@type": "Thing" as const, "@id": url, url }));
}

/**
 * Inputs for a single knowledge-article page (TechArticle + DefinedTerm +
 * WebPage + optional Breadcrumb / FAQ / Dataset / Citation).
 *
 * Designed so that `evidence` pages AND `materials/standards/processes/...`
 * detail pages all funnel through one unified graph — eliminates duplicate
 * `Organization`/`WebSite`/`BreadcrumbList` nodes across pages.
 */
export interface KnowledgeArticleGraphInput {
  /** Page headline used for TechArticle. */
  name: string;
  description: string;
  /** Absolute canonical URL for this page. */
  url: string;
  /** Collection key for the `DefinedTermSet` anchor. */
  collectionKey: CollectionSetKey;
  /** Locale (e.g. "en", "de"). Used for `inLanguage`. */
  locale: string;
  /** ISO 8601 publish date. */
  datePublished?: string;
  /** ISO 8601 modified date. Defaults to `datePublished`. */
  dateModified?: string;
  /** Author display name. */
  authorName?: string;
  /** Image URL (absolute). */
  image?: string;
  /** Free-form keywords (joined into TechArticle.keywords). */
  keywords?: string[];
  /** Optional breadcrumb trail (Home → pillar → current). */
  breadcrumb?: Array<{ label: string; href: string }>;
  /** Optional FAQ section. */
  faqs?: Array<{ question: string; answer: string }>;
  /** Optional data points (Dataset node). */
  dataPoints?: EvidenceDataPoint[];
  /** External citation (source name + absolute URL). */
  source?: { name: string; url?: string };
  /** Internal mention URLs (relatedMaterials/relatedStandards/etc.). */
  mentions?: string[];
  /** Set true for evidence pages (adds a citation warning node). */
  isEvidence?: boolean;
}

/**
 * Unified `@graph` document for a knowledge-article page.
 *
 * Replaces the old approach where a detail page emitted N independent scripts
 * (DefinedTerm + Product + Breadcrumb + FAQ) AND the layout added Organization
 * + WebSite — totaling 6 duplicate-prone blocks per page.
 *
 * Now emits a single `<script type="application/ld+json">` containing:
 *   1. WebSite        (site identity, `about`/`keywords`)
 *   2. Organization   (publisher, logo)
 *   3. WebPage        (this URL)
 *   4. TechArticle    (the entry, with `mentions` for relationships)
 *   5. DefinedTerm    (the entry as a knowledge term)
 *   6. DefinedTermSet (collection anchor)
 *   7. Citation       (external source, when present)
 *   8. Dataset        (engineering data points, when present)
 *   9. BreadcrumbList (when provided)
 *  10. FAQPage        (when provided)
 */
export function buildKnowledgeArticleGraph(
  input: KnowledgeArticleGraphInput,
  site: SiteConfig = defaultSiteConfig,
) {
  const graph: any[] = [];
  const lang = input.locale ?? site.inLanguage ?? "en";

  // 1. WebSite — site identity anchor (deduped against SEO.astro).
  graph.push(buildWebSiteSchema(site, input.locale));

  // 2. Organization — publisher anchor (deduped against SEO.astro).
  graph.push(buildOrganizationSchema(site, input.locale));

  // 3. WebPage — the URL itself.
  graph.push({
    "@type": "WebPage",
    "@id": input.url,
    url: input.url,
    name: input.name,
    description: input.description,
    isPartOf: { "@id": websiteId(site) },
    publisher: { "@id": organizationId(site) },
    inLanguage: lang,
  });

  // 4. TechArticle — the entry as an engineering article.
  const publishedISO = input.datePublished ?? new Date().toISOString();
  const techArticle: Record<string, unknown> = {
    "@type": "TechArticle",
    "@id": `${input.url}#tech-article`,
    headline: input.name,
    description: input.description,
    datePublished: publishedISO,
    dateModified: input.dateModified ?? publishedISO,
    author: input.authorName
      ? { "@type": "Person", name: input.authorName, "@id": authorId(site) }
      : { "@type": "Person", name: site.name, "@id": authorId(site) },
    publisher: { "@id": organizationId(site) },
    image: input.image ?? undefined,
    keywords: input.keywords?.join(", "),
    mainEntityOfPage: { "@id": input.url },
    isPartOf: { "@id": websiteId(site) },
    inLanguage: lang,
  };
  const mentions = buildMentions(input.mentions);
  if (mentions) techArticle.mentions = mentions;
  graph.push(techArticle);

  // 5. DefinedTerm — the entry as a knowledge term.
  const setAnchor = buildEntitySetAnchor(input.collectionKey, site);
  graph.push({
    "@type": "DefinedTerm",
    "@id": `${input.url}#defined-term`,
    name: input.name,
    description: input.description,
    termCode: input.url.split("/").filter(Boolean).pop() ?? input.name,
    inDefinedTermSet: { "@type": "DefinedTermSet", "@id": setAnchor },
    url: input.url,
    inLanguage: lang,
  });

  // 6. DefinedTermSet — collection anchor (stable @id, reused across pages).
  graph.push({
    "@type": "DefinedTermSet",
    "@id": setAnchor,
    name: COLLECTION_SET_IDS[input.collectionKey],
    description: `Canonical collection: ${COLLECTION_SET_IDS[input.collectionKey]}.`,
    inLanguage: lang,
  });

  // 7. Citation — only when source has an absolute https URL.
  if (input.source?.url && /^https?:\/\//.test(input.source.url)) {
    graph.push({
      "@type": "CreativeWork",
      "@id": input.source.url,
      name: input.source.name,
      url: input.source.url,
    });
  } else if (input.source?.name) {
    graph.push({
      "@type": "CreativeWork",
      name: input.source.name,
    });
  }

  // 8. Dataset — engineering data points (evidence pages).
  if (input.dataPoints && input.dataPoints.length > 0) {
    graph.push({
      "@type": "Dataset",
      "@id": `${input.url}#dataset`,
      name: `${input.name} — Engineering Data Points`,
      isPartOf: { "@id": input.url },
      variableMeasured: input.dataPoints.map((dp) => ({
        "@type": "PropertyValue",
        name: dp.property,
        value: dp.value,
        ...(dp.unit ? { unitText: dp.unit } : {}),
        ...(dp.notes ? { description: dp.notes } : {}),
      })),
    });
  }

  // 9. BreadcrumbList.
  if (input.breadcrumb && input.breadcrumb.length > 0) {
    graph.push(buildBreadcrumbSchema(input.breadcrumb, site.url, input.locale, site));
  }

  // 10. FAQPage.
  if (input.faqs && input.faqs.length > 0) {
    graph.push(buildFAQSchema(input.faqs, input.locale, site));
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

/**
 * Inputs for a pillar/collection page (CollectionPage + ItemList + DefinedTermSet + Breadcrumb).
 */
export interface PillarGraphInput {
  name: string;
  description: string;
  url: string;
  collectionKey: CollectionSetKey;
  locale: string;
  items: Array<{ name: string; description: string; url: string }>;
  breadcrumb?: Array<{ label: string; href: string }>;
  faqs?: Array<{ question: string; answer: string }>;
}

/**
 * Unified `@graph` document for a pillar/collection page.
 *
 * Replaces the old pattern of `CollectionPage` + `ItemList` + `Breadcrumb`
 * as separate script blocks. Now a single graph containing site-wide anchors
 * (so SEO.astro can dedupe) plus the collection-specific nodes.
 */
export function buildPillarGraph(
  input: PillarGraphInput,
  site: SiteConfig = defaultSiteConfig,
) {
  const graph: any[] = [];
  const lang = input.locale ?? site.inLanguage ?? "en";

  // 1. WebSite + 2. Organization — site-wide identity anchors (deduped by SEO.astro).
  graph.push(buildWebSiteSchema(site, input.locale));
  graph.push(buildOrganizationSchema(site, input.locale));

  // 3. WebPage.
  graph.push({
    "@type": "WebPage",
    "@id": input.url,
    url: input.url,
    name: input.name,
    description: input.description,
    isPartOf: { "@id": websiteId(site) },
    publisher: { "@id": organizationId(site) },
    inLanguage: lang,
  });

  // 4. CollectionPage.
  graph.push(
    buildCollectionPageSchema(
      {
        name: input.name,
        description: input.description,
        url: input.url,
        numberOfItems: input.items.length,
      },
      site,
      input.locale,
    ),
  );

  // 5. ItemList (only if there are items).
  const itemList = buildItemListSchema(
    {
      itemType: "TechArticle",
      numberOfItems: input.items.length,
      url: `${input.url}#itemlist`,
      itemListElement: input.items,
    },
    input.locale,
    site,
  );
  if (itemList) graph.push(itemList);

  // 6. DefinedTermSet anchor — stable, reused across sibling pages.
  const setAnchor = buildEntitySetAnchor(input.collectionKey, site);
  graph.push({
    "@type": "DefinedTermSet",
    "@id": setAnchor,
    name: COLLECTION_SET_IDS[input.collectionKey],
    description: `Canonical collection: ${COLLECTION_SET_IDS[input.collectionKey]}.`,
    inLanguage: lang,
    hasDefinedTerm: input.items.map((item) => ({
      "@type": "Thing",
      "@id": item.url,
      name: item.name,
      url: item.url,
    })),
  });

  // 7. BreadcrumbList (when provided).
  if (input.breadcrumb && input.breadcrumb.length > 0) {
    graph.push(buildBreadcrumbSchema(input.breadcrumb, site.url, input.locale, site));
  }

  // 8. FAQPage (when provided).
  if (input.faqs && input.faqs.length > 0) {
    graph.push(buildFAQSchema(input.faqs, input.locale, site));
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

/**
 * Returns true if the given object is a `@graph` document that already
 * contains an Organization or WebSite node (i.e. SEO.astro should skip
 * emitting its site-wide schemas to avoid duplication).
 */
export function graphContainsSiteWide(
  graphDoc: unknown,
  site: SiteConfig = defaultSiteConfig,
): { hasOrg: boolean; hasWebSite: boolean } {
  if (
    !graphDoc ||
    typeof graphDoc !== "object" ||
    !("@graph" in (graphDoc as Record<string, unknown>))
  ) {
    return { hasOrg: false, hasWebSite: false };
  }
  const graph = (graphDoc as { "@graph": unknown[] })["@graph"];
  if (!Array.isArray(graph)) return { hasOrg: false, hasWebSite: false };

  const orgId = organizationId(site);
  const wsId = websiteId(site);
  let foundOrg = false;
  let foundWebSite = false;
  for (const node of graph) {
    if (!node || typeof node !== "object") continue;
    const id = (node as { "@id"?: string })["@id"];
    if (id === orgId) foundOrg = true;
    if (id === wsId) foundWebSite = true;
  }
  return { hasOrg: foundOrg, hasWebSite: foundWebSite };
}
