---
title: Internationalization
description: Multilanguage-ready i18n engine and how to add new locales.
sidebar:
  order: 2
---

The site ships **English + 9 prefixed locales** (`de`, `ja`, `fr`, `es`,
`pt-br`, `it`, `ko`, `nl`, `pl`). The default locale is **English** and is
served at the root with no prefix; the other nine are served under
`/<locale>/...`. The full locale matrix and translation rules are governed
by `.clinerules/translation-governance.md`.

## How It Works

The i18n system is built on three layers:

1. **Astro's built-in i18n** — locale routing configured in `astro.config.ts`
   (`i18n.defaultLocale`, `i18n.locales`, `routing.fallbackType: "redirect"`).
2. **Content collection locale fields** — each content entry declares its
   `locale` (validated by `src/content.config.ts`).
3. **Translation files** — UI strings live in `src/i18n/<locale>.json` and are
   loaded by `src/i18n/ui.ts`.

The **single source of truth** for the active locale set is the `LOCALES`
constant in `src/config/site.config.ts`. It is mirrored into:

- `src/config/site.config.ts` → `siteConfig.i18n.locales`
- `astro.config.ts` → `i18n.locales`, the Starlight `locales` map, and the
  `sitemap({ i18n: { locales } })` map.
- `src/content.config.ts` → the `localeSchema` zod enum.
- `functions/_middleware.ts` → `NON_EN_LOCALES`.
- `scripts/lib/scanner.mjs` → `LOCALE_CODES` (file-name suffix regex).

## Active Locale Matrix

| Code | Label | URL prefix | UI JSON | Content locale |
|---|---|---|---|---|
| `en` | English | *(root)* | `en.json` | `en` |
| `de` | Deutsch | `/de/` | `de.json` | `de` |
| `ja` | 日本語 | `/ja/` | `ja.json` | `ja` |
| `fr` | Français | `/fr/` | `fr.json` | `fr` |
| `es` | Español | `/es/` | `es.json` | `es` |
| `pt-br` | Português (Brasil) | `/pt-br/` | `pt-br.json` | `pt-br` |
| `it` | Italiano | `/it/` | `it.json` | `it` |
| `ko` | 한국어 | `/ko/` | `ko.json` | `ko` |
| `nl` | Nederlands | `/nl/` | `nl.json` | `nl` |
| `pl` | Polski | `/pl/` | `pl.json` | `pl` |

## UI Translations

UI strings live in `src/i18n/en.json` and are read through the `t()` helper:

```astro
---
import { t } from "../i18n/ui";
const locale = (Astro.currentLocale || "en") as "en";
---
<p>{t(locale, "nav.home")}</p>
```

`t()` falls back to the key itself when a string is missing, so dev builds fail
loudly when a translation is absent.

## Adding a New Locale

> **Heads up:** adding a new locale changes the site-wide SEO footprint and
> requires updating every site listed in the "Single source of truth" section
> above. Follow `.clinerules/translation-governance.md` (section "Onboarding
> a new locale") and run `pnpm build` + `pnpm lint` afterwards.

1. **Widen the `LOCALES` tuple** in `src/config/site.config.ts` and add the
   corresponding entries to `LOCALE_LABELS` / `LOCALE_PREFIXES`:

   ```typescript
   export const LOCALES = [
     "en", "de", "ja", "fr", "es", "pt-br", "it", "ko", "nl", "pl", "id",
   ] as const;

   export const LOCALE_LABELS: Record<Locale, string> = {
     // …
     id: "Bahasa Indonesia",
   };

   export const LOCALE_PREFIXES: Record<Locale, string> = {
     // …
     id: "id",
   };
   ```

   The `Locale` type, `DEFAULT_LOCALE`, and `siteConfig.i18n` all derive
   from `LOCALES` — you only need to edit this one file.

2. **Mirror the locale list** into `astro.config.ts` (`i18n.locales`, the
   Starlight `locales` map, and `sitemap({ i18n: { locales } })`),
   `src/content.config.ts` (`localeSchema`), `functions/_middleware.ts`
   (`NON_EN_LOCALES`), and `scripts/lib/scanner.mjs` (`LOCALE_CODES`).

3. **Add a translations file** `src/i18n/id.json` and register it in
   `src/i18n/ui.ts`:

   ```typescript
   import id from "./id.json";
   export const translations = { /* …, */ id };
   ```

4. **Add localized content** by setting the `locale` frontmatter on a copy
   of each entry (e.g. `about.md` for `en`, `about.id.md` for `id`). Keep the
   existing suffix-naming convention until B3 migrates to locale subdirectories.

5. **Add prefixed routes** under `src/pages/[locale]/` for the non-default
   locales (the default locale is served at the root with no prefix).

Once the locale is registered, the header language switcher shows it
automatically.
