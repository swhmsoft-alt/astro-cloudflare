import type {
  BreadcrumbList,
  BlogPosting,
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

export function buildWebSiteSchema(
  site: Pick<SiteConfig, "name" | "url" | "description"> = defaultSiteConfig,
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.url}/search?query={search_term_string}`,
    },
  } satisfies WithContext<WebSite>;
}

export function buildOrganizationSchema(site: SiteConfig = defaultSiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.description,
    logo: site.branding.logo.light,
    contactPoint: site.email
      ? [
          {
            "@type": "ContactPoint",
            email: site.email,
            contactType: "customer support",
          },
        ]
      : undefined,
    sameAs: site.socialLinks.map((link) => link.url),
  } satisfies WithContext<Organization>;
}

export function buildPersonSchema(
  author: {
    name: string;
    bio?: string;
    avatar?: string;
    social?: Record<string, string | undefined>;
  },
  site: SiteConfig = defaultSiteConfig,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: site.url,
    image: author.avatar,
    description: author.bio,
    sameAs: Object.values(author.social ?? {}).filter(
      (value): value is string => Boolean(value),
    ),
  } satisfies WithContext<Person>;
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
      ? { "@type": "Person", name: post.data.author }
      : undefined,
    mainEntityOfPage: `${site.url}/blog/${post.id}/`,
    image: post.data.image ? [post.data.image] : undefined,
    keywords: post.data.tags?.join(", "),
    inLanguage: post.data.locale,
  } satisfies WithContext<BlogPosting>;
}

export function buildFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  } satisfies WithContext<FAQPage>;
}

/**
 * Build a BreadcrumbList schema (JSON-LD).
 *
 * Google requires every `item` value in a BreadcrumbList to be an absolute URL.
 * Relative paths (e.g. "/blog") are automatically prepended with the site URL.
 *
 * @param crumbs - Breadcrumb entries. If `href` starts with "/", it's resolved to an absolute URL.
 * @param siteUrl - Optional base URL. Defaults to `siteConfig.url` (https://titanium.blog).
 */
export function buildBreadcrumbSchema(
  crumbs: Array<{ label: string; href: string }>,
  siteUrl?: string,
) {
  const baseUrl = (siteUrl ?? defaultSiteConfig.url).replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: crumb.href.startsWith("/")
        ? `${baseUrl}${ensureTrailingSlash(crumb.href)}`
        : crumb.href,
    })),
  } satisfies WithContext<BreadcrumbList>;
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
    provider: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
  } satisfies WithContext<Service>;
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
  } satisfies WithContext<HowTo>;
}

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
    "@type": "Product",
    name: product.name,
    description: product.description,
    url: product.url,
    image: product.image ?? undefined,
    category: product.category,
    material: product.material,
    sku: product.sku,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: product.url,
    },
    manufacturer: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
  } satisfies WithContext<Product>;
}

export function buildDefinedTermSchema(
  term: {
    name: string;
    description: string;
    termCode: string;
    inSetName: string;
    url: string;
  },
) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.name,
    description: term.description,
    termCode: term.termCode,
    inDefinedTermSet: term.inSetName,
    url: term.url,
  } satisfies WithContext<any>;
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
) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name,
    description,
    hasDefinedTerm: terms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.name,
      description: t.description,
      termCode: t.termCode,
      inDefinedTermSet: t.inSetName,
      url: t.url,
    })),
  } satisfies WithContext<any>;
}

export function buildCollectionPageSchema(
  collection: {
    name: string;
    description: string;
    url: string;
    numberOfItems: number;
  },
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.name,
    description: collection.description,
    url: collection.url,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: collection.numberOfItems,
    },
  } satisfies WithContext<any>;
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
) {
  if (itemList.numberOfItems === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: itemList.numberOfItems,
    url: itemList.url,
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
  } satisfies WithContext<any>;
}

/**
 * GEO evidence/citation-asset schema.
 *
 * Models an evidence page as a machine-verifiable Citation Asset:
 *   - a `CreativeWork` node keyed by the page URL (@id)
 *   - an explicit `citation` to the authoritative source (CreativeWork), only
 *     when a real external source/URL exists (never fabricate — keep GAP empty)
 *   - structured engineering data points as a `Dataset` → `variableMeasured`
 *     (PropertyValue list) so LLMs can extract the tabular facts directly
 *   - `isBasedOn` links to related standards (DefinedTerm)
 *
 * No publish dates are invented: evidence entries carry no pubDate, so we do
 * NOT emit a TechArticle (which schema-dts/Google require dated for rich
 * results). A dated CreativeWork/Dataset is honest and LLM-friendly without
 * fabricating metadata.
 */
export interface EvidenceDataPoint {
  property: string;
  value: string;
  unit?: string;
  notes?: string;
}

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
  } satisfies WithContext<any>;
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
  },
) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: article.headline,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    author: article.authorName
      ? { "@type": "Person", name: article.authorName }
      : { "@type": "Organization", name: "Titanium Blog" },
    image: article.image ?? undefined,
    keywords: article.keywords?.join(", "),
    mainEntityOfPage: article.url,
    inLanguage: article.inLanguage ?? "en",
  } satisfies WithContext<any>;
}

