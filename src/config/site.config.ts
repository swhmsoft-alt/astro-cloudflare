/**
 * Site configuration — Centralized site settings following Astro Rocket reference
 * This is the single source of truth for all site-wide configuration,
 * including SEO canonical, OG, sitemap, and Starlight docs.
 *
 * The site is EN-only at runtime (locked 2026-08-23, Session 2 of i18n cleanup).
 * No locale registry, no hreflang emission, no `[locale]` URL prefixes.
 * The `Locale` type is kept as `string` for backward compatibility with the
 * many call sites that pass a locale argument to UI helpers.
 */

/**
 * Backward-compat locale type. The site only ships `"en"`; this alias lets
 * legacy call sites keep their `locale: Locale` parameter without churn.
 */
export type Locale = string;

export const DEFAULT_LOCALE = "en";

/**
 * Ensure a path ends with exactly one trailing slash, except for empty/root.
 * Used by SEO canonical/alternate URL builders.
 */
export function ensureTrailingSlash(path: string): string {
  if (path === "" || path === "/") return "/";
  return path.endsWith("/") ? path : path + "/";
}

/* ────────────────────────────────────────────────────────────────────────── */

/** Site configuration interface */
export interface SiteConfig {
  /* Core site metadata */
  url: string;
  name: string;
  description: string;
  author: string;
  email: string;
  authorImage?: string;

  /* Default content language for SEO (BCP-47). Defaults to defaultLocale. */
  inLanguage?: string;

  /* Site authority / E-E-A-T signals for Knowledge Graph */
  founder?: string;
  foundingDate?: string; // ISO 8601 (YYYY-MM-DD)

  /* Social media and contact links (UI display — header, contact, footer). */
  socialLinks: Array<{
    platform: string;
    url: string;
    icon?: string;
    label?: string;
  }>;

  /* Canonical identity URLs for Organization.sameAs. FILTERED to http(s) only
   * at the schema-factory layer — mailto:, tel:, and other non-identity URIs
   * are NOT valid sameAs values per Schema.org. Each entry should be a stable
   * authority anchor (LinkedIn, Wikidata Q-ID, Wikipedia, GitHub, Crunchbase). */
  sameAsLinks: Array<{
    platform: string;
    url: string;
  }>;

  /* Header configuration */
  header: {
    showSocialLinks: boolean;
    twitter?: string;
  };

  /* Search engine verification */
  verification: {
    google: string;
    bing: string;
  };

  /* Open Graph and social image */
  ogImage: string;

  /* Blog configuration */
  blog: {
    postsPerPage: number;
    tagCloudLimit: number;
  };

  /* Services configuration */
  services: {
    perPage: number;
    tagCloudLimit: number;
  };

  /* Article features */
  articleFeatures: {
    toc: {
      enabled: boolean;
      layout: "sidebar" | "inline" | "none";
      sidebarPosition: "left" | "right";
      minHeadings: number;
      maxDepth: number;
    };
    comments: { enabled: boolean };
  };

  /* Blog image overlay */
  blogImageOverlay: boolean;

  /* Branding configuration */
  branding: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      foreground: string;
      border: string;
      ring: string;
    };
    logo: { light: string; dark: string };
    favicon: string;
  };
}

export const siteConfig: SiteConfig = {
  /* Core configuration — single source of truth for canonical/OG/sitemap/llms.txt. */
  url: "https://titanium.blog",
  name: "titanium.blog",
  description:
    "The independent titanium engineering knowledge hub. Expert technical guides on titanium grades, material selection, corrosion resistance, heat treatment, failure analysis, and manufacturing processes. Built for engineers, designers, and material researchers worldwide.",
  author: "Titanium Blog Team",
  email: "hello@titanium.blog",
  authorImage: "/images/author.jpg",

  /* Default content language for Schema.org inLanguage and SEO. */
  inLanguage: "en",

  /* E-E-A-T anchors for Knowledge Graph + Google Business Profile. */
  founder: "Titanium Blog Editorial Team",
  foundingDate: "2024-01-01",

  /* Social links (UI display — header, footer). */
  socialLinks: [
    {
      platform: "linkedin",
      url: "https://linkedin.com/company/titanium-blog",
      label: "LinkedIn",
    },
    { platform: "email", url: "mailto:hello@titanium.blog", label: "Email" },
  ],

  /* Canonical identity URLs for Organization.sameAs.
   * Only http(s) URLs are valid; mailto:/tel: are REJECTED at schema-factory
   * time. Add Wikidata Q-ID, Wikipedia, GitHub, Crunchbase when available.
   *
   * TODO[geo-foundation]: Add Wikidata Q-ID once registered
   *   URL pattern: https://www.wikidata.org/wiki/Q<id>
   * TODO[geo-foundation]: Add Wikipedia article URL if/when one exists
   * TODO[geo-foundation]: Add GitHub organization URL if/when one exists
   * TODO[geo-foundation]: Add Crunchbase URL if/when one exists
   */
  sameAsLinks: [
    {
      platform: "linkedin",
      url: "https://linkedin.com/company/titanium-blog",
    },
  ],

  /* Header settings */
  header: {
    showSocialLinks: true,
  },

  /* Search engine verification */
  verification: {
    google: "",
    bing: "",
  },

  /* Social image */
  ogImage: "/images/og-default.jpg",

  /* Blog configuration */
  blog: {
    postsPerPage: 12,
    tagCloudLimit: 30,
  },

  /* Services configuration */
  services: {
    perPage: 12,
    tagCloudLimit: 30,
  },

  /* Article features */
  articleFeatures: {
    toc: {
      enabled: true,
      layout: "sidebar",
      sidebarPosition: "right",
      minHeadings: 2,
      maxDepth: 4,
    },
    comments: { enabled: false },
  },

  /* Blog image overlay */
  blogImageOverlay: true,

  /* Branding — industrial titanium theme */
  branding: {
    colors: {
      primary: "#1a1a2e",
      secondary: "#4a4a6a",
      accent: "#2d6a9f",
      background: "#ffffff",
      foreground: "#1a1a2e",
      border: "#d4d4dc",
      ring: "#2d6a9f",
    },
    /* Titanium industrial aesthetic — deep charcoal, metallic accents */
    logo: {
      light: "/logos/logo-light.svg",
      dark: "/logos/logo-dark.svg",
    },
    favicon: "/favicon.svg",
  },
} as const;

/**
 * Backward-compatible alias to the legacy `SITE_CONFIG` shape.
 *
 * The site is EN-only as of 2026-08-23 (Session 2 of i18n cleanup).
 * Kept so legacy imports of `SITE_CONFIG.defaultLocale` continue to resolve.
 *
 * @deprecated Prefer `siteConfig` and the `Locale` export. The legacy
 *   `SITE_CONFIG.locales` / `.localeLabels` / `.localePrefixes` fields
 *   were dropped during the EN-only conversion.
 */
export const SITE_CONFIG = {
  url: siteConfig.url,
  name: siteConfig.name,
  description: siteConfig.description,
  defaultLocale: DEFAULT_LOCALE,
} as const;

export default siteConfig;
