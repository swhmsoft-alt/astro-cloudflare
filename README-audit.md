# Page Quality Audit Tool

A 5-dimension page-quality auditor for `titanium.blog`. It scores any
rendered HTML page against a 42-item rubric and emits a clean
**BLOCK list** (ship gate) plus a **WARN list** (review next).

The tool is intentionally **post-build / runtime** — it fetches the
already-deployed page, so it audits what users and crawlers actually
see. It is the runtime twin of the content-layer `check-geo.mjs`.

## Mental model

```
PageQuality = (W₁·IG + W₂·EC + W₃·TCG) · E^(W₅·EEAT) · Spatial(VCS)
```

| Dim | What it measures | Weight |
|---|---|---|
| IG | Information Gain — does this page add unique, decision-relevant content beyond the generic top-10? | 0.30 |
| EC | Evidence Cluster — every claim carries a parseable, source-graded citation? | 0.30 |
| TCG | Topical Cluster — is this page a real hub-and-spoke member? | 0.20 |
| VCS | Vector Cluster — does the page cover the right sub-topics for its cluster? | 0.10 |
| EEAT | E-E-A-T — author, dates, organization identity, canonical/hreflang consistency. **Multiplicative trust gate.** | 1.00 (exp) |

## Run the dogfood

```bash
# Single page — titanium-anodizing is the dogfood target.
node scripts/audit/index.mjs audit:page https://titanium.blog/finishes/titanium-anodizing/

# Whole site (when implemented; v0.1 emits "not yet").
node scripts/audit/index.mjs audit:site https://titanium.blog
```

Reports are written to `content/audit/reports/<slug>.json` and
`.md` (gitignored).

Exit codes: `0` = no BLOCK, `1` = at least one BLOCK, `2` = usage
error / network failure.

## KEEP THE GAP — what this tool will *not* do

- **No fabricated standard numbers.** The `standards.whitelist` in
  `config/audit.config.mjs` is empty by design. Citations are read
  from the page itself; we never auto-fill an ASTM/AMS code we have
  not verified.
- **No false-failure on missing frontmatter evidence fields.** When a
  collection's schema does not expose `sourceUrl`, the EC checks
  tolerate its absence (`passed:true, observed:"absent (tolerated)"`).
- **No external embedding API.** The cosine path is gated behind
  `--with-embeddings` and is not yet wired; default mode uses
  chunk-keyword coverage only.
- **No cross-domain redirect acceptance.** HEAD requests on citation
  URLs that return 401/403 are recorded as `ok:false reason:"HTTP 401"`
  — never as INVALID — to avoid false positives on paywalled standards.

## File map

```
config/audit.config.mjs
scripts/audit/
  index.mjs
  lib/
    fetch-rendered.mjs
    dom-tokens.mjs
    frontmatter.mjs
    scoring.mjs
    evidence-resolver.mjs
  checks/
    information-gain.mjs
    evidence-cluster.mjs
    topical-cluster.mjs
    vector-cluster.mjs
    eeat.mjs
  reporters/
    terminal.mjs
    json.mjs
    markdown.mjs
  fixtures/
    locale-codes.mjs
    cluster-graph.mjs
content/audit/.gitignore
```

## Verifying before merging

```bash
pnpm install           # picks up the new cheerio devDep
pnpm build             # regenerates Astro types
pnpm lint              # includes check:kpis
pnpm run check:geo     # existing content-layer GEO gate
node scripts/audit/index.mjs audit:page https://titanium.blog/finishes/titanium-anodizing/
```
