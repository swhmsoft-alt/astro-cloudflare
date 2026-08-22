---
description: W₀ Content Density SLA — word counts, structural floors, and engineering-density thresholds per content type. Authoritative for content-density.mjs (CD-1..CD-10).
globs:
  - src/content/**/*.md
  - src/content/**/*.mdx
alwaysApply: true
---

# Content Density SLA — W₀

This file is the **single source of truth** for content density. The
audit tool's CD-1…CD-10 checks consume it via `scripts/audit/lib/source-md.mjs`
(token extraction) and `scripts/audit/checks/content-density.mjs` (check
thresholds). If the numbers here change, both files must change in the
same commit.

## Why W₀ exists

The other four audit dimensions (W₁ Information Gain, W₂ Evidence
Cluster, W₃ Topical Cluster, W₄ Vector Cluster) all read **rendered
DOM**. They cannot detect a thin source MD that the renderer then
decorates with sidebars, related-content panels, and footers — the
38-word `titanium-anodizing.md` looks healthy to IG/EC/TCG/VCS but is
a content hole. W₀ audits the **source MD directly** so this failure
mode is visible to the audit gate.

## Per-collection floors

| Collection             | Type | CD-1 (words) | CD-2 (spine floor) | CD-3 (paragraphs) | CD-4 (H2) | CD-7 (numeric+unit) |
|------------------------|------|---:|---:|---:|---:|---:|
| `materials`            | spine | 600 | **1500** | 5 | 3 | 5 |
| `processes`            | spine | 600 | **1500** | 5 | 3 | 5 |
| `industries`           | spine | 600 | **1500** | 5 | 3 | 5 |
| `standards`            | spine | 600 | **1500** | 5 | 3 | 5 |
| `surfaceFinishes`      | spoke | 600 | — | 5 | 3 | 5 |
| `evidence`             | spoke | 600 | — | 5 | 3 | 3 |
| `procurement`          | spoke | 600 | — | 5 | 3 | 5 |
| `applications`         | spoke | 600 | — | 5 | 3 | 3 |
| `cases`                | spoke | 600 | — | 5 | 3 | 3 |
| `equipment`            | spoke | 600 | — | 5 | 3 | 5 |
| `materialSelection`    | spoke | 600 | — | 5 | 3 | 5 |
| `failureAnalysis`      | spoke | 600 | — | 5 | 3 | 5 |
| `heatTreatment`        | spoke | 600 | — | 5 | 3 | 5 |
| `corrosion`            | spoke | 600 | — | 5 | 3 | 5 |
| `blog`                 | post  | 800 | — | 6 | 4 | 0 (blog exempt) |
| `docs`                 | doc   | 400 | — | 4 | 2 | 0 (docs exempt) |

Spine collections are the **hub-and-spoke hubs**. They are entry
points for the topical cluster and therefore carry the highest
density obligation. Spokes inherit CD-1 (600 words) so the cluster
stays coherent, but they are not required to reach 1500 words — the
spine already has that depth.

Blog posts and Starlight docs are exempt from CD-7 because their
primary value is editorial narrative, not engineering numbers.

## Per-check thresholds

The check IDs below map 1:1 to `scripts/audit/checks/content-density.mjs`.

| ID    | Severity | Floor | What it catches |
|-------|----------|-------|-----------------|
| CD-1  | BLOCK    | ≥ 600 words | Generic stub (e.g. `titanium-anodizing.md` 38 words) |
| CD-2  | BLOCK    | ≥ 1500 words (spine only) | Thin spine that breaks the hub role |
| CD-3  | BLOCK    | ≥ 5 paragraphs | Wall-of-text or bullet-only content |
| CD-4  | BLOCK    | ≥ 3 H2 sections | One-block pages with no structure |
| CD-5  | WARN     | ≥ 1 table | Pure prose, no scannable data |
| CD-6  | WARN     | ≥ 1 list | Hard-to-scan content |
| CD-7  | BLOCK    | ≥ 5 numeric-with-unit values | Marketing fluff without engineering evidence |
| CD-8  | WARN     | ≥ 1 external citation pattern | Uncited claims (KEEP_THE_GAP compatible) |
| CD-9  | WARN     | avg 10–25 words/sentence | Wall-of-text (long) or telegraphic (short) prose |
| CD-10 | BLOCK    | source MD exists and is non-empty | Missing collection map → CD-10 fails |

## Skipped / passed-by-default cases

`source-md.mjs` returns `null` when the URL does not map to a known
collection (e.g. blog posts, docs). In that case every CD check
returns `passed: true` with `observed: "skipped: …"`. CD cannot run
without a source, so silence is the correct response — not a BLOCK.

## Stub policy (≤ 200 words)

Files with `wordCount < 200` are surfaced in the density matrix as
**stub files**. They are NOT auto-failed by the audit (CD-1 floors at
600) but they MUST:

1. Be flagged for content production in the next sprint.
2. Either grow to CD-1 floor before launch, OR be hidden from the
   sitemap (`draft: true` in frontmatter) until they reach the floor.
3. Never ship as part of an evidence cluster, since the cluster graph
   requires source richness on every node.

## How to enforce

Three layers, in increasing strictness:

1. **Local check** (developer machine):
   `pnpm audit:density-matrix` — prints the full matrix; exits 1 with
   `--fail` if any spine < 1500 words or any collection < 80% pass CD-1.
2. **Pre-commit** (optional):
   The same script can be wired into a husky/lint-staged hook.
3. **CI gate**:
   `pnpm lint` already runs `check:kpis`. Add `audit:density-matrix --fail`
   to the lint chain via `package.json` so it blocks deploys on
   regression.

## Why these numbers

- **600 words** for spokes: long enough to cover a process / material
  with one engineering table, one comparison list, one numeric table,
  and 3 sub-topics (≈ 3 × 200 words). Below 600, the page is a card,
  not a spoke.
- **1500 words** for spines: long enough to host 3 H2 sections of
  ~500 words each with sub-headings and a comparison table. Below
  1500, the spine cannot answer cluster-level questions.
- **5 numeric-with-unit** (CD-7): engineering content without numbers
  is opinion. The 5-value floor catches pages that quote one range
  and call it done.
- **avg 10–25 words/sentence** (CD-9): readability sweet spot. Below
  10 reads like a spec sheet; above 25 reads like legal prose.

## Related

- `scripts/audit/checks/content-density.mjs` — check definitions
- `scripts/audit/lib/source-md.mjs` — source extractor
- `scripts/audit/lib/density-matrix.mjs` — cross-collection scanner
- `system/templates/STUB_TEMPLATE.md` — minimum stub structure
- `.clinerules/audit-tool.md` — broader audit governance
- `.clinerules/translation-governance.md` — locale rules (apply to density too)