/**
 * Site configuration — Centralized site settings following Astro Rocket reference
 * This is the source of truth for all site-wide configuration
 * It mirrors current SITE_CONFIG but with additional fields for future enhancements
 */

/** Site configuration interface */
export interface SiteConfig {
  /* Core site metadata */
  url: string;
  name: string;
  description: string;
  author: string;
  email: string;
  authorImage?: string;

  /* Social media and contact links */
  socialLinks: Array<{
    platform: string;
    url: string;
    icon?: string;
    label?: string;
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
    locales: string[];
    defaultLocale: string;
    routing: { prefixDefaultLocale: boolean };
  };
}

export const siteConfig: SiteConfig = {
  /* Core configuration — single source of truth for canonical/OG/sitemap/llms.txt. */
  url: "https://titanium.blog",
  name: "titanium.blog",
  description:
    "The global knowledge hub for titanium manufacturing. Expert guides on titanium grades, CNC machining, 5-axis milling, turning, wire EDM, additive manufacturing, and industry applications.",
  author: "Titanium Blog Team",
  email: "hello@titanium.blog",
  authorImage: "/images/author.jpg",

  /* Social links */
  socialLinks: [
    {
      platform: "linkedin",
      url: "https://linkedin.com/company/titanium-blog",
      label: "LinkedIn",
    },
    { platform: "email", url: "mailto:hello@titanium.blog", label: "Email" },
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

  /* i18n configuration (matches i18n.config.ts) */
  i18n: {
    enabled: true,
    locales: ["en", "de", "ja", "fr", "es", "pt", "it", "ko", "nl", "pl", "ru", "ar", "pt-br", "tr", "cs", "sv"],
    defaultLocale: "en",
    routing: { prefixDefaultLocale: false },
  },
} as const;

export default siteConfig;
