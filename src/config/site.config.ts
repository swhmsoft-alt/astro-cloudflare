/**
 * Site configuration — Centralized site settings following Astro Rocket reference
 * This is the single source of truth for all site-wide configuration,
 * including locale routing, content schemas, SEO canonical, OG, sitemap,
 * and Starlight docs. The legacy `src/config/site.config.ts` (now removed)
 * previously duplicated these fields — they are merged here.
 */

/* ────────────────────────────────────────────────────────────────────────── */
/* Locale registry — single source of truth for active languages              */
/* B0: converged from 16 to 10. See `.clinerules/translation-governance.md`.  */
/* ────────────────────────────────────────────────────────────────────────── */

export const LOCALES = [
  "en",
  "de",
  "ja",
  "fr",
  "es",
  "pt-br",
  "it",
  "ko",
  "nl",
  "pl",
] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  ja: "日本語",
  fr: "Français",
  es: "Español",
  "pt-br": "Português (Brasil)",
  it: "Italiano",
  ko: "한국어",
  nl: "Nederlands",
  pl: "Polski",
};

export const LOCALE_PREFIXES: Record<Locale, string> = {
  en: "en",
  de: "de",
  ja: "ja",
  fr: "fr",
  es: "es",
  "pt-br": "pt-br",
  it: "it",
  ko: "ko",
  nl: "nl",
  pl: "pl",
};

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

  /* i18n configuration */
  i18n: {
    enabled: boolean;
    locales: readonly Locale[];
    defaultLocale: Locale;
    routing: { prefixDefaultLocale: boolean };
    localeLabels: Record<Locale, string>;
    localePrefixes: Record<Locale, string>;
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

  /* i18n configuration (single source of truth — see LOCALES above) */
  i18n: {
    enabled: true,
    locales: LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    routing: { prefixDefaultLocale: false },
    localeLabels: LOCALE_LABELS,
    localePrefixes: LOCALE_PREFIXES,
  },
} as const;

/**
 * Backward-compatible alias to the legacy `SITE_CONFIG` shape.
 *
 * Previously exported from `src/config/site.config.ts` (now removed in B0).
 * New code should import `siteConfig` and `Locale` directly from this module.
 *
 * @deprecated Prefer the typed `siteConfig` (with `siteConfig.i18n.*`) and
 *             the `Locale` / `LOCALES` exports. Kept as a thin alias so the
 *             existing imports continue to resolve during the migration.
 */
export const SITE_CONFIG = {
  url: siteConfig.url,
  name: siteConfig.name,
  description: siteConfig.description,
  defaultLocale: siteConfig.i18n.defaultLocale,
  locales: siteConfig.i18n.locales,
  localeLabels: LOCALE_LABELS,
  localePrefixes: LOCALE_PREFIXES,
} as const;

export default siteConfig;
