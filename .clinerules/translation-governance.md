---
description: Translation governance for the multi-language content pipeline.
globs:
  - src/i18n/**/*
  - src/content/**/*
  - src/pages/[locale]/**/*
  - functions/_middleware.ts
  - astro.config.ts
  - src/config/site.config.ts
  - src/config/i18n.config.ts
  - src/content.config.ts
  - scripts/lib/scanner.mjs
alwaysApply: true
---

> ## 🚨 HARD RULE — Site runtime is EN-only (locked 2026-08-22)
> 
> **The site runs EN-only at runtime.** Every 10-locale declaration below
> (`LOCALES` in `src/config/site.config.ts`, `i18n.locales` in `astro.config.ts`,
> dormant `src/i18n/{ar,cs,ru,sv,tr,vi}.json`, `src/pages/[locale]/` route
> skeleton, `_EntityPillar.astro` `enOnlyModules`, Starlight `locales` map,
> sitemap `i18n.locales`) is an **inert forward-compatibility declaration** —
> NOT an active translation surface. See `__session_handoff.md` ("i18n
> discussion is closed · No code changes · Architecture prevents i18n
> revival structurally").
> 
> **DO NOT** (in any session, unless the user explicitly requests
> re-enablement by referencing this rule and `__session_handoff.md`):
> 
> 1. Create files under `src/pages/[locale]/` (the directory is a skeleton
>    only; no `x.astro` files should be added there).
> 2. Add sibling `*.de.md` / `*.ja.md` / `*.fr.md` / `*.es.md` / `*.pt-br.md`
>    / `*.it.md` / `*.ko.md` / `*.nl.md` / `*.pl.md` translations inside
>    `src/content/**`. Sibling translations DO NOT activate; they create
>    schema orphan files.
> 3. Translate or refresh `src/i18n/*.json` non-`en` files (the 6 dormant
>    JSONs are intentional; do not activate them).
> 4. Modify `functions/_middleware.ts` away from its current pass-through
>    state — its only job is to keep the Cloudflare Functions build slot
>    stable.
> 5. Widen `hreflang` beyond the existing en-only modules
>    (`evidence`, `procurement`, `applications`, `cases`, `surfaceFinishes`).
>    All other modules must stay as-is or be added to `enOnlyModules` first.
>    The authoritative list lives in
>    `config/audit.config.mjs → locales.enOnlyCollections`; the renderer
>    mirror is `src/pages/_shared/_EntityPillar.astro → enOnlyModules`.
> 6. Register `Organization.sameAs` Wikidata/Wikipedia/GitHub/Crunchbase
>    links in `src/config/site.config.ts` that imply a multilingual brand
>    presence (LinkedIn is fine; authority-graph nodes for non-existent
>    locales are not).
> 7. Run `pnpm translate` for non-`en` targets — that pipeline is dormant.
> 
> **Reason**: sitemap.xml + hreflang would emit 9/10 non-existent locale
> URLs per page. Google treats this as **declarative multilingual thin-content
> spam** and demotes the entire site. The user has confirmed (session
> 2026-08-22) that **i18n is closed**.
> 
> **Pre-deploy verification**: spot-check `dist/sitemap-*.xml` and
> `dist/<page>/index.html` `<head>` `<link rel="alternate" hreflang="…">`
> blocks. Any hreflang pointing to a path that does not exist as a rendered
> page is a regression.
> 
> **Re-enabling i18n** is a deliberate, breaking SEO change. It requires
> the user to override this rule explicitly and to seed real content for
> every added locale before `pnpm build` is run.

# Translation Governance — titanium.blog
# Translation Governance — titanium.blog

This rule freezes the **translational surface area** of the site. It binds
Cline and every contributor to a single, auditable locale matrix and a
strict **incremental** translation workflow.

It pairs with `.clinerules/architecture.md`, `.clinerules/astro-core.md`,
and `.clinerules/geo-foundation.md`.

---

## 1. Active Locale Matrix (Single Source of Truth)

The site ships **10 locales**. The matrix below is the only contract that
matters — every other file must be derived from it.

| Code     | Label                  | URL prefix | UI JSON      | Content locale |
|----------|------------------------|------------|--------------|----------------|
| `en`     | English                | *(root)*   | `en.json`    | `en`           |
| `de`     | Deutsch                | `/de/`     | `de.json`    | `de`           |
| `ja`     | 日本語                 | `/ja/`     | `ja.json`    | `ja`           |
| `fr`     | Français               | `/fr/`     | `fr.json`    | `fr`           |
| `es`     | Español                | `/es/`     | `es.json`    | `es`           |
| `pt-br`  | Português (Brasil)     | `/pt-br/`  | `pt-br.json` | `pt-br`        |
| `it`     | Italiano               | `/it/`     | `it.json`    | `it`           |
| `ko`     | 한국어                  | `/ko/`     | `ko.json`    | `ko`           |
| `nl`     | Nederlands             | `/nl/`     | `nl.json`    | `nl`           |
| `pl`     | Polski                 | `/pl/`     | `pl.json`    | `pl`           |

### Why these ten

| Locale   | GEO rationale (locked)                                                                                  |
|----------|----------------------------------------------------------------------------------------------------------|
| `en`     | Default. Hosts all canonical content for English-speaking engineering markets.                          |
| `de`     | DACH industrial market (DIN/EN standards; high search volume for *Werkstoffnummer* queries).            |
| `ja`     | JIS standards + Japanese titanium supply chain (JIS H 4650, H 4670).                                       |
| `fr`     | Aerospace (Safran, Airbus) + EU metallurgy.                                                              |
| `es`     | Iberian/LATAM base language; bridge to `pt-br`.                                                           |
| `pt-br`  | Brazilian aerospace/industrial (Embraer; ISO 9001-heavy). **Consolidates `pt` here** — the Brazilian industrial market is ~200× the Portuguese market, so a separate `pt` would dilute crawl budget without serving real demand. |
| `it`     | Italian luxury/aerospace (Avio Aero, Leonardo) + EU standards.                                            |
| `ko`     | Korean semiconductor / industrial equipment.                                                             |
| `nl`     | Benelux industrial / port engineering (Rotterdam, Antwerp).                                              |
| `pl`     | EU manufacturing hub + EN 10204 / EN 485 standards queries.                                              |

**Removed from the 16-locale legacy set** (kept as dormant JSON in
`src/i18n/{ar,cs,ru,sv,tr,vi}.json` for future re-enablement, but excluded
from routing, sitemap, hreflang, and content schemas):

| Locale   | Removal reason                                                                                          |
|----------|----------------------------------------------------------------------------------------------------------|
| `vi`     | No first-party content; no in-region demand signal.                                                     |
| `ar`     | RTL complexity + zero source content; re-enable when Arabic content is on the roadmap.                  |
| `sv`     | Nordic covered by `en`; standalone Nordic industrial signal is weak.                                    |
| `tr`     | No Turkish content + low query volume for titanium metallurgy in Turkish.                               |
| `ru`     | Sanctions / CDN reachability; also no source content. Re-enable when Russian content exists.            |
| `cs`     | Czech industrial queries are typically served via `de` or `en`; no source content.                       |

---

## 2. Single Source of Truth & Mirrors

### 2.1 Canonical file

`src/config/site.config.ts` exports the typed tuple:

```ts
export const LOCALES = ["en","de","ja","fr","es","pt-br","it","ko","nl","pl"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_LABELS: Record<Locale, string> = { /* … */ };
export const LOCALE_PREFIXES: Record<Locale, string> = { /* … */ };
```

`siteConfig.i18n` is derived from these exports — never the other way
around. The deprecated `SITE_CONFIG` alias is kept for one migration cycle
and **must not** be referenced by new code.

### 2.2 Required mirror sites

When the matrix changes, **all** of the following must update in the same
commit (use the order below to keep diffs reviewable):

1. `src/config/site.config.ts` — `LOCALES`, `LOCALE_LABELS`, `LOCALE_PREFIXES`.
2. `src/config/i18n.config.ts` — `i18nConfig.locales` (currently a hand-maintained mirror; safe to delete in a later cleanup pass).
3. `astro.config.ts` — `i18n.locales`, Starlight `locales` map, `sitemap({ i18n: { locales } })`.
4. `src/content.config.ts` — `localeSchema` enum.
5. `functions/_middleware.ts` — `NON_EN_LOCALES` set (non-English members only).
6. `scripts/lib/scanner.mjs` — `LOCALE_CODES` set.
7. `scripts/run-build-check.mjs` — locale chain in the per-file classification block.

The schema files under `.astro/collections/*.schema.json` are generated
artifacts and **must not** be hand-edited — re-run `pnpm build` and they
will pick up the new enum.

### 2.3 Drift check

Run before every commit:

```bash
pnpm build       # regenerates .astro/collections/*.schema.json
pnpm lint        # includes check:kpis, which fails on hardcoded color / token drift
```

`check:kpis` does **not** yet check locale-list drift between mirrors —
keep the matrix small enough that eyeball diffing is reliable.

---

## 3. Incremental Translation Workflow (Hard Rule)

When translating or localizing **any** content file (Markdown, MDX, JSON,
or UI dictionary):

1. **Diff first.** Compare the source file (`en`) against the target
   language file. Identify only the keys, frontmatter fields, or
   paragraphs that are:
   - missing in the target,
   - empty / placeholder in the target, or
   - present in the source but untranslated.
2. **Translate only those deltas.** Never overwrite, restyle, or rewrite
   existing translations — preserve the original author's voice, term
   choices, and formatting.
3. **Inject, don't rewrite.** Add new entries to JSON files in the
   **original schema order**. Add new frontmatter fields in the same
   position as in the source. Append new sections / paragraphs after the
   existing body unless the source itself reorders them.
4. **One language per session.** Do not batch-translate multiple target
   languages in a single Cline turn. After each language, stop and emit a
   short "translation audit" (section 6) and wait for explicit
   confirmation before moving to the next.
5. **No machine-translation pass without a human review gate.** Every
   pass must end with a `pnpm build` + `pnpm lint` and a human-readable
   diff summary; never merge unverified LLM output into the canonical
   tree.

### 3.1 Forbidden patterns

- "From scratch" rewrites of any target file.
- Reordering JSON keys to match a generator's alphabetical sort.
- Renaming slug tokens (`about.md` → `about.en.md`) — keep the
  `<slug>-<locale>.md` suffix convention (see B3 for the planned
  subdirectory migration).
- Translating system placeholders (section 4).
- Translating image paths, canonical URLs, or anchor IDs (section 5).

---

## 4. Placeholder & Token Whitelist

These tokens **must not** be translated, transliterated, or rearranged.
They are parsed by routing, search, and analytics code; any change will
break the build.

| Pattern                       | Meaning                                            |
|-------------------------------|----------------------------------------------------|
| `{count}`, `{total}`, `{n}`   | Numeric interpolations from `t()` callers.         |
| `{name}`, `{email}`, `{date}` | User-supplied values.                              |
| `<astro-island>` / `<script>` | Astro runtime markers.                             |
| `{` / `}` braces in JSON      | Structural — never modify.                          |
| `<!-- … -->` HTML comments    | Used by content validators.                         |
| `[lang]` / `[locale]`         | Placeholders in doc snippets — keep verbatim.       |

When a translation introduces a new placeholder, **document it inline**:

```md
<!-- i18n-token: {readingMinutes} -->
You need about {readingMinutes} minutes to read this guide.
```

---

## 5. SEO & Asset Invariants

Translating a `.astro` page or `.md/.mdx` content entry **must** keep the
following invariant across all locales:

- `title` / `description` / `og:title` / `og:description`: translate the
  *meaning*, preserve the *length budget* (≤ 60 / ≤ 160 chars where the
  source is under that budget).
- `canonical`: never translate. The canonical URL is always the English
  root (`/path/`) — non-English variants get `<link rel="alternate"
  hreflang="<locale>" …>` pointing back, never `canonical`.
- `hreflang` codes: use the **BCP 47** codes from
  `astro.config.ts → sitemap({ i18n: { locales } })` (`en-US`, `de-DE`,
  `pt-BR`, etc.) — do **not** invent new region codes.
- Image paths (`/assets/...`, `/images/...`): identical across locales.
  If a translated page needs a region-specific image, add it as a
  **new** asset under `/images/<locale>/…` and reference it explicitly —
  do not overwrite the English asset.
- Anchor IDs (`#material-grades`, `#typical-components`): identical
  across locales. Translated headings keep the same `id` as their
  English counterparts so cross-locale in-page links do not 404.
- llms.txt / sitemap / RSS: regenerated from the active locale set on
  every build; never hand-edit the generated output.

---

## 6. Onboarding a New Locale

This is a **breaking** change for the SEO footprint — treat it as a
deliberate, reviewable operation, not a one-liner.

1. **GEO + content justification** before touching code:
   - Confirm the target market has an in-region demand signal (search
     volume, distributor inquiries, or planned content).
   - Confirm at least one translator or native reviewer is committed to
     validating the output of the machine pass.
2. **Add to `LOCALES`** in `src/config/site.config.ts` (and the
   `LOCALE_LABELS` / `LOCALE_PREFIXES` records).
3. **Update every mirror** listed in §2.2 in the same commit.
4. **Bootstrap the UI dictionary**: copy `src/i18n/en.json` to
   `src/i18n/<new>.json` and translate — register the import in
   `src/i18n/ui.ts` (`translations` map).
5. **Add the locale to `astro.config.ts`**:
   - `i18n.locales` (so Astro emits `Astro.currentLocale` correctly).
   - Starlight `locales` map (only if the locale is enabled in docs).
   - `sitemap({ i18n: { locales } })` (BCP 47 code).
6. **Extend `functions/_middleware.ts`** `NON_EN_LOCALES`.
7. **Mirror in `scripts/lib/scanner.mjs`** `LOCALE_CODES` and
   `scripts/run-build-check.mjs` locale chain.
8. **Pre-translate content** following §3 — incremental only, never a
   full rewrite of an existing entry.
9. **Verify** with `pnpm build` + `pnpm lint`. Spot-check
   `dist/sitemap-*.xml`, one `<link rel="alternate" hreflang="…">` head
   per locale, and one 404/302 fallback path through
   `functions/_middleware.ts`.

Removing a locale is the inverse flow — keep the JSON file around as
dormant so re-enabling in step 2 is one line.

---

## 7. Translation Audit (Required Output Format)

After each translation pass, emit a short, terminal-friendly summary:

```
🌐 Translation audit — <locale>
   Source file : <path/to/source>
   Target file : <path/to/target>
   Added keys  : <count>
   Updated keys: <count>            (only if explicitly fixing existing entries)
   New sections: <count>
   System tokens preserved: yes/no
   SEO meta translated   : yes/no
   Build   : PASSED / FAILED
   Lint    : PASSED / FAILED
   KPIs    : PASSED / FAILED
   Status  : FROZEN (waiting for user confirmation)
```

After emitting the audit, **stop and wait**. Do not proceed to the next
locale, file, or refinement without explicit user authorization.

---

## 8. Forbidden Patterns (Hard Fail)

Any of the following are CI-blocking. Reject the diff.

- Hardcoding a locale code (`"de"`, `"pt-br"`) anywhere outside the
  canonical mirror sites (§2.2) or the dormant JSON dictionaries.
- Adding a locale to **any** mirror without updating **all** mirrors.
- Translating `src/lib/site-config.ts` — the file does not exist
  post-B0. Any reference to it is a regression.
- Editing `.astro/collections/*.schema.json` by hand — these are
  generated artifacts.
- Reordering JSON keys to "improve readability" — diff-only edits,
  always.
- A "translate everything" or "fix all missing translations" pass
  without an explicit user authorization per language.

---

## 9. Relationship to Other Rules

- **`.clinerules/architecture.md`** — the three-tier
  (Components → Sections → Pages) model applies unchanged; translations
  are an orthogonal concern handled at the page and section level.
- **`.clinerules/astro-core.md`** — all `getCollection()` reads stay
  filter-by-locale; manual `fs` reads of `src/content/` remain forbidden.
- **`.clinerules/geo-foundation.md`** — every translated page must
  preserve the Evidence Basis / Engineering Interpretation separation;
  the source-of-fact citation must remain in English even when the
  surrounding text is localized.
- **`.clinerules/design-system.md`** — translated UI strings must use
  the same semantic tokens (`bg-primary`, `text-foreground`,
  `var(--muted-foreground)`); never hardcode colors per locale.