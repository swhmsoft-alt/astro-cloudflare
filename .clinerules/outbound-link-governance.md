---
description: Outbound & cross-site link governance for titanium.blog → cnctitanium.com
globs: **
alwaysApply: true
---

# Outbound & Cross-Site Link Governance

Hard rules for generating, editing, or auditing HTML/Markdown/content with outbound
links between `titanium.blog` (editorial, ToFu) and `cnctitanium.com` (money/conversion
site). Enforce Google Quality Guidelines, Link Spam Policies, and E-E-A-T.

**Implementation requirement:** every outbound cross-site link MUST go through the
`OutboundLink` component (`src/components/ui/primitives/OutboundLink/OutboundLink.astro`).
Never hand-write `<a target="_blank">` / `rel="..."` for outbound links; the component
resolves `rel`/`target` from the `relationship` enum in `src/lib/linkPolicy.ts`.

## 1. Cross-Site Linking Matrix

### 1.1 One-way links (titanium.blog ──[Dofollow/Contextual]──> cnctitanium.com)
- **Default operation model:** blog = ToFu content/traffic engine; cnctitanium.com = conversion site.
- **Trigger:** deep-dive technical articles (machining guides, grade comparisons) that reference custom fabrication, tolerance capabilities, or an RFQ.
- **Execution:** one contextual in-body link to the relevant landing page or homepage of `cnctitanium.com`.

### 1.2 Reciprocal/two-way linking ALLOWED
- **Trigger 1 — brand cross-verification:** cnctitanium.com `About` / `Company Footprint` / `Knowledge Hub` linking to `titanium.blog` as the official editorial knowledge base.
- **Trigger 2 — citation / proof of expertise:** cnctitanium.com product/service pages linking to a specific technical whitepaper or material guide on `titanium.blog` to justify claims.
- **Requirement:** reciprocal links MUST be contextualized with clear human rationale (e.g. "Read our engineering analysis on Grade 23 Ti-6Al-4V ELI in our blog").

### 1.3 Reciprocal/two-way linking FORBIDDEN
- Automated 1:1 cross-linking schemes (every blog article → B, and B auto-links back).
- Site-wide footer/sidebar reciprocal link exchanges ("Partner Sites", "Links" widgets).

## 2. Link Creation Rules

### 2.1 WHEN LINKING IS ALLOWED
1. **Contextual relevance:** the target adds immediate informational/transactional value to that paragraph.
2. **Authority citations:** official standards (ASTM, ISO), academic papers, Wikipedia, material spec sheets.
3. **CTA & RFQ direction:** guiding readers from educational content to quote forms/service pages on `cnctitanium.com`.

### 2.2 WHEN LINKING IS FORBIDDEN
1. **Sitewide / boilerplate placement:** never insert outbound cross-site links in global header, footer, or sidebar templates (`<footer>`, `<aside>`).
2. **Exact-match keyword stuffing:** never over-optimize commercial anchor text for 100% of links (e.g. repeated "best cheap cnc titanium factory").
3. **Low-quality / unvetted targets:** never link to unverified blogs, spammy directories, or irrelevant niche sites.
4. **Duplicate anchor text loops:** avoid multiple links to the same external URL with identical anchor text in one article.

## 3. Code Standards & Attribute Matrix

Map links to a `relationship` on `OutboundLink`; it outputs the attributes below:

| relationship | rel | target |
| :--- | :--- | :--- |
| `editorial` (valuable cross-site, in-content) | `noopener` | `_blank` |
| `sponsored` (paid / affiliate) | `sponsored noopener` | `_blank` |
| `ugc` (user-generated content / comments) | `ugc nofollow` | — |
| `untrusted` (uncertain / unverified external) | `nofollow noopener` | — |
| `internal` (same-site) | — | — |

Example:
```astro
<OutboundLink href="https://cnctitanium.com/services/5-axis" relationship="editorial">
  custom 5-axis titanium machining
</OutboundLink>
```

## 4. Execution Self-Audit Checklist
Before committing any content with external links, confirm:
- [ ] Link is inside body content (`<article>`, `<main>`), not `<footer>`/`<aside>`.
- [ ] Anchor text is natural and descriptive (brand, domain, phrase), not keyword-stuffed.
- [ ] External link opens in a new tab (`target="_blank" rel="noopener"`) via `OutboundLink`.
- [ ] Commercial/paid links are tagged `sponsored`; untrusted sources are `nofollow`.

## 5. Single-Chain vs. Reciprocal Decision Logic (Editorial Guide)
- **One-way (default):** most articles. Blog captures top-of-funnel intent and funnels weight + high-intent buyers one-way to the money site (e.g. a natural "submit your drawings to our CNC shop" mention linking out).
- **Reciprocal (rare, content-complementary only):** authority cross-verification (about/KB ↔ blog) or citation/proof-of-expertise (service page ↔ in-depth guide). Never mechanical, never sitewide.
- **Never:** footer/sidebar reciprocal widgets, over-optimized anchors, or automated A↔B loops.
