---
translationKey: seo-guide
locale: en
title: Optimizing SEO for Multilingual Websites
description: Technical SEO best practices for sites with multiple languages.
publishDate: 2026-06-22
draft: false
tags:
  - seo
  - i18n
  - performance
author: Admin
---

## Why SEO Matters for Multilingual Sites

Search engines need clear signals about language and regional targeting. A well-structured multilingual site can rank in multiple countries simultaneously.

## Hreflang Tags

Hreflang tells Google which language version of a page to show:

```html
<link rel="alternate" hreflang="en" href="https://example.com/en/about" />
<link rel="alternate" hreflang="id" href="https://example.com/id/about" />
<link rel="alternate" hreflang="x-default" href="https://example.com/about" />
```

This starter includes automatic hreflang generation via the `hreflangLinks()` function in `src/lib/seo.ts`.

## Canonical URLs

Every page should have a self-referencing canonical URL.

**Hard rule (matches Astro's `trailingSlash: 'always'`):** page URLs must end
with a trailing slash so the canonical / `og:url` / hreflang / breadcrumb /
JSON-LD values are byte-identical to the real rendered URL — never strip the
slash. File/API/asset paths (`.js`, `.css`, `.txt`, `.xml`, `.json`, OG-image
endpoints, …) are excluded and must NOT get a trailing slash.

```typescript
export function canonicalUrl(locale: Locale, path: string): string {
  const prefix = localePrefix(locale);
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const finalPath = isFileLikePath(normalized)
    ? normalized
    : ensureTrailingSlash(normalized);
  return `${SITE_CONFIG.url}${prefix}${finalPath}`;
}
```

## Structured Data (JSON-LD)

Use `jsonLdWebSite()` for the home page and `jsonLdBlogPost()` for articles:

```typescript
const websiteJsonLd = jsonLdWebSite({
  title: "My Site",
  description: "Site description",
  locale: "en",
  url: "https://example.com",
});
```

## Sitemap

The `@astrojs/sitemap` integration generates a sitemap-index.xml that includes all locale variants of every page, ensuring search engines discover all language versions.

## Performance Considerations

- **Static generation**: Pages are pre-built, ensuring fast load times
- **CDN delivery**: Cloudflare's global network caches content at the edge
- **Core Web Vitals**: Astro's zero-JS architecture helps achieve good scores
