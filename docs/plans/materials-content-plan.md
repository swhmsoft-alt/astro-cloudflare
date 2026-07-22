# Materials Content Authoring Plan

## Purpose

Standardise how AI-generated titanium material grade content is authored so that every page uses the existing design system, layout components, and content collection infrastructure — without creating parallel components, custom styles, or duplicate pages.

## Architecture Overview (do not alter)

The materials content pipeline is fully built and requires **no new components, routes, or styles**:

| Layer | Existing component / file | Responsibility |
|---|---|---|
| Content collection | `src/content.core.materials` (schema in `content.config.ts`) | Structured Frontmatter + Markdown body |
| Page route | `src/pages.knowledge.materials.[slug].astro` (+ `[locale]` variant) | Dynamic rendering for all material slugs |
| Layout | `_EntityDetail.astro` component | SEO, JSON-LD, badges, properties table, related entities, `<slot>` for body |
| Prose styling | Tailwind `prose prose-gray dark:prose-invert` (via `Prose` component) | Typography, spacing, dark mode for rich text |
| Design tokens | `src/styles.tokens.{colors,typography,spacing}.css` | All colors, fonts, spacing via OKLCH CSS vars |

## Authoring Workflow

### Step 1 — Create a new Markdown file

Location: `src/content.core.materials.{grade-slug}.md`

The filename slug becomes the URL path (e.g. `ti-gr23.md` → `/knowledge.materials/ti-gr23/`).

### Step 2 — Write Frontmatter (structured data)

The schema is defined in the `materials` collection inside `content.config.ts`. Key fields:

- **title** (string, required) — Display name, e.g. "Ti-6Al-4V ELI (Grade 23) Titanium"
- **description** (string, required) — Meta description for SEO, 120–160 characters
- **locale** (enum, required) — Currently "en" for English
- **grade** (string, optional) — e.g. "Grade 23"
- **alloy** (string, optional) — e.g. "Ti-6Al-4V ELI"
- **standards** (array of strings, optional) — e.g. ["ASTM F136", "ASTM B348"]
- **industries** (array of strings, optional) — e.g. ["aerospace", "medical"]
- **processes** (array of strings, optional) — e.g. ["cnc-machining", "milling"]
- **finishes** (array of strings, optional) — e.g. ["passivation", "polishing"]
- **certifications** (array of strings, optional) — e.g. ["AS9100D", "ISO 13485"]
- **properties** (key-value object, optional) — e.g. `density: "4.43 g/cm³"`, `tensileStrength: "950 MPa"`. The layout auto-renders these as a spec table.
- **order** (number, default 0) — Sort order in index pages

Do not add fields beyond what the schema defines. Every field in `properties` is rendered in a spec table near the top of the page; do not duplicate these values as a body table.

### Step 3 — Write Markdown body

Constraints:

- Use only `##` (H2) and `###` (H3) heading levels. The page H1 is rendered by the layout component.
- No inline HTML, no inline styles, no custom CSS classes.
- Standard Markdown only: paragraphs, lists (ordered/ unordered), tables, bold/ italic.
- Do not wrap content in any component or div — the layout handles styling.
- Do not include Frontmatter-available data (properties, standards, industries) as body tables; that duplicates the auto-rendered spec table.

Recommended section order (sections may be omitted but not reordered):

1. `## Overview` — Material description, key characteristics, why it matters
2. `## Chemical Composition` — Alloying elements with weight percentages
3. `## Mechanical Properties` — Narrative description of strength, hardness, elongation. Numerical data goes in Frontmatter `properties`.
4. `## Machining Characteristics` — Feed speeds, tooling recommendations, challenges (key for machining-service positioning)
5. `## Typical Applications` — Industry-specific use cases in list form
6. `## Certifications & Standards` — Reference standards bodies and specs
7. `## FAQ` — Common buyer and engineer questions in Q&A format

### Step 4 — Verify render

After adding the `.md` file:

1. The existing `getStaticPaths` in `[slug].astro` automatically picks up the new file.
2. The page renders under `/knowledge/materials/{slug}/` (English) and will have dark-mode-aware prose styling.
3. The `_EntityDetail` component renders the header, badges, properties table, body content, and related entities.

## Prose Usage (for non-collection pages)

When writing body content directly inside an `.astro` page template (not in content collections), wrap all text content with either:

- The `<Prose>` component (imported from `src.components.ui.content.Prose.Prose.astro`), which accepts `as` (div/section/article) and `size` (sm/md/lg) props
- Or a container div with `class="prose prose-gray dark:prose-invert max-w-none"`

The `<Prose>` component is the preferred approach as it also integrates with any future component updates.

## Reference: Existing Material Files

Existing files in `src.content.core.materials` serve as canonical examples. When authoring a new grade, reference:

- `grade-5-titanium-ti6al4v.md` — most comprehensive example with full Frontmatter and body structure
- `grade-2-titanium.md` — simpler example with fewer sections

Both demonstrate the correct Frontmatter field usage, body section order, and the separation between structured data (Frontmatter) and narrative content (body).

## Validation Checklist

Before finishing a materials content task:

- [ ] File is in `src.content.core.materials/` (not elsewhere)
- [ ] No new `.astro` files created
- [ ] No new CSS classes or inline styles added
- [ ] All structured data is in Frontmatter, not duplicated in body
- [ ] Body uses only `##` and `###` headings (no `#`)
- [ ] No custom Frontmatter fields beyond the schema
- [ ] `pnpm build` passes without errors
