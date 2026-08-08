import { siteConfig } from "../config/site.config";
import { ensureTrailingSlash, type Locale } from "./site-config";
import { localePrefix, stripLocale } from "../i18n/routes";
import {
  buildWebSiteSchema,
  buildOrganizationSchema,
  buildFAQSchema,
  buildBreadcrumbSchema,
  buildServiceSchema,
} from "./schema";

export interface SeoMeta {
  title: string;
  description: string;
  locale: Locale;
  path: string;
  image?: string;
}

/**
 * File/API/asset routes (js, css, txt, xml, json, og images, …) must NOT get a
 * trailing slash — only real HTML page URLs end with "/" (trailingSlash: 'always').
 * Detected by the presence of a file extension in the last path segment.
 */
const FILE_EXTENSION_RE = /\.[a-z0-9]+$/i;

export function isFileLikePath(path: string): boolean {
  const lastSegment = path.split("/").pop() ?? "";
  return FILE_EXTENSION_RE.test(lastSegment);
}

/**
 * Generate the canonical URL for a given locale and path.
 *
 * Hard rule: page URLs always end with a trailing slash to match Astro's
 * `trailingSlash: 'always'`, keeping canonical / og:url / hreflang / breadcrumb
 * / JSON-LD identical to the real rendered URL (SEO/GEO/visitor consistency).
 * File/API paths (js, css, txt, xml, og images, …) are left untouched.
 * Handles Astro i18n prefix routing (prefixDefaultLocale: false).
 */
export function canonicalUrl(locale: Locale, path: string): string {
  const prefix = localePrefix(locale);
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const finalPath = isFileLikePath(normalized)
    ? normalized
    : ensureTrailingSlash(normalized);
  return `${siteConfig.url}${prefix}${finalPath}`;
}

/**
 * Generate hreflang link elements for the current page across all locales.
 * Handles Astro i18n prefix routing.
 */
export function hreflangLinks(path: string, locales?: string[]): Array<{
  rel: string;
  href: string;
  hreflang: string;
}> {
  // Strip locale prefix to get the content path
  const contentPath = stripLocale(path);

  return (locales ?? siteConfig.i18n.locales).map((loc) => ({
    rel: "alternate",
    href: canonicalUrl(loc as Locale, contentPath),
    hreflang: loc,
  }));
}

/**
 * Delegate to schema.ts — the single source of truth for all JSON-LD schemas.
 * These thin wrappers keep the public API stable while the schema definitions
 * live in schema.ts with full schema-dts type safety.
 */

/** WebSite schema (default fallback for pages without explicit jsonLd). */
export function jsonLdWebSite() {
  return buildWebSiteSchema(siteConfig);
}

/** Organization schema (injected site-wide). */
export function jsonLdOrganization() {
  return buildOrganizationSchema(siteConfig);
}

/** Service schema (service detail pages). */
export function jsonLdService(service: {
  name: string;
  description: string;
  locale: string;
  url: string;
}) {
  // Extract slug from the URL path: "/services/web-development" → "web-development"
  const slug = service.url.replace(/^.*\/services\//, "");
  return buildServiceSchema({
    data: {
      title: service.name,
      description: service.description,
      slug,
      locale: service.locale,
    },
  });
}

/** FAQPage schema (FAQ sections on blog posts, landing pages). */
export function jsonLdFAQ(
  questions: Array<{ question: string; answer: string }>,
) {
  return buildFAQSchema(questions);
}

/** BreadcrumbList schema (auto-derived from pathname). */
export function jsonLdBreadcrumb(items: Array<{ name: string; url: string }>) {
  return buildBreadcrumbSchema(items.map((item) => ({ label: item.name, href: item.url })));
}

/**
 * Generate a BreadcrumbList from a URL path by splitting on "/".
 * Returns null for top-level paths (/) to avoid single-node breadcrumbs.
 */
export function breadcrumbFromPath(
  locale: Locale,
  path: string,
): Array<{ name: string; url: string }> | null {
  const segments = path.replace(/\/$/, "").split("/").filter(Boolean);
  if (segments.length === 0) return null; // homepage — skip single-node breadcrumb

  const crumbs: Array<{ name: string; url: string }> = [
    { name: "Home", url: canonicalUrl(locale, "/") },
  ];

  let accumulated = "";
  for (const segment of segments) {
    accumulated += `/${segment}`;
    // Derive a human-readable label from the segment
    const label = segment
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({
      name: label,
      url: canonicalUrl(locale, accumulated),
    });
  }

  return crumbs;
}

/**
 * Generate Open Graph and Twitter meta tags.
 * Now includes og:image and og:image:secure_url, og:image:width, og:image:height
 * when an image URL is provided.
 */
export function ogMeta(meta: SeoMeta) {
  const url = canonicalUrl(meta.locale, meta.path);
  const imageUrl =
    meta.image ||
    (meta.path
      ? canonicalUrl(meta.locale, meta.path.replace(/^\//, "/"))
      : undefined);

  const base: Record<string, string> = {
    "og:title": meta.title,
    "og:description": meta.description,
    "og:url": url,
    "og:locale": meta.locale,
    "og:site_name": siteConfig.name,
    "og:type": "website",
    "twitter:card": "summary_large_image",
    "twitter:title": meta.title,
    "twitter:description": meta.description,
  };

  if (imageUrl) {
    // For CloudFlare Pages, og:image is the transformed URL from the R2 bucket.
    // og:image:secure_url = same as og:url (canonical) when accessible over HTTPS.
    // og:image:width/height come from the preset.
    base["og:image"] = imageUrl;
    base["og:image:secure_url"] = imageUrl;
    base["og:image:width"] = "1200"; // Default to hero preset size
    base["og:image:height"] = "630";
  }

  return base;
}
