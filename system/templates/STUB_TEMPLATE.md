---
title: "{{TITLE}}"
description: "{{DESCRIPTION}}"
locale: en
# Required for the audit to surface CD-7 / engineering-density signal.
materials: []
industries: []
standards: []
order: 0
translationKey: ""
---

# {{TITLE}}

> **Direct Answer** (1-2 sentences): {{DIRECT_ANSWER}}
>
> *Source: {{SOURCE}} (KEEP_THE_GAP if unverifiable)*

## Overview

Two to three paragraphs (≈ 150–200 words) describing what the topic is,
where it sits in the engineering landscape, and what the reader will
take away. No marketing copy; engineer-to-engineer.

## Process / Mechanism / Specification

This section carries the engineering core. Use a numeric table with at
least 3 rows (CD-7 signal — minimum 5 numeric-with-unit values
**across the whole page**, so two tables here will easily pass).

| Parameter | Typical value | Range | Source |
|-----------|---------------|-------|--------|
| Voltage   | 18 V          | 15–22 V | ASTM B600 |
| Temperature | 21 °C       | 18–25 °C | internal |
| Time      | 10 min        | 5–30 min | AMS 2488 |

A short list of the steps (CD-6 signal) follows:

1. Pre-clean with isopropanol; rinse with DI water; air-dry.
2. Mask off non-anodized regions with a chemically resistant tape.
3. Submerge in the electrolyte bath; connect the cathode; ramp voltage.
4. Hold for the target dwell time; rinse; seal in DI water at 70 °C.

## Materials and Applications

At least one paragraph (~ 100 words) describing which titanium grades
are commonly used (CP-Ti, Ti-6Al-4V, Ti-6Al-4V ELI), and which
industries consume the process (aerospace, medical, consumer). Link
to the related materials and industries in the cluster.

## Limitations and Trade-offs

≈ 150 words. Address wear resistance, hydrogen embrittlement risk,
galvanic compatibility, surface roughness effect on fatigue, and any
standards gating the use (ASTM, AMS, ISO). Engineers come here to find
what the process **cannot** do — this section is non-optional.

## Reference

- [ASTM B600 — Standard Guide for Descaling and Cleaning Titanium](https://www.astm.org/b0600-21.html)
- [AMS 2488 — Anodizing of Titanium Alloys](https://www.sae.org/standards/content/ams2488/)
- *Reference: internal data sheet (KEEP_THE_GAP when not externally published)*

---

**Audit checklist** (delete before merging):

- [ ] wordCount ≥ 600 (CD-1 BLOCK)
- [ ] paragraphCount ≥ 5 (CD-3 BLOCK)
- [ ] H2 sections ≥ 3 (CD-4 BLOCK)
- [ ] ≥ 1 table (CD-5 WARN)
- [ ] ≥ 1 list (CD-6 WARN)
- [ ] ≥ 5 numeric-with-unit values across page (CD-7 BLOCK)
- [ ] ≥ 1 external citation pattern or Reference section (CD-8 WARN)
- [ ] avg sentence length 10–25 words (CD-9 WARN)
- [ ] `pnpm audit:density-matrix` shows no new stub files
- [ ] No hardcoded colors / Tailwind palette utilities
- [ ] Frontmatter `locale`, `title`, `description`, `materials`, `industries`, `standards` populated