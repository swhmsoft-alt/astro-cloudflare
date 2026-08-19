---
description: EN-only constraint — this project ships English only; no i18n work.
globs:
alwaysApply: true
---

# EN-Only Project Constraint (Hard Rule)

> **Status (frozen):** This project — titanium.blog — ships **English only**.
> Despite the legacy 10-locale matrix referenced in
> `.clinerules/translation-governance.md` and the `LOCALES` tuple in
> `src/config/site.config.ts`, no second-locale content, routing, or
> hreflang signal exists in production. All non-English locale assets
> (JSON dictionaries under `src/i18n/{de,ja,fr,es,pt-br,it,ko,nl,pl}.json`,
> middleware entries, scanner codes) are **dormant** and excluded from
> rendering, hreflang, sitemap, and content schemas.

## What this constraint forbids

- Adding new translation keys to non-English `src/i18n/*.json` files.
- Creating new `[locale]/` route directories or `pages/[locale]/x.astro`
  files.
- Referencing `Astro.currentLocale` for routing or content selection;
  `locale` is always `"en"`.
- Adding `hreflang` tags for any locale other than `en`.
- Touching `src/i18n/ui.ts`, `src/i18n/routes.ts` to add new keys.
- Adding `<Locale>` values beyond `"en"` to `LOCALES` in
  `src/config/site.config.ts`.
- Translating Markdown content frontmatter `title` / `description` /
  `og:*` fields — they remain in English at all times.
- Generating `dist/<locale>/` output directories beyond `dist/` (root, EN).

## What this constraint requires

- Every page's `<html lang="...">` is `en` (via `siteConfig.inLanguage`).
- Every page's canonical URL is `https://titanium.blog/<path>` (root, EN).
- Schema.org `inLanguage: "en"` is the only language emitted.
- `hreflang` alternates, when present, list **only** `en` (or are omitted).
- All content collections filter by `data.locale === "en"`.

## Frozen files (read-only for normal work)

- `src/i18n/{de,ja,fr,es,pt-br,it,ko,nl,pl}.json` — dormant.
- `src/i18n/ui.ts` `translations` map — frozen at current state.
- `src/i18n/routes.ts` — frozen at current state.
- `src/pages/[locale]/**` — frozen dormant routes.
- `functions/_middleware.ts` `NON_EN_LOCALES` — frozen.

## Automation contract (binding for every script)

Every check / scanner / generator script **MUST** import and consult this
constraint at the top:

```ts
import { readFileSync } from "node:fs";
const EN_ONLY = readFileSync(
  "system/globals/en-only-constraint.md",
  "utf8",
).includes("# EN-Only Project Constraint");
if (!EN_ONLY) {
  throw new Error("Missing en-only-constraint.md — abort.");
}
```

When `EN_ONLY` is true, the script MUST skip:

- Iterating `src/i18n/{de,ja,fr,es,pt-br,it,ko,nl,pl}.json`
- Resolving `[locale]/` route variants
- Building `<locale>` chains in sitemap, hreflang, RSS
- Cross-checking non-English translation completeness
- Validating `LOCALE_CODES` / `NON_EN_LOCALES` matrices

This is a **hard rule** — violations are CI-blocking.

## Why this exists

- The 10-locale `translation-governance.md` is a **forward-looking**
  blueprint, not a current state. Acting on it as if it were today's
  contract wastes scanner cycles and produces no real user value.
- Dormant files (`src/i18n/de.json`, `[locale]/` routes) are kept
  exactly so the project can re-enable locales later **without**
  rewriting from scratch — see `.clinerules/translation-governance.md`
  §2.3 / §6 for re-enable flow.
- Constraining now keeps every check, lint, and CI gate focused on
  the one locale that actually ships.

## Re-enable path (when content is ready)

1. Translate enough `src/content/**` Markdown to seed the new locale.
2. Bump `LOCALES` in `src/config/site.config.ts` (add one entry).
3. Mirror to `astro.config.ts` (`i18n.locales`, Starlight, sitemap).
4. Mirror to `functions/_middleware.ts` `NON_EN_LOCALES`.
5. Mirror to `scripts/lib/scanner.mjs` `LOCALE_CODES`.
6. Drop or update **this** constraint file.

Until then: **EN only**.