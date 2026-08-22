// audit.config.mjs — Page Quality Audit Tool configuration
// KEEP THE GAP friendly: standards whitelist is intentionally empty.
// Sources are read from each page's own content (frontmatter + body),
// not from a centrally maintained list — centralising standards would
// be an unauthenticated claim about authority we cannot verify.
//
// Active thresholds and rationale live in `.clinerules/audit-tool.md`
// (see also §4 of the audit plan that introduced this tool).

const ACTIVE_LOCALES = [
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
];

export default {
  site: {
    base: "https://titanium.blog",
    enOnlyNote: "system/globals/en-only-constraint.md",
  },
  locales: {
    active: ACTIVE_LOCALES,
    // EN-only modules. At runtime, _EntityDetail.astro's explicit
    // condition + MarketingLayout's AVAILABILITY fallback both treat the
    // five modules below as en-only (emit only `en` + `x-default` hreflang,
    // never the 10-locale set). The audit MUST mirror runtime — drift
    // here produces false IG-13 failures.
    enOnly: ["en"],
    enOnlyCollections: [
      "evidence",
      "procurement",
      "applications",
      "cases",
      "surfaceFinishes",
    ],
  },
  thresholds: {
    blockIds: [
      // W₀ Content Density (BLOCK = ship gate; audits source MD, not rendered DOM)
      "CD-1", "CD-2", "CD-3", "CD-4", "CD-7", "CD-10",
      // W₁ Information Gain (BLOCK = ship gate)
      "IG-1", "IG-2", "IG-3", "IG-5", "IG-10", "IG-11", "IG-12",
      // W₂ Evidence Cluster
      "EC-1", "EC-2", "EC-4", "EC-5", "EC-6", "EC-7", "EC-8",
      // W₃ Topical Cluster
      "TCG-1", "TCG-2", "TCG-3", "TCG-4",
      // W₄ Vector Cluster
      "VCS-1", "VCS-4",
      // W₅ E-E-A-T
      "EEAT-1", "EEAT-2", "EEAT-3", "EEAT-4",
    ],
    warnIds: [
      "CD-5", "CD-6", "CD-8", "CD-9",
      "IG-4", "IG-6", "IG-7", "IG-8", "IG-9", "IG-13",
      "EC-3", "EC-9", "EC-10",
      "TCG-5", "TCG-6", "TCG-7", "TCG-8",
      "VCS-2", "VCS-3", "VCS-5", "VCS-6",
      "EEAT-5",
    ],
    // EEAT is the multiplicative trust gate; the rest are additive.
    // W₀ (CD) is the foundation gate: heaviest weight, signals that
    // thin-stub source MDs fail the page regardless of DOM health.
    weights: { CD: 0.30, IG: 0.20, EC: 0.20, TCG: 0.15, VCS: 0.05, EEAT: 1.00 },
    finalThresholds: { EXCELLENT: 0.85, GOOD: 0.60, WEAK: 0.30, BROKEN: 0.0 },
  },
  standards: {
    whitelist: [],
    minCitations: 3,
    mode: "KEEP_THE_GAP",
  },
  network: { timeoutMs: 12000, maxRedirects: 5, concurrency: 6 },
  reporters: { default: ["terminal", "json"], ci: ["json"] },
  outputDir: "content/audit/reports",
};